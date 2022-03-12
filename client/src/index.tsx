import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "antd/dist/antd.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./components/App";
import { configureStore } from "./stores";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

const store = configureStore({
  jobs: [],
  library: {
    documentsAvailable: 0,
    documents: [],
    ready: false,
    loading: false,
  },
  document: null,
  breadcrumbs: [],
});

const queryClient = new QueryClient();

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);
