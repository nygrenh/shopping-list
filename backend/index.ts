import * as Koa from "koa"
import { createServer } from "http"
import * as socketIo from "socket.io"
import * as Router from "koa-router"
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

const app = new Koa()
const router = new Router()
const server = createServer(app.callback())
const io = socketIo(server)

io.on("connection", function(socket) {
  console.log("Client connected")
  socket.on("action", function(msg) {
    console.log(`Received an action: ${JSON.stringify(msg)}`)
    handleAction(msg)
    socket.broadcast.emit("action", msg)
  })
})

router.get("/tasks", async (ctx, next) => {
  ctx.body = await Item.query()
})

app
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods())

server.listen(3001, () => {
  console.log("Server listening on port 3001.")
})
