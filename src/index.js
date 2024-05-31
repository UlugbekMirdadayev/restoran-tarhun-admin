import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Router from "./Router";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ToastContainer } from "react-toastify";
import { MantineProvider } from "@mantine/core";
import { themes } from "./utils/constants";
import "react-toastify/dist/ReactToastify.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ToastContainer position="top-center" autoClose={500} />
    <BrowserRouter>
      <MantineProvider theme={themes}>
        <Router />
      </MantineProvider>
    </BrowserRouter>
  </Provider>
);
