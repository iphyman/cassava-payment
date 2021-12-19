import { Helmet } from "react-helmet-async";
import {
  PageWrapper,
  Card,
  Title,
  Text,
  Grid,
  PageContent,
} from "../components";

export const Home = () => {
  return (
    <PageWrapper>
      <Helmet>
        <title>Home | Cryptocurrency Payment Gateway</title>
        <meta
          name="description"
          content="Cryptocurrency payment gateway with support for reef, ethereum and binance blockchain"
        />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>
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
          <Card to="/signup">
            <h2>Signup &rarr;</h2>
            <p>Get started today by creating a new account.</p>
          </Card>

          <Card to="/login">
            <h2>Login &rarr;</h2>
            <p>Already have an account? login to continue.</p>
          </Card>

          <Card to="https://github.com/">
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example projects.</p>
          </Card>

          <Card to="#">
            <h2>Demo &rarr;</h2>
            <p>
              Preview a demo checkout app implementing our core service API.
            </p>
          </Card>
        </Grid>
      </PageContent>
    </PageWrapper>
  );
};
