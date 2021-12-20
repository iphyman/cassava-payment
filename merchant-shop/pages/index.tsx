import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import {
  PageWrapper,
  Card,
  Title,
  Footer,
  Grid,
  PageContent,
  Logo,
} from "../components";
import { Header } from "../components/Header";
import fetch from "unfetch";
import { Alert, AlertModel } from "../components/Alert";

const Home: NextPage = () => {
  const processOrder = async (amount: number) => {
    Alert("Do not refresh the page we are processing your order", "info");

    const res = await fetch(
      "https://pykexynsl6.execute-api.us-west-2.amazonaws.com/dev/invoices",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "sWXn6ivhrM7LOSsODLiUw6vKKuuKUM9Z8WZfyqWW",
        },
        body: JSON.stringify({
          item_description: "Buy something for this dude",
          merchant_id: "1234567889",
          price: amount,
          blockchain: "REEF",
          redirect_url: "http://barbershop.netlify.app/successful",
          close_url: "http://barbershop.netlify.app",
        }),
      }
    );

    const { url } = await res.json();

    if (url) return (window.location.href = url);
    Alert(
      "We are unable to process your request now, try again later",
      "error"
    );
  };

  return (
    <PageWrapper>
      <Head>
        <title>Barber Shop | Home</title>
        <meta
          name="description"
          content="A demo shop integrating cassavaPayment gateway"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <PageContent>
        <Title>
          Welcome to <a href="#">Barber Shop</a>
        </Title>

        <Grid>
          <Card onClick={() => processOrder(20)}>
            <h2>Buy me a beer</h2>
            <p>Click to pay for 20 REEF for this guys beer.</p>
          </Card>

          <Card onClick={() => processOrder(30)}>
            <h2>Buy me shawarmer</h2>
            <p>Click to pay 30 REEF for this guys sharwarmer.</p>
          </Card>
        </Grid>
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
      <AlertModel />
    </PageWrapper>
  );
};

export default Home;
