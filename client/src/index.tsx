import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "antd/dist/antd.min.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./components/App";
import { HashRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter5Adapter } from "use-query-params/adapters/react-router-5";

const queryClient = new QueryClient();

ReactDOM.render(
  <HashRouter>
    <QueryParamProvider adapter={ReactRouter5Adapter}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </QueryParamProvider>
  </HashRouter>,
  document.getElementById("root")
);
