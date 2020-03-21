import Item from "./models/Item"

const handleAction = async (action: any) => {
  switch (action.type) {
    case "CREATE_ITEM":
      await Item.query().insert({
        id: action.id,
        text: "",
      })
      break
    case "TOGGLE_CHECKED":
      await Item.query()
        .findById(action.id)
        .patch({ checked: action.value })
      break
    case "UPDATE_TEXT":
      await Item.query()
        .findById(action.id)
        .patch({ text: action.value })
      break
    case "REMOVE_ITEM":
      await Item.query().deleteById(action.id)
      break
  }
}

export default handleAction
