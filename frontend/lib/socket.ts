import io from "socket.io-client"
let socket: SocketIOClient.Socket | null = null

function createSocket() {
  console.log("Creating a socket.")
  socket = io(
    process.env.NODE_ENV === "production"
      ? "shopping-list.nygren.xyz"
      : "http://localhost:3001",
  {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelayMax: 5000,
    reconnectionDelay: 1000,
  })

  socket.on("connect", () => {
    console.log(`Connected to socket.`)
  });

  socket.on("disconnect", (reason) => {
    console.log(`Socket disconnected. Reason: ${reason}`)
    if (reason === "io server disconnect") {
    }
  });
}

if (typeof window !== "undefined") {
  createSocket()
}

export default socket
