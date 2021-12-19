import { Auth } from "aws-amplify";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { useAuthentication } from "../contexts/authentication";
import { Alert } from "./Alert";

const activeclassname = "active";

const Nav = styled.nav`
  width: 100%;
  height: 72px;
  background-color: #ffffff;
  line-height: 72px;
  color: #000000;
  z-index: 200;
`;

const Container = styled.div`
  width: 100%;
  max-width: 768px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.a`
  text-decoration: none;
  font-size: 24px;
  letter-spacing: 1px;
  color: #0070f3;
  text-transform: uppercase;
  font-weight: 700;
`;

const NavItems = styled.ul`
  list-style: none;
  display: inline-block;
  transition: transform 0.4s ease-in-out;
`;

const NavItem = styled.li`
  display: inline-block;
`;

export const Link = styled(NavLink).attrs({
  activeclassname,
})`
  display: block;
  position: relative;
  padding: 0px 8px;
  margin: 0px 20px;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
  color: #000000;
  transition: color 0.25s ease-in-out;
  :hover,
  &.${activeclassname} {
    background-color: #0070f3;
    color: #ffffff;
  }
`;

export const Header = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuthentication();

  const logout = async () => {
    try {
      await Auth.signOut();
      setIsAuthenticated(false);
      Alert("Logout successfully", "info");
    } catch (error) {}
  };

  return (
    <Nav>
      <Container>
        <Logo href="/">CassavaPay</Logo>
        <NavItems>
          <NavItem>
            <Link to="https://github.com">Github</Link>
          </NavItem>
          {isAuthenticated ? (
            <>
              <NavItem>
                <Link to="/merchants/">Merchants</Link>
              </NavItem>
              <NavItem>
                <Link to="/" onClick={logout}>
                  Logout
                </Link>
              </NavItem>
            </>
          ) : (
            <>
              <NavItem>
                <Link to="/signup">Signup</Link>
              </NavItem>
              <NavItem>
                <Link to="/login">Login</Link>
              </NavItem>
            </>
          )}
        </NavItems>
      </Container>
    </Nav>
  );
};
