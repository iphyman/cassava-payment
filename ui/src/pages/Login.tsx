import { FormEvent, useState } from "react";
import { Helmet } from "react-helmet-async";
import styled from "styled-components";
import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";
import { Container, Button, Form, Spinner } from "react-bootstrap";
import { Auth } from "aws-amplify";
import { Alert } from "../components/Alert";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../contexts/authentication";

const LoginForm = styled.div`
  max-width: 400px;
  height: 100%;
  margin: auto;
`;

export const Login = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setIsAuthenticated, isAuthenticated } = useAuthentication();
  let navigate = useNavigate();

  if (isAuthenticated) {
    navigate("/merchants/");
  }

  const validateForm = (): boolean => {
    return (
      isEmail(email) &&
      isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1,
      })
    );
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await Auth.signIn(email, password);
      setIsLoading(false);
      Alert("Logged In successfully", "success");
      setIsAuthenticated(true);
      navigate("/merchants");
    } catch (error) {
      const err = error as any;
      Alert(err.message, "error");
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Helmet>
        <title>Login | CassavaPay portal</title>
        <meta
          name="description"
          content="Login to manage your cassavapay merchant accounts"
        />
      </Helmet>
      <LoginForm>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="lg mb-3" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              autoFocus
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="lg mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
                "Login"
              )}
            </Button>
          </div>
        </Form>
      </LoginForm>
    </Container>
  );
};
