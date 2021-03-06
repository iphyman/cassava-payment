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

const CheckoutWalletAddress = styled.div`
  font-size: 12px;
  font-weight: 600;
  margin: 10px 0px;
`;

export const Checkout = () => {
  const [invoice, setInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  let params = useParams();
  let navigate = useNavigate();

  const secondsLeft = (expiry: any): number => {
    const now = new Date().getTime();
    const exp = new Date(expiry).getTime();
    let sec = (exp - now) / 1000;

    if (sec > 0) {
      return sec;
    }

    sec = 0;
    return sec;
  };

  useEffect(() => {
    const checkInvoice = async () => {
      try {
        const res = await API.get(
          "cassavaPay",
          `/invoices/${params.invoiceId}`,
          {}
        );
        setIsLoading(false);
        setInvoice(res.data);

        if (res && res.data) {
          if (res.data.status === "expired") {
            Alert("Expired invoice", "error");
            navigate("/", { replace: true });
          }

          if (res.data.status === "paid") {
            Alert(
              "Payment received, you will be redirected to the merchant website in 5 seconds",
              "success"
            );

            setTimeout(() => {
              window.location.replace = res.data.redirect_url;
            }, 5000);
          }
        }
      } catch (error) {
        const err = error as any;
        console.log(err);
        // Alert("Invalid checkout url!", "error");
        // navigate("/");
      }
    };

    checkInvoice();

    const interval = setInterval(() => {
      checkInvoice();
      console.log("Invoice status updated");
    }, 30000);

    return () => clearInterval(interval);
  }, [navigate, params.invoiceId]);

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

      {!isLoading && invoice && invoice.expiry_time && (
        <Card>
          <CardHeader>
            <div>Copy</div>
            <CountdownCircleTimer
              isPlaying
              duration={secondsLeft(invoice.expiry_time)}
              size={60}
              strokeWidth={4}
              colors={[
                ["#AA10E2", 0.6],
                ["#F7B801", 0.3],
                ["#A30000", 0.1],
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
              payment window.
            </p>
            <CheckoutWalletAddress>
              {invoice.wallet_address}
            </CheckoutWalletAddress>
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
