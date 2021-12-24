import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Amplify from "aws-amplify";
import { DateUtils } from "@aws-amplify/core";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GlobalStyle } from "./GlobalStyle";
import { AuthenticationProvider } from "./contexts/authentication";

import "bootstrap/dist/css/bootstrap.min.css";
import { AmplifyConfig } from "./configs";

const CLOCK_OFFSET = 10000;

Amplify.configure(AmplifyConfig);
DateUtils.setClockOffset(CLOCK_OFFSET);

ReactDOM.render(
  <React.StrictMode>
    <AuthenticationProvider>
      <HelmetProvider>
        <BrowserRouter>
          <App />
          <GlobalStyle />
        </BrowserRouter>
      </HelmetProvider>
    </AuthenticationProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
