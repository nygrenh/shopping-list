import React from "react"
import { withRedux } from "../lib/redux"
import List from "../components/List"
import { Container, Typography, CircularProgress } from "@material-ui/core"
import { useCheckPeriodically } from "../hooks/useCheckPeriodically"
import socket from "../lib/socket"
import styled from "styled-components"

const StyledTypography = styled(Typography)`
  font-size: 3rem;
  margin-top: 0.5rem;
  margin-bottom: 0.3rem;
`

const IndexPage = () => {
  const currentlyConnected = useCheckPeriodically(
    () => socket && socket.connected,
  )
  return (
    <Container>
      <StyledTypography variant="h1">
        Ostoslista{" "}
        {!currentlyConnected && (
          <>
            <CircularProgress size={25} />
          </>
        )}
      </StyledTypography>
      <List />
    </Container>
  )
}

export default withRedux(IndexPage)
