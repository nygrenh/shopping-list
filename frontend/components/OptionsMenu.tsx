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

  return (
    <>
      <StyledButton
        variant="outlined"
        fullWidth
        onClick={() => {
          onDeleteCheked()
        }}
      >
        Poista ostetut ostokset
      </StyledButton>
    </>
  )
}
