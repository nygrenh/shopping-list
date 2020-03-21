import { createStore, applyMiddleware, combineReducers } from "redux"
import { useSelector, TypedUseSelectorHook } from "react-redux"
import { composeWithDevTools } from "redux-devtools-extension"
import streamChangesMiddleWare from "./lib/streamChangesMiddleware"

const listItemsIntialState = null

const listItemsReducer = (state = listItemsIntialState, action): ListItem[] => {
  switch (action.type) {
    case "CREATE_ITEM":
      return [...state, { id: action.id, text: "", checked: false }]
    case "TOGGLE_CHECKED":
      return state.map(item => {
        if (item.id !== action.id) {
          return item
        }
        return { ...item, checked: action.value }
      })
    case "UPDATE_TEXT":
      return state.map(item => {
        if (item.id !== action.id) {
          return item
        }
        return { ...item, text: action.value }
      })

    case "REMOVE_ITEM":
      const index = state.findIndex(o => o.id === action.id)
      return [...state.slice(0, index), ...state.slice(index + 1)]

    case "UPDATE_TASKS_FROM_SERVER":
      return action.payload
    default:
      return state
  }
}

const rootReducer = combineReducers({ listItems: listItemsReducer })

interface ListItem {
  id: string
  text: string
  checked: boolean
}

export interface RootState {
  listItems: ListItem[] | null
}

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector

export const initializeStore = () => {
  return createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(streamChangesMiddleWare)),
  )
}
