import { useState, useEffect } from "react";
import { Alert } from "../components/Alert";
import { Alert as BAlert, Spinner } from "react-bootstrap";
import styled from "styled-components";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { QRCode } from "react-qrcode-logo";
import ReefLogo from "../assets/reef.png";
import { API } from "aws-amplify";
import { useNavigate, useParams } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const Card = styled(Container)`
  max-width: 420px;
  margin: auto;
  box-shadow: 0 0 10px 8px rgb(0 0 0 / 4%);
  padding: 1.5rem;
  position: relative;
`;

const CardHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const TimeText = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const QrContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Loader = styled.div`
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
`;

const CheckoutAmount = styled.div`
  max-width: 260px;
  width: 100%;
  border-radius: 8px;
  padding: 8px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  box-shadow: 0 0 10px 8px rgb(0 0 0 / 4%);
  margin-bottom: 1rem;
`;

export const Checkout = () => {
  const [invoice, setInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  let params = useParams();
  let navigate = useNavigate();
  let expiryTime = 0;

  const calculateTimeLeft = (expiry: number): number => {
    let timeLeftInSecs = 0;
    const now = new Date().getTime();

    if (expiry > now) {
      const time = new Date(expiry);
      const minLeft = time.getMinutes();
      const secsLeft = time.getSeconds();

      timeLeftInSecs = minLeft * 60 + secsLeft;
    }

    return timeLeftInSecs;
  };

  const loadInvoice = async () => {
    try {
      const res = await API.get("cassavaPay", `/invoices/${params.invoiceId}`, {
        body: {},
      });
      setIsLoading(false);
      setInvoice(res.data);
    } catch (error) {
      // const err = error as any;
      Alert("Invalid checkout url!", "error");
      navigate("/");
    }
  };

  useEffect(() => {
    loadInvoice();

    if (invoice && invoice.status === "expired") {
      Alert("Expired invoice", "error");
      navigate("/");
    }

    if (invoice) {
      const expiryTimestamp = new Date(invoice.expiry_time).getTime();
      // eslint-disable-next-line
      expiryTime = calculateTimeLeft(expiryTimestamp);
    }

    if (invoice && invoice.status === "expired") {
      Alert("Expired invoice", "error");
      navigate("/");
    }

    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      {isLoading && !invoice && (
        <Loader>
          <Container>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            <span>Loading invoice...</span>
          </Container>
        </Loader>
      )}

      {!isLoading && invoice && (
        <Card>
          <CardHeader>
            <div>Copy</div>
            <CountdownCircleTimer
              isPlaying
              duration={expiryTime}
              size={60}
              strokeWidth={4}
              colors={[
                ["#AA10E2", 0.33],
                ["#F7B801", 0.33],
                ["#A30000", 0.33],
              ]}
            >
              {({ remainingTime }) => {
                if (remainingTime) {
                  const minutes = Math.floor(remainingTime / 60);
                  const seconds = remainingTime % 60;

                  return (
                    <TimeText>
                      {minutes}:{seconds}
                    </TimeText>
                  );
                }
              }}
            </CountdownCircleTimer>
          </CardHeader>
          <BAlert variant="success">
            <BAlert.Heading>Hey, there!</BAlert.Heading>
            <p>
              Send exactly only REEF token to below wallet address within the
              payment window. {invoice.wallet_address}
            </p>
          </BAlert>
          <CheckoutAmount>{invoice.price} REEF</CheckoutAmount>
          <QrContainer>
            <QRCode
              logoImage={ReefLogo}
              logoHeight={60}
              logoWidth={60}
              qrStyle="dots"
              logoOpacity={1}
              eyeRadius={5}
              value={invoice.wallet_address}
              size={240}
            />
          </QrContainer>
        </Card>
      )}
    </Container>
  );
};