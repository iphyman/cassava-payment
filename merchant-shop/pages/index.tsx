import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { PageWrapper, Title, Footer, PageContent, Logo } from "../components";
import { Header } from "../components/Header";
import fetch from "unfetch";
import { Alert, AlertModel } from "../components/Alert";

interface FormInput {
  price: string;
  api_key: string;
  merchant_id: string;
  notification_url: string;
  redirect_url: string;
}

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState<FormInput>({
    price: "20",
    api_key: "",
    merchant_id: "",
    notification_url: "https://mybarber-shop.netlify.app/api/webhook",
    redirect_url: "https://mybarber-shop.netlify.app/successful",
  });

  const validateForm = () => {
    return (
      input.price &&
      input.api_key &&
      input.merchant_id &&
      input.notification_url &&
      input.redirect_url
    );
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    Alert("Do not refresh the page we are processing your order", "info");

    const res = await fetch(
      "https://o7nts8jxsa.execute-api.us-west-2.amazonaws.com/dev/v1/invoices",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers":
            "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
          "Access-Control-Allow-Methods": "OPTIONS,POST,DELETE,GET",
          "Access-Control-Allow-Credentials": "false",
          "Access-Control-Allow-Origin": "*",
          "X-Requested-With": "*",
          "x-api-key": input.api_key,
        },
        body: JSON.stringify({
          price: input.price,
          merchant_id: input.merchant_id,
          notification_url: input.notification_url,
          redirect_url: input.redirect_url,
        }),
      }
    );

    // const { url } = await res.json();
    const data = await res.json();
    console.log(data);
    setIsLoading(false);

    // if (url) return (window.location.href = url);
    // Alert(
    //   "We are unable to process your request now, try again later",
    //   "error"
    // );
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
        <form className="my-4 w-50" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              Price
            </label>
            <input
              type="text"
              className="form-control"
              id="price"
              value={input.price}
              onChange={(e) => setInput({ ...input, price: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="api-key" className="form-label">
              Api Key
            </label>
            <input
              type="text"
              className="form-control"
              id="api-key"
              value={input.api_key}
              onChange={(e) => setInput({ ...input, api_key: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="merchant_id" className="form-label">
              Merchant ID
            </label>
            <input
              type="text"
              className="form-control"
              id="merchant_id"
              value={input.merchant_id}
              onChange={(e) =>
                setInput({ ...input, merchant_id: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="notification-url" className="form-label">
              Notification url
            </label>
            <input
              type="url"
              className="form-control"
              id="notification-url"
              value={input.notification_url}
              onChange={(e) =>
                setInput({ ...input, notification_url: e.target.value })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="redirect-url" className="form-label">
              Redirect url
            </label>
            <input
              type="url"
              className="form-control"
              id="redirect-url"
              value={input.redirect_url}
              onChange={(e) =>
                setInput({ ...input, redirect_url: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 mt-3"
            disabled={!validateForm() || isLoading}
          >
            {isLoading ? (
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              "Place order"
            )}
          </button>
        </form>
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
