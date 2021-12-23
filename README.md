# Code repository for cassava Pay

[![Netlify Status](https://api.netlify.com/api/v1/badges/97533f6f-5bb3-48d0-9a3e-56c159986c37/deploy-status)](https://app.netlify.com/sites/cassavapay/deploys)

An open source non custodial cryptocurrency payment gateway offering merchants easy integration to their store or website.

[Disclaimer] this is not yet a production ready software but a prototype, a more secure and well tested service will be found on [CassavaSwap org repository](https://github.com/cassavaswap)

## Overview

When the service API receive a request to create a new invoice, it generate a new wallet account for the blockchain specified in the request body.
This newly created wallet account mnemonic is then encrypted with aws KMS and then stored in database.
The reef blockchain is monitored listening for every transferKeepAlive, transfer and balances events contained in extrinsic. If it finds any of our watched address, it then forwards the following details from the signed extrinsic to a function that forward's the fund to merchant cold wallet, stores it in database and update transaction status:

- signer (From address)
- destination (To address)
- value (Transaction amount)

A cron job runs every 2 minutes to update invoice status and another checks for balance updates. This has advantages over subscribing each invoice for balance update.
We can have a single instance of lambda watching the blockchain for balance update for longer period against spinning a new instance on every invoice.

In production the cron runtime will be shorten to 40 seconds which is reef blockchain transaction finality interval.

## Demo endpoints

- BASE API URL - https://o7nts8jxsa.execute-api.us-west-2.amazonaws.com/dev
- Merchant shop - https://mybarber-shop.netlify.app/
- Service Ui - https://cassavapay.netlify.app/

## Test Api keys:

- pro-api-key: F96XhoM4FG3CXqlBU5Ptn30E7aQSN8te5QMDfkCz
- free-forever-api-key: 69JPsEkoUq30HtwT8em8h63rFHpB6Y3o3raGV9ij

## Restful Endpoints:

- CREATE INVOICE
  - POST - v1/invoices
- FETCH INVOICE
  - GET - v1/invoices/{invoiceId}
- FETCH INVOICES
  - GET - v1/invoices

You can obtain credentials to make API calls from our [service UI](https://cassavapay.netlify.app). Every API call requires authentication, you will need to add ` x-api-key` header to your request.

## How It Works

To get started is easy only taking few minutes to integrate the service to your store or website no much coding skill needed just copy and paste. Three simple steps to get you started.

## - Create a user account

- [required]
  - A valid email address (will be confirmed)
  - A strong password (at least 8 characters long with a combination of an uppercase, lowercase and a special character)

One more step is needed before you can generate payment invoices for your clients.

## - Create Merchant Account

You need to create a merchant account, click the create merchant nav link after you must have authenticated (logged in). A form will appear for you to fill after ward click generate API key button to finalize your merchant account creation. The following data are required to issue a new API key.

- [required]
  - Label (a name for your use case)
  - description ([optional] a description for your use case)
  - wallet address (Reef wallet address where received payments are forwarded to ASAP)

On successfull processing of the create merchant account request, the following unique data are generated for you. keep them safe as any one with these keys can authenticate with the payment service as you.

- Merchant ID
- API key

You will need this 2 piece of data to authenticate with our service RESTFUL endpoints

You might expeirence slow response from the service. This think is caused by the sandbox mongoDb client.

## Tech stack

- [] Typescript
- [] Amazon ApiGateway
- [] Amazon Key management service (KMS)
- [] Amazon Amplify
- [] MongoDb

## How to generate invoice

From your website or store send a post request to our invoice endpoint, if your request is processed successfully you will receive a json response containing a redirect url and an invoice id.

The easiest way to accept payment is to redirect your customers to our checkout page and successful processing of the transaction, your client is redirected back to your platform.

You can also query our GET invoice endpoint with this returned invoice ID to get the invoice details if you want to handle displaying the information to your client. You can also poll on this endpoint every minute to get transaction status of the invoice.

Sample request

```JSON
{
  "item_description": "hello buy bitcoin easily with reef",
  "merchant_id": "123dffffff",
  "price": 23,
  "blockchain": "REEF",
  "redirect_url": "http://google.com",
  "close_url": "https://facebook.com"
}
```

On successful processing of the request, you will receive a response as below;

```JSON
{
    "data": {
        "url": "https://cassavapay.netlify.app/checkout/61bfbba2b77a09da7cd976a6",
        "invoice_id": "61bfbba2b77a09da7cd976a6"
    },
    "message": "success"
}
```

Do not rely on the response header, always check the response body. A valid response will always contain data and message "success".
To process this invoice you need to redirect your clients to the url or you can fetch the invoice details and display to your client.
Remember to include x-api-key in the header of your request.

A successful GET INVOICE request response will look like below.

```JSON
{
    "data": {
        "_id": "61bf7c4860f7730a19c3b521",
        "item_description": "hello buy bitcoin easily with reef",
        "merchant_id": "123dffffff",
        "wallet_address": "5CPru7d18deNyKS9YyT4S9J9k84NFsSb34P1LeNuhtwue3Wx",
        "currency": "USD",
        "price": 23,
        "amount_paid": 0,
        "redirect_url": "http://google.com",
        "close_url": "https://facebook.com",
        "expiry_time": "2021-12-19T19:09:02.155Z",
        "watched_address": false,
        "status": "expired",
        "created_at": "2021-12-19T18:39:04.971Z",
        "updated_at": "2021-12-19T23:57:55.141Z",
        "__v": 0
    },
    "message": "success"
}
```

## API Folder structure

- functions
  - admin
  - create-apiKey
  - create-invoice
  - cron
  - get-invoice
  - get-invoices
  - merchant
- libs
  - configs
  - constants
  - errors
  - invoice
  - kms
  - merchant
  - mongodb
  - reef
  - response
  - schemas
- models
- resources
- typings
