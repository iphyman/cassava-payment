import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import { PageWrapper, Title, Footer, PageContent, Logo } from "../components";
import { Header } from "../components/Header";

const PaymentForm = styled.div`
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Home: NextPage = () => {
  return (
    <PageWrapper>
      <Head>
        <title>Barber Shop | Successful</title>
        <meta
          name="description"
          content="A demo shop integrating cassavaPayment gateway"
        />
      </Head>
      <Header />
      <PageContent>
        <Title>Your payment was successfully processed</Title>
      </PageContent>

      <Footer>
        <a
          href="https://reef.io"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center" }}
        >
          Powered by{" "}
          <Logo>
            <Image src="/reef.png" alt="Reef Logo" width={30} height={30} />
          </Logo>
        </a>
      </Footer>
    </PageWrapper>
  );
};

export default Home;
