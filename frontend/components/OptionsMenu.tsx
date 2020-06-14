import React from "react"
import Button from "@material-ui/core/Button"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import styled from "styled-components"
import { Divider } from "@material-ui/core"

interface Props {
  onDeleteCheked: () => void
}

const StyledButton = styled(Button)`
  text-transform: none;
`

export default function OptionsMenu({ onDeleteCheked }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <StyledButton
        variant="outlined"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        Valikko
      </StyledButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            onDeleteCheked()
            handleClose()
          }}
        >
          Poista valitut
        </MenuItem>
      </Menu>
    </>
  )
}
