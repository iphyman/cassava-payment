import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import {
  PageWrapper,
  Card,
  Title,
  Footer,
  Text,
  Grid,
  PageContent,
  Logo,
} from "../components";
import { Header } from "../components/Header";

const Home: NextPage = () => {
  return (
    <PageWrapper>
      <Head>
        <title>Cryptocurrency Payment Gateway | Home</title>
        <meta
          name="description"
          content="Cryptocurrency payment gateway with support for reef, ethereum and binance blockchain"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <PageContent>
        <Title>
          Welcome to <a href="https://cassavaswap.com">CassavaPay</a>
        </Title>

        <Text>
          CassavaPay is an opensource non-custodial cryptocurrency payment
          gateway, we only manage code and infrastructure. Your customers can
          now pay you with any of REEF, REEF20, ETH, ERC20, BNB, BEP20 tokens.
        </Text>

        <Grid>
          <Card href="https://cassavaswap.com">
            <h2>Signup &rarr;</h2>
            <p>Get started today by creating a new account.</p>
          </Card>

          <Card href="https://cassavaswap.com">
            <h2>Login &rarr;</h2>
            <p>Already have an account? login to continue.</p>
          </Card>

          <Card href="https://github.com/">
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example projects.</p>
          </Card>

          <Card href="#">
            <h2>Demo &rarr;</h2>
            <p>
              Preview a demo checkout app implementing our core service API.
            </p>
          </Card>
        </Grid>
      </PageContent>

      <Footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <Logo>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </Logo>
        </a>
      </Footer>
    </PageWrapper>
  );
};

export default Home;
