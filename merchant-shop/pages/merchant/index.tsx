import type { NextPage } from "next";
import Head from "next/head";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
`;

const MerchantDashboard: NextPage = () => {
  return (
    <Container>
      <Head>
        <title>Merchant Dashboard | CassavaPay portal</title>
        <meta
          name="description"
          content="Merchant Dashboard to manage your cassavapay merchant accounts"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Hello Am MerchantDashboard Page</h1>
    </Container>
  );
};

export default MerchantDashboard;
