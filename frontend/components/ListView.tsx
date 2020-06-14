import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useTypedSelector } from "../store"
import { Button, Typography, Divider } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import { v4 as uuidv4 } from "uuid"
import socket from "../lib/socket"
import axios from "axios"
import { useRouter } from "next/dist/client/router"
import { Dispatch } from "redux"
import OptionsMenu from "./OptionsMenu"
import styled from "styled-components"
import List from "./List"

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
    const text = listItems.find(item => item.id === id)?.text
    if (text === "") {
      return removeItem(id)
    }
    dispatch({ type: "TOGGLE_CHECKED", id, value })
  }

  const updateText = (id, value) => {
    dispatch({ type: "UPDATE_TEXT", id, value })
  }

  const removeItem = id => {
    dispatch({ type: "REMOVE_ITEM", id })
  }

  const deleteChecked = () => {
    dispatch({ type: "DELETE_CHECKED" })
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
    deleteChecked,
  }
}

const StyledDivider = styled(Divider)`
  margin: 1.5rem 0;
`

const SubTitle = styled(Typography)`
  font-size: 1rem;
  font-weight: bold;
  color: #4e4e4e;
`

const ListWrapper = styled.div`
  margin: 0 1rem;
  margin-bottom: 0.5rem;
`

const ListView = () => {
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
    deleteChecked,
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

  if (disconnected) {
    return <Alert severity="error">Yhteys katkesi. Lataa sivu uudestaan.</Alert>
  }

  const checked = listItems?.filter(item => item.checked)
  const unChecked = listItems?.filter(item => !item.checked)
  return (
    <>
      <ListWrapper>
        <List
          items={unChecked}
          updateText={updateText}
          toggleChecked={toggleChecked}
        />
        {listItems && (
          <Button onClick={addNewItem} variant="outlined" fullWidth>
            Uusi
          </Button>
        )}
      </ListWrapper>
      <StyledDivider />
      <SubTitle variant="h2">Ostetut ostokset</SubTitle>
      <ListWrapper>
        <List
          items={checked}
          updateText={updateText}
          toggleChecked={toggleChecked}
        />
      </ListWrapper>
      {checked && checked.length > 0 && (
        <OptionsMenu onDeleteCheked={deleteChecked} />
      )}
    </>
  )
}

export default ListView
