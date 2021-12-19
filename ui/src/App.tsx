import { Routes, Route } from "react-router";
import styled from "styled-components";
import { Footer } from "./components";
import { AlertModel } from "./components/Alert";
import { Header } from "./components/Header";

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { Signup } from "./pages/Signup";
import { Dashboard } from "./pages/merchants/Dashboard";
import { Accounts } from "./pages/merchants/Accounts";
import { CreateApiKey } from "./pages/merchants/CreateApiKey";
import { Transactions } from "./pages/merchants/Transactions";
import { Checkout } from "./pages/Checkout";

const AppWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const PageContainer = styled.div`
  width: 100%;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export default function App() {
  return (
    <AppWrapper>
      <Header />
      <AlertModel />
      <PageContainer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/checkout/:invoiceId" element={<Checkout />} />
          <Route path="/merchants" element={<Dashboard />}>
            <Route index element={<Accounts />} />
            <Route path="create-key" element={<CreateApiKey />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageContainer>
      <Footer>
        <span>Powered by: </span>
        <a href="https://reef.io" target="_blank" rel="noopener noreferrer">
          Reef Blockchain
        </a>
      </Footer>
    </AppWrapper>
  );
}
