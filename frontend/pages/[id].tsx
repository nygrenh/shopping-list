import React from "react"
import { withRedux } from "../lib/redux"
import List from "../components/List"
import { Container, Typography } from "@material-ui/core"

const IndexPage = () => {
  return (
    <Container>
      <Typography variant="h3" component="h1">
        Ostoslista
      </Typography>
      <List />
    </Container>
  )
}

export default withRedux(IndexPage)
