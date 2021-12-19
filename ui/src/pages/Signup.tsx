import { FormEvent, useState } from "react";
import { Helmet } from "react-helmet-async";
import styled from "styled-components";
import isEmail from "validator/lib/isEmail";
import isStrongPassword from "validator/lib/isStrongPassword";
import { Container, Button, Form, Spinner } from "react-bootstrap";
import { Auth } from "aws-amplify";
import { Alert } from "../components/Alert";
import type { CognitoUser } from "amazon-cognito-identity-js";
import { useNavigate } from "react-router-dom";
import { useAuthentication } from "../contexts/authentication";

const SignupForm = styled.div`
  max-width: 400px;
  height: 100%;
  margin: auto;
`;

export const Signup = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<CognitoUser | null>(null);
  const { setIsAuthenticated } = useAuthentication();
  const [input, setInput] = useState<{
    email: string;
    password: string;
    confirmPassword: string;
    confirmationCode: string;
  }>({
    email: "",
    password: "",
    confirmPassword: "",
    confirmationCode: "",
  });

  let navigate = useNavigate();

  const validateForm = (): boolean => {
    return (
      isStrongPassword(input.password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minSymbols: 1,
        minNumbers: 1,
      }) &&
      input.password === input.confirmPassword &&
      isEmail(input.email)
    );
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { user } = await Auth.signUp({
        username: input.email,
        password: input.password,
      });
      setUser(user);
      setLoading(false);
      Alert(
        "Verification code has been sent to your email, enter the code to continue",
        "info"
      );
    } catch (error) {
      setLoading(false);
      const err = error as any;
      Alert(err.message, "error");
    }
  };

  const handleConfirmSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await Auth.confirmSignUp(input.email, input.confirmationCode);
      setLoading(false);
      Alert("Signup successfull, you are now been logged in", "success");
      await Auth.signIn(input.email, input.password);
      setIsAuthenticated(true);
      navigate("/merchants");
    } catch (error) {
      setLoading(false);
      const err = error as any;
      Alert(err.message, "error");
    }
  };

  return (
    <Container>
      <SignupForm>
        {user && (
          <>
            <Helmet>
              <title>Email Confirmation | CassavaPay portal</title>
              <meta
                name="description"
                content="Confirm ownership of your email to create your account"
              />
            </Helmet>
            <Form onSubmit={handleConfirmSubmit}>
              <Form.Group controlId="confirmationCode" className="lg mb-3">
                <Form.Label>Confirmation Code</Form.Label>
                <Form.Control
                  autoFocus
                  type="tel"
                  value={input.confirmationCode}
                  onChange={(e) =>
                    setInput({ ...input, confirmationCode: e.target.value })
                  }
                />
              </Form.Group>
              <div className="d-grid gap-2">
                <Button
                  size="lg"
                  type="submit"
                  variant="primary"
                  disabled={isLoading || !input.confirmationCode}
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
                    "Confirm Email"
                  )}
                </Button>
              </div>
            </Form>
          </>
        )}
        {!user && (
          <>
            <Helmet>
              <title>Signup | CassavaPay portal</title>
              <meta
                name="description"
                content="Create an account to start receiving Reef payment in your store"
              />
            </Helmet>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="email" className="lg mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={input.email}
                  onChange={(e) =>
                    setInput({ ...input, email: e.target.value })
                  }
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="password" className="lg mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={input.password}
                  onChange={(e) =>
                    setInput({ ...input, password: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group controlId="confirmPassword" className="lg mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  onChange={(e) =>
                    setInput({ ...input, confirmPassword: e.target.value })
                  }
                  value={input.confirmPassword}
                />
              </Form.Group>
              <div className="d-grid gap-2">
                <Button
                  size="lg"
                  type="submit"
                  variant="success"
                  disabled={isLoading || !validateForm()}
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
                    "Signup"
                  )}
                </Button>
              </div>
            </Form>
          </>
        )}
      </SignupForm>
    </Container>
  );
};
