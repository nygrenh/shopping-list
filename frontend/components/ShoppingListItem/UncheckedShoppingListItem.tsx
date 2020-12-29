import React from "react"
import { ListItemIcon, Checkbox, TextField } from "@material-ui/core"
import styled from "styled-components"

const StyledListItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.1rem;
`

const StyledCheckbox = styled(Checkbox)`
  padding-bottom: 0;
  padding-top: 0;
  height: 1rem;
  color: rgb(74 69 69 / 54%);
`

const StyledTextField = styled(TextField)`
  margin-top: 0;
  margin-bottom: 0;
  .MuiOutlinedInput-notchedOutline {
    border-color: white;
  }
`

const UncheckedShoppingListItem = ({ item, toggleChecked, updateText }) => (
  <StyledListItem>
    <StyledCheckbox
      onClick={() => {
        toggleChecked(item.id, !item.checked)
      }}
      checked={item.checked}
    />

    <StyledTextField
      onChange={e => {
        updateText(item.id, e.target.value.replace(/\n/g, ''))
      }}
      fullWidth
      margin="dense"
      value={item.text}
      variant="outlined"
      multiline
      autoFocus={item.createdByUser}
    />
  </StyledListItem>
)

export default UncheckedShoppingListItem
