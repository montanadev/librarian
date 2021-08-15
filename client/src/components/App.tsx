import React, {useEffect} from 'react';
import './App.css';

import {Breadcrumb, Button, Input, Layout, Menu} from 'antd';
import Sidebar from "./Sidebar";
import {RootState} from "../stores";
import {useSelector} from 'react-redux';
import {useQuery} from 'react-query';
import {SetupWizard} from "./SetupWizard";
import {useState} from 'react';
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
    const history = useHistory();

    const onSearch = () => {
        if (!search) {
            // TODO - alert?
            return;
        }

        history.push(`/search?q=${encodeURIComponent(search)}`)
    }

    const {breadcrumbs} = useSelector((state: RootState) => {
        if (!state) {
            return {}
        }
        return {
            breadcrumbs: state.breadcrumbs,
        };
    });

    useEffect(() => {
        //const {isLoading, error, data} = useQuery('config', () =>
        //        fetch('http://0.0.0.0:8000/api/config/').then(res => res.json()), {retry: false});

        //if (error) {
        //    console.log(error);
        //}
    }, [])

    return (
        <Layout>
            <SetupWizard visible={wizardOpen} onClose={() => setWizardOpen(false)}/>
            <Header className="header AppHeader">
                <div className="AppLogo">
                    librarian
                </div>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                    <Menu.Item key="1"><Link to={'/'}>Home</Link></Menu.Item>
                    <Menu.Item key="2">Docs</Menu.Item>
                    <Menu.Item key="3">Search</Menu.Item>
                    <Menu.Item onClick={() => setWizardOpen(true)} key="4">Settings</Menu.Item>

                    <div key="5" className="items-center h-16 flex float-right pr-4 w-auto">
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
                <Layout style={{padding: '0 24px 24px'}}>
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
