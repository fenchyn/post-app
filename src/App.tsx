import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import Posts from "./components/Posts";
import { Container, Typography } from "@mui/material";

const App: React.FC = () => (
  <ApolloProvider client={client}>
    <Container maxWidth='md'>
      <Typography variant="h3" gutterBottom>
        Posts
      </Typography>
      <Posts />
    </Container>
  </ApolloProvider>
);

export default App;
