import type { NextPage } from "next";
import Head from "next/head";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
`;

const Login: NextPage = () => {
  return (
    <Container>
      <Head>
        <title>Login | CassavaPay portal</title>
        <meta
          name="description"
          content="Login to manage your cassavapay merchant accounts"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Hello Am Login Page</h1>
    </Container>
  );
};

export default Login;
