import React from "react"
import CheckedShoppingListItem from "./CheckedShoppingListItem"
import UncheckedShoppingListItem from "./UncheckedShoppingListItem"

export default (props) => {
  if (props.item.checked) {
    return <CheckedShoppingListItem {...props} />
  }
  return <UncheckedShoppingListItem {...props} />
}
