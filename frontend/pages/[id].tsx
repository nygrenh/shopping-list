import React from "react"
import { withRedux } from "../lib/redux"
import ListView from "../components/ListView"
import { Container, Typography, CircularProgress } from "@material-ui/core"
import { useCheckPeriodically } from "../hooks/useCheckPeriodically"
import socket from "../lib/socket"
import styled from "styled-components"

const StyledTypography = styled(Typography)`
  font-size: 2rem;
  margin-top: 0;
  margin-bottom: 0;
  flex: 1;
`

const HeaderContainer = styled.div`
  margin-top: 1rem;
  margin-right: 1.5rem;
  display: flex;
  align-items: center;
`

const IndexPage = () => {
  const currentlyConnected = useCheckPeriodically(
    () => socket && socket.connected,
  )
  return (
    <Container>
      <HeaderContainer>
      <StyledTypography variant="h1">Ostoslista</StyledTypography>
      {!currentlyConnected && <CircularProgress size={25} />}
      </HeaderContainer>
      <ListView />
    </Container>
  )
}

export default withRedux(IndexPage)
