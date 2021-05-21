import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import Shell from './components/Shell';
import {configureStore} from "./stores";
import {Provider} from "react-redux";
import Uploader from "./components/Uploader";
import {HashRouter, Route, Switch} from "react-router-dom";
import Viewer from "./components/Viewer";

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

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <HashRouter>
                <Shell>
                    <Switch>
                        <Route path="/documents/:documentId">
                            <Viewer/>
                        </Route>
                        <Route path="/">
                            <Uploader/>
                        </Route>
                    </Switch>
                </Shell>
            </HashRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
