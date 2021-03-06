import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useTypedSelector } from "../store"
import { Button, Typography, Divider, Fab } from "@material-ui/core"
import { Alert } from "@material-ui/lab"
import { v4 as uuidv4 } from "uuid"
import socket from "../lib/socket"
import axios from "axios"
import { useRouter } from "next/dist/client/router"
import { Dispatch } from "redux"
import OptionsMenu from "./OptionsMenu"
import styled from "styled-components"
import List from "./List"
import useInterval from "@use-it/interval"
import AddIcon from '@material-ui/icons/Add';

let countSecondsDisconnected = 0
let counterPreviouslyRan = new Date()

const NewFab = styled(Fab)`
`

const NewFabContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

// @ts-ignore
import { usePageVisibility } from "react-page-visibility"

const useListItems = setDisconnected => {
  const originalDispatch = useDispatch()
  const dispatch: Dispatch<any> = (action, checkDisconnected = true) => {
    if (checkDisconnected && !socket.connected) {
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
    // @ts-ignore
    dispatch({ ...action, fromServer: true }, false)
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
  color: #656565;
`

const ListWrapper = styled.div`
  margin: 0 0.5rem;
  margin-bottom: 0.5rem;
`

const ListView = () => {
  const router = useRouter()
  const id = router?.query?.id?.toString()
  const [disconnected, setDisconnected] = useState(false)
  const [error, setError] = useState(false)
  const [refreshToggle, setRefreshToggle] = useState(false)
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

  const pageIsVisible = usePageVisibility()

  useInterval(() => {
    const now = new Date()
    const timeDifferenceSeconds =
      (counterPreviouslyRan.getTime() - now.getTime()) / 1000
    counterPreviouslyRan = now
    if (timeDifferenceSeconds >= 10) {
      // we've been sleeping, time to refresh
      setRefreshToggle(v => !v)
    }
    if (socket.connected) {
      countSecondsDisconnected = 0
      return
    }
    if (
      countSecondsDisconnected > 1 &&
      countSecondsDisconnected < 20 &&
      countSecondsDisconnected % 2 === 0
    ) {
      socket.connect()
    }
    countSecondsDisconnected = countSecondsDisconnected + 1
  }, 1000)

  useEffect(() => {
    updateTasksFromServer(null)

    if (!pageIsVisible) {
      return
    }
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
      if (!socket.connected) {
        // Sometimes reconnection doensn't work automatically when returning
        // to the page on mobile
        socket.connect()
      }
      socket.emit("authentication", { secret: id })
      socket.on("action", action => {
        serverDispatch(action)
      })
    })()
  }, [pageIsVisible, refreshToggle])

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
          <NewFabContainer>
            <NewFab onClick={addNewItem} color="primary">
              <AddIcon />
            </NewFab>
          </NewFabContainer>
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
