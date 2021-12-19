import { createGlobalStyle } from "styled-components/macro";

export const GlobalStyle = createGlobalStyle`

*, *::before, *::after{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.no-wrap {
  white-space: nowrap;
}

html {
  min-height: 100vh;
  color: #7f7f7f;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  ::-webkit-scrollbar {
    width: 10px;
    background: #636975;
}
}

`;
