import io from "socket.io-client"
let socket: SocketIOClient.Socket | null = null

if (typeof window !== "undefined") {
  socket = io(
    process.env.NODE_ENV === "production"
      ? "shopping-list.nygren.xyz"
      : "http://localhost:3001",
  {
    reconnection: true,
    reconnectionAttempts: Number.MAX_VALUE,
    reconnectionDelayMax: 5000,
    reconnectionDelay: 1000
  })
}

export default socket
