import React from "react";
import { ConfigProvider } from "antd";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";

import "./index.css";
import App from "./App";
import store from "./redux/store";
import "./Professional.css";

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={{ token: { colorPrimary: "#6d5dfc", borderRadius: 8, fontFamily: "Inter, Arial, sans-serif" } }}><App /></ConfigProvider>
    </Provider>
  </React.StrictMode>
);