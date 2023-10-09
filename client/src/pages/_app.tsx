import { ChakraProvider } from "@chakra-ui/react";

import theme from "../theme";
import { AppProps } from "next/app";
import { SnackbarProvider } from "notistack";
import '../global.css'
import AuthProvider from "../providers/AuthProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SnackbarProvider maxSnack={1}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <ChakraProvider resetCSS theme={theme}>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </ChakraProvider>
    </ SnackbarProvider >
  );
}

export default MyApp;
