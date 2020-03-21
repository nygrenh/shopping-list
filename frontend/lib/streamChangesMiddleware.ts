import socket from "./socket"

const streamChangesMiddleWare = store => next => action => {
  if (socket !== null && !action.fromServer) {
    socket.emit("action", action)
  }
  let result = next(action)

  return result
}

export default streamChangesMiddleWare
