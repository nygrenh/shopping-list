import React, { useEffect, useState } from "react"
import { ListItem, ListItemIcon, Checkbox, Typography } from "@material-ui/core"
import styled from "styled-components"

const StyledTypography = styled(Typography)`
  text-decoration: line-through;
`

const StyledCheckbox = styled(Checkbox)`
  color: #646464 !important;
`

export default ({ item, toggleChecked, updateText }) => (
  <ListItem key={item.id}>
    <ListItemIcon>
      <StyledCheckbox
        onClick={() => {
          toggleChecked(item.id, !item.checked)
        }}
        checked={item.checked}
      />
    </ListItemIcon>
      <StyledTypography>{item.text}</StyledTypography>
  </ListItem>
)
