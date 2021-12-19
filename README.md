# Code repository for cassava Pay

An open source non custodial cryptocurrency payment gateway offering merchants easy integration to their store or website.

### [Disclaimer] this is not yet a production ready software but a prototype, a more secure and well tested service will be found on cassavaSwap org repository [https://github.com/cassavaswap]

## Design

This project is designed in a modular manner offering easy extention of the project to other blockchain.

## Api keys:

- pro-api-key: CsfbsxM8iQ4UTFFlJuskY7NqOfeUH8mAacOmQa2f
- free-forever-api-key: LlLgG3EmAG4XJX3cJ2Mh94Jg3TpklS5o2FIfZLhc

## Rest Endpoints:

- POST - https://wepkqk8q5l.execute-api.us-west-2.amazonaws.com/dev/merchant/signup
- POST - https://wepkqk8q5l.execute-api.us-west-2.amazonaws.com/dev/invoices
- GET - https://wepkqk8q5l.execute-api.us-west-2.amazonaws.com/dev/invoices/{invoiceId}
- GET - https://wepkqk8q5l.execute-api.us-west-2.amazonaws.com/dev/invoices/{invoiceId}
- GET - https://wepkqk8q5l.execute-api.us-west-2.amazonaws.com/dev/invoices
- GET - https://wepkqk8q5l.execute-api.us-west-2.amazonaws.com/dev/invoices
- GET - https://wepkqk8q5l.execute-api.us-west-2.amazonaws.com/dev/merchants/accounts
- GET - https://wepkqk8q5l.execute-api.us-west-2.amazonaws.com/dev/merchants/transactions

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
