import React from "react"
import { List as MaterialList } from "@material-ui/core"
import ShoppingListItem from "./ShoppingListItem"
import { Skeleton } from "@material-ui/lab"

import styled from "styled-components"

const StyledSkeleton = styled(Skeleton)`
  margin: 1rem 0;
`

export default ({ items, updateText, toggleChecked }) => {
  if (!items) {
    return (
      <>
        <StyledSkeleton variant="rect" height={40} />
        <StyledSkeleton variant="rect" height={40} />
        <StyledSkeleton variant="rect" height={40} />
        <StyledSkeleton variant="rect" height={40} />
        <StyledSkeleton variant="rect" height={40} />
      </>
    )
  }
  return (
    <MaterialList>
      {items.map(item => (
        <ShoppingListItem
          key={item.id}
          item={item}
          updateText={updateText}
          toggleChecked={toggleChecked}
        />
      ))}
    </MaterialList>
  )
}
