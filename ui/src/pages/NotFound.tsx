import { Helmet } from "react-helmet-async";
import Container from "react-bootstrap/Container";
import styled from "styled-components";

const Text = styled.h1`
  text-align: center;
`;

export const NotFound = () => {
  return (
    <Container>
      <Helmet>
        <title>404 | CassavaPay portal</title>
        <meta name="description" content="No page matched the url" />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>
      <Text>Hello there! No page found</Text>
    </Container>
  );
};
