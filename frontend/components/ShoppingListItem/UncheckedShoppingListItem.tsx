import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useTypedSelector } from "../../store"
import { ListItem, ListItemIcon, Checkbox, TextField } from "@material-ui/core"

export default ({ item, toggleChecked, updateText }) => (
  <ListItem key={item.id}>
    <ListItemIcon>
      <Checkbox
        onClick={() => {
          toggleChecked(item.id, !item.checked)
        }}
        checked={item.checked}
      />
    </ListItemIcon>
    <TextField
      onChange={e => {
        updateText(item.id, e.target.value)
      }}
      fullWidth
      value={item.text}
      variant="outlined"
    />
  </ListItem>
)
