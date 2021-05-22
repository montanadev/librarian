import React from 'react';
import './Shell.css';

import {Breadcrumb, Layout, Menu} from 'antd';
import Sidebar from "./Sidebar";
import {RootState} from "../stores";
import {useSelector} from 'react-redux';

const {Header, Content} = Layout;

interface AppProps {
    children: any
}

function Shell(props: AppProps) {
    const {breadcrumbs} = useSelector((state: RootState) => {
        if (!state) {
            return {}
        }
        return {
            breadcrumbs: state.breadcrumbs,
        };
    });

    return (
        <Layout>
            <Header className="header AppHeader">
                <div className="AppLogo">
                    librarian
                </div>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                    <Menu.Item key="1">Home</Menu.Item>
                    <Menu.Item key="2">Docs</Menu.Item>
                    <Menu.Item key="3">Search</Menu.Item>
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

export default Shell;
