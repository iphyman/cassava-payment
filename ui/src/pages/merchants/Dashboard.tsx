import { Helmet } from "react-helmet-async";
import { Alert, Container } from "react-bootstrap";
import { Navigate, Outlet } from "react-router-dom";
import { Link as NavLink } from "../../components/Header";
import styled from "styled-components";
import { useAuthentication } from "../../contexts/authentication";

const Nav = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0px 30px 0px;
`;

const Link = styled(NavLink)`
  padding: 8px 12px;
  border-radius: 8px;
`;

export const Dashboard = () => {
  const { isAuthenticated } = useAuthentication();

  return (
    <Container>
      <Helmet>
        <title>Merchant Dashboard | CassavaPay portal</title>
        <meta
          name="description"
          content="Secured Merchant Dashboard to manage your cassavapay merchant accounts"
        />
      </Helmet>
      <Alert variant="success">
        <Alert.Heading>Hey, nice to see you</Alert.Heading>
        <p>
          Aww yeah, you have successfully created an account, one more step
          needs to be done to enable you receive payments from your website or
          store using our easy services.
        </p>
        <hr />
        <p className="mb-0">
          Yeah, you need to create a merchant account. Clicking the below button
          will generate a new merchant account for you, this api key authorizies
          any bearer to use our services. Take note of the merchant ID and api
          key;
        </p>
      </Alert>
      <Nav>
        <Link to="/merchants/">Merchant Accounts</Link>
        <Link to="/merchants/create-key">Create Merchant</Link>
        <Link to="/merchants/transactions">Transactions</Link>
      </Nav>
      <hr />
      {isAuthenticated ? <Outlet /> : <Navigate to="/login" />}
    </Container>
  );
};
