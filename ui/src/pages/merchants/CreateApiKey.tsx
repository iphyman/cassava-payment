import { FormEvent, useState } from "react";
import { Helmet } from "react-helmet-async";
import styled from "styled-components";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { Alert } from "../../components/Alert";
import { API } from "aws-amplify";
import { useNavigate } from "react-router-dom";

const CreateApiKeyForm = styled.div`
  max-width: 400px;
  height: 100%;
  margin: auto;
`;

export const CreateApiKey = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState<{
    label: string;
    description: string;
    cold_wallet_address: string;
  }>({
    label: "",
    description: "",
    cold_wallet_address: "",
  });

  let navigate = useNavigate();

  const validateForm = (): boolean => {
    return !!input.label && !!input.cold_wallet_address;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await API.post("cassavaPay", "/merchant/signup", {
        body: JSON.stringify(input),
      });
      Alert("New Merchant account creation successful", "success");
      setIsLoading(false);
      navigate("/merchants/");
    } catch (error) {
      const err = error as any;
      Alert(err.message, "error");
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Helmet>
        <title>Create Merchant Account | CassavaPay portal</title>
        <meta
          name="description"
          content="Create cassavapay merchant accounts"
        />
      </Helmet>
      <CreateApiKeyForm>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="lg mb-3" controlId="label">
            <Form.Label>Label</Form.Label>
            <Form.Control
              autoFocus
              type="text"
              value={input.label}
              onChange={(e) => setInput({ ...input, label: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="lg mb-3" controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              value={input.description}
              onChange={(e) =>
                setInput({ ...input, description: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="lg mb-3" controlId="wallet">
            <Form.Label>Wallet Address</Form.Label>
            <Form.Control
              type="text"
              value={input.cold_wallet_address}
              onChange={(e) =>
                setInput({ ...input, cold_wallet_address: e.target.value })
              }
            />
            <Form.Text className="text-muted">
              Ensure you have access to this wallet, all fund received from
              invoice generated with this key will be forwarded to this account.
            </Form.Text>
          </Form.Group>
          <div className="d-grid gap-2">
            <Button
              variant="primary"
              size="lg"
              type="submit"
              disabled={!validateForm() || isLoading}
            >
              {isLoading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                "Generate Api key"
              )}
            </Button>
          </div>
        </Form>
      </CreateApiKeyForm>
    </Container>
  );
};
