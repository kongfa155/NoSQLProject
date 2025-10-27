// src/main.js
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";
import App from "./routes/App";
import "nprogress/nprogress.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={<div>Đang tải dữ liệu...</div>} persistor={persistor}>
      <BrowserRouter basename="/NoSQLProject">
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
