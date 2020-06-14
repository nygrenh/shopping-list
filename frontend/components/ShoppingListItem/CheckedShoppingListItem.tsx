import React from "react"
import { ListItemIcon, Checkbox, Typography } from "@material-ui/core"
import styled from "styled-components"

const StyledTypography = styled(Typography)`
  text-decoration: line-through;
`

const StyledCheckbox = styled(Checkbox)`
  color: #646464 !important;
  position: relative;
  left: -10px;
`

const StyledListItem = styled.div`
  display: flex;
  margin-bottom: 0;
  align-items: center;
`

export default ({ item, toggleChecked, updateText }) => (
  <StyledListItem key={item.id}>
    <StyledCheckbox
      onClick={() => {
        toggleChecked(item.id, !item.checked)
      }}
      checked={item.checked}
    />

    <StyledTypography>{item.text}</StyledTypography>
  </StyledListItem>
)
