import io from 'socket.io-client';
let socket: SocketIOClient.Socket | null = null;

if (typeof window !== "undefined") {
  socket = io('http://localhost:3001')
}

export default socket
