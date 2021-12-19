import styled from "styled-components";

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

const Link = styled.a`
  display: block;
  position: relative;
  padding: 0px 4px;
  margin: 0px 20px;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
  transition: color 0.25s ease-in-out;
  :hover {
    color: #0070f3;
  }
`;

export const Header = () => {
  return (
    <Nav>
      <Container>
        <Logo href="/">CassavaPay</Logo>
        <NavItems>
          <NavItem>
            <Link href="https://github.com">Github</Link>
          </NavItem>
          <NavItem>
            <Link href="/merchants">Dashboard</Link>
          </NavItem>
          <NavItem>
            <Link href="/signup">Signup</Link>
          </NavItem>
          <NavItem>
            <Link href="/login">Login</Link>
          </NavItem>
        </NavItems>
      </Container>
    </Nav>
  );
};
