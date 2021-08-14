import React from 'react';
import './App.css';

import {Breadcrumb, Layout, Menu} from 'antd';
import Sidebar from "./Sidebar";
import {RootState} from "../stores";
import {useSelector} from 'react-redux';
import { useQuery } from 'react-query';
import {SetupWizard} from "./SetupWizard";
import { useState } from 'react';

const {Header, Content} = Layout;

interface AppProps {
    children: any
}

function App(props: AppProps) {
    const [wizardOpen, setWizardOpen] = useState(false)

    const {breadcrumbs} = useSelector((state: RootState) => {
        if (!state) {
            return {}
        }
        return {
            breadcrumbs: state.breadcrumbs,
        };
    });

    const { isLoading, error, data } = useQuery('config', () =>
        fetch('http://0.0.0.0:8000/api/config/').then(res => res.json())
    , {retry: false});

    if (error) {
        console.log(error);
    }

    return (
        <Layout>
            <SetupWizard visible={wizardOpen} onClose={() => setWizardOpen(false)} />
            <Header className="header AppHeader">
                <div className="AppLogo">
                    librarian
                </div>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                    <Menu.Item key="1">Home</Menu.Item>
                    <Menu.Item key="2">Docs</Menu.Item>
                    <Menu.Item key="3">Search</Menu.Item>
                    <Menu.Item onClick={() => setWizardOpen(true)} key="4">Settings</Menu.Item>
                </Menu>
            </Header>
            <Layout>
                <Sidebar/>
                <Layout style={{padding: '0 24px 24px'}}>
                    <Breadcrumb style={{margin: '16px 0'}}>
                        {breadcrumbs ? breadcrumbs.map((b) =>
                            <Breadcrumb.Item>{b}</Breadcrumb.Item>
                        ): null}
                    </Breadcrumb>
                    <Content className="AppContent">
                        {props.children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
}

export default App;
