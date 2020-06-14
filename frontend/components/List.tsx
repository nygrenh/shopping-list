import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useTypedSelector } from "../store"
import {
  List as MaterialList,
  ListItem,
  ListItemIcon,
  Checkbox,
  Button,
  TextField,
} from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import { v4 as uuidv4 } from "uuid"
import socket from "../lib/socket"
import axios from "axios"
import { useRouter } from "next/dist/client/router"
import { Dispatch } from "redux"
import OptionsMenu from "./OptionsMenu"

const useListItems = setDisconnected => {
  const originalDispatch = useDispatch()
  const dispatch: Dispatch<any> = action => {
    if (!socket.connected) {
      setDisconnected(true)
    }
    return originalDispatch(action)
  }
  const listItems = useTypedSelector(state => state.listItems)
  const addNewItem = () => {
    dispatch({ type: "CREATE_ITEM", id: uuidv4() })
  }

  const toggleChecked = (id, value) => {
    dispatch({ type: "TOGGLE_CHECKED", id, value })
  }

  const updateText = (id, value) => {
    dispatch({ type: "UPDATE_TEXT", id, value })
  }

  const removeItem = id => {
    dispatch({ type: "REMOVE_ITEM", id })
  }
  const serverDispatch = action => {
    dispatch({ ...action, fromServer: true })
  }

  const updateTasksFromServer = payload => {
    serverDispatch({ type: "UPDATE_TASKS_FROM_SERVER", payload })
  }

  return {
    listItems,
    addNewItem,
    toggleChecked,
    updateText,
    removeItem,
    serverDispatch,
    updateTasksFromServer,
  }
}

const List = () => {
  const router = useRouter()
  const id = router?.query?.id?.toString()
  const [disconnected, setDisconnected] = useState(false)
  const [error, setError] = useState(false)
  const {
    listItems,
    addNewItem,
    toggleChecked,
    updateText,
    removeItem,
    serverDispatch,
    updateTasksFromServer,
  } = useListItems(setDisconnected)
  useEffect(() => {
    ;(async () => {
      try {
        const data = await axios.get("/api/tasks", {
          headers: { Authorization: id },
        })
        updateTasksFromServer(data.data)
      } catch (_e) {
        setError(true)
      }

      if (!socket) {
        // We are on the server
        return
      }
      socket.emit("authentication", { secret: id })
      socket.on("action", action => {
        serverDispatch(action)
      })
    })()
  }, [])

  if (error) {
    return <Alert severity="error">Lataaminen ei onnistunut.</Alert>
  }

  if (!listItems) {
    return <div>Ladataan...</div>
  }

  if (disconnected) {
    return <Alert severity="error">Yhteys katkesi. Lataa sivu uudestaan.</Alert>
  }
  return (
    <>
      <OptionsMenu />
      <MaterialList>
        {listItems.map(item => (
          <ListItem key={item.id}>
            <ListItemIcon>
              <Checkbox
                onClick={() => {
                  toggleChecked(item.id, !item.checked)
                }}
                checked={item.checked}
              />
            </ListItemIcon>
            <TextField
              onChange={e => {
                updateText(item.id, e.target.value)
              }}
              fullWidth
              value={item.text}
              variant="outlined"
            />
            <Button
              onClick={() => {
                removeItem(item.id)
              }}
            >
              Poista
            </Button>
          </ListItem>
        ))}
      </MaterialList>
      <Button onClick={addNewItem} variant="outlined" fullWidth>
        Uusi
      </Button>
    </>
  )
}

export default List
