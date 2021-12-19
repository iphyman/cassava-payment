import type { NextPage } from "next";
import Head from "next/head";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
`;

const Signup: NextPage = () => {
  return (
    <Container>
      <Head>
        <title>Signup | CassavaPay portal</title>
        <meta
          name="description"
          content="Signup to manage your cassavapay merchant accounts"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Hello Am Signup Page</h1>
    </Container>
  );
};

export default Signup;
