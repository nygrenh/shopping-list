import React, { useEffect } from "react"
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
import { v4 as uuidv4 } from "uuid"
import socket from "../lib/socket"
import axios from "axios"

const useListItems = () => {
  const dispatch = useDispatch()
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
  const {
    listItems,
    addNewItem,
    toggleChecked,
    updateText,
    removeItem,
    serverDispatch,
    updateTasksFromServer,
  } = useListItems()
  useEffect(() => {
    ;(async () => {
      const data = await axios.get("/api/tasks")
      updateTasksFromServer(data.data)
      if (!socket) {
        // We are on the server
        return
      }
      socket.on("action", action => {
        serverDispatch(action)
      })
    })()
  }, [])

  if (!listItems) {
    return <div>Loading...</div>
  }
  return (
    <>
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
