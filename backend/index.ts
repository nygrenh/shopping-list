import Koa from "koa"
import { createServer } from "http"
import { Server } from "socket.io"
import Router from "koa-router"
import Item from "./models/Item"
import { Model } from "objection"
const cors = require("@koa/cors")
import handleAction from "./handleAction"

const knexConfig = require("./knexfile")
const Knex = require("knex")
const knex = Knex(
  process.env.NODE_ENV === "production"
    ? knexConfig.production
    : knexConfig.development,
)

Model.knex(knex)

const secret = process.env.SECRET || "secret"

const app = new Koa()
const router = new Router()
const nodeServer = createServer(app.callback())
const io = new Server(nodeServer,
  {
    cors: {
      origin: "*"
    }
  })

require("socketio-auth")(io, {
  authenticate: function(socket, data, callback) {
    return callback(null, data.secret === secret)
  },
})

io.on("connection", function(socket) {
  console.log("Client connected")
  socket.on("disconnect", function(reason) {
    console.log("Client disconnected: ", reason)
  })

  socket.on("action", function(msg) {
    console.log(`Received an action: ${JSON.stringify(msg)}`)
    handleAction(msg)
    socket.broadcast.emit("action", msg)
  })
})



router.get("/api/tasks", async (ctx, next) => {
  if (ctx.req.headers.authorization !== secret) {
    ctx.status = 403
    ctx.body = { error: "Forbidden" }
    return
  }
  ctx.body = await Item.query().where({ deleted: false }).orderBy("created_at")
})

app
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods())

nodeServer.listen(3001, () => {
  console.log("Server listening on port 3001.")
})
