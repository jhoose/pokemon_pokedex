import React, { StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "tailwindcss/tailwind.css";

import App from "./App";

const rootElement = document.getElementById("root");
const root = ReactDOMClient.createRoot(rootElement);
const queryClient = new QueryClient();
root.render(
  <StrictMode>
  <QueryClientProvider client={queryClient}>
    <App />
    </QueryClientProvider>
  </StrictMode>
);


(window as any).tailwind.config = {
  theme: {
    extend: {
      colors: {
        'normal': '#ADA594',
        'fighting': '#A55139',
        'flying': '#9CACF6',
        'poison': '#95588A',
        'rock': '#BDA55A',
        'bug': '#ADBD20',
        'psychic': '#FA75A5',
        'ground': '#D6B65C',
        'ghost': '#6363B5',
        'steel': '#ADADC6',
        'electric': '#FFC631',
        'dragon': '#775FDF',
        'dark': '#735A4A',
        'fairy': '#F7B5F7',
        'grass': '#7BCE52',
        'ice': '#5ACDE7',
        'fire': '#F75131',
        'water': '#399CFF',
      },
    },
  },
};