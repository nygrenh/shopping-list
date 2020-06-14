import React from "react"
import { ListItemIcon, Checkbox, TextField } from "@material-ui/core"
import styled from "styled-components"

const StyledListItem = styled.div`
  display: flex;
  margin-bottom: 1rem;
`

const StyledCheckbox = styled(Checkbox)`
  position: relative;
  left: -10px;
`

export default ({ item, toggleChecked, updateText }) => (
  <StyledListItem>
    <StyledCheckbox
      onClick={() => {
        toggleChecked(item.id, !item.checked)
      }}
      checked={item.checked}
    />

    <TextField
      onChange={e => {
        updateText(item.id, e.target.value)
      }}
      fullWidth
      value={item.text}
      variant="outlined"
    />
  </StyledListItem>
)
