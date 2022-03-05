import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import App from './components/App';
import {configureStore} from "./stores";
import {Provider} from "react-redux";
import Uploader from "./components/Uploader";
import {HashRouter, Route, Switch} from "react-router-dom";
import Viewer from "./components/Viewer";
import {QueryClient, QueryClientProvider} from 'react-query';
import Search from "./components/Search";

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

const queryClient = new QueryClient()

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <HashRouter>
                <QueryClientProvider client={queryClient}>
                    <App>
                        <Switch>
                            <Route path="/folders/:folderId/documents/:documentId">
                                <Viewer/>
                            </Route>
                            <Route path="/search">
                                <Search/>
                            </Route>
                            <Route path="/">
                                <Uploader/>
                            </Route>
                        </Switch>
                    </App>
                </QueryClientProvider>
            </HashRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
