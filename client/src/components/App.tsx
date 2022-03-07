import React, {cloneElement, useEffect, useState} from 'react';
import './App.css';

import {Breadcrumb, Button, Input, Layout, Menu} from 'antd';
import Sidebar from "./Sidebar";
import {SetupWizardModal} from "./modals/SetupWizardModal";
import {SearchOutlined} from '@ant-design/icons';
import {useHistory} from 'react-router';
import {Link} from 'react-router-dom';

const {Header, Content} = Layout;

interface AppProps {
    children: any
}

function App(props: AppProps) {
    const [wizardOpen, setWizardOpen] = useState(false)
    const [search, setSearch] = useState<string>();
    const [breadcrumbs, setBreadcrumbs] = useState<Array<string>>([]);
    const history = useHistory();

    const onSearch = () => {
        if (!search) {
            // TODO - alert?
            return;
        }

        history.push(`/search?q=${encodeURIComponent(search)}`)
    }

    useEffect(() => {
        //const {isLoading, error, data} = useQuery('config', () =>
        //        fetch('http://0.0.0.0:8000/api/config/').then(res => res.json()), {retry: false});

        //if (error) {
        //    console.log(error);
        //}
    }, [])

    return (
        <Layout>
            <SetupWizardModal visible={wizardOpen} onClose={() => setWizardOpen(false)}/>
            <Header className="header AppHeader">
                <div className="AppLogo">
                    librarian
                </div>
                <Menu theme="dark" mode="horizontal">
                    <Menu.Item key="home"><Link to={'/'}>Home</Link></Menu.Item>
                    <Menu.Item onClick={() => setWizardOpen(true)} key="settings">Settings</Menu.Item>
                    <div className="items-center h-16 flex float-right pr-4 w-auto">
                        <Input onChange={(e) => setSearch(e.target.value)}
                               onPressEnter={onSearch}
                               type="text"
                               placeholder="Search"/>
                        <Button onClick={onSearch} className="items-center"><SearchOutlined/></Button>
                    </div>
                </Menu>

            </Header>
            <Layout>
                <Sidebar/>
                <Layout>
                    <Breadcrumb style={{margin: '16px 0'}}>
                        {breadcrumbs ? breadcrumbs.map((b, idx) =>
                            <Breadcrumb.Item key={idx}>{b}</Breadcrumb.Item>
                        ) : null}
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
