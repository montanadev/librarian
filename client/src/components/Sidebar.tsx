import './Sidebar.css';
import {Layout, Menu} from "antd";
import {FileAddOutlined, ThunderboltOutlined} from "@ant-design/icons";
import React, {useEffect} from "react";
import {Link} from "react-router-dom";
import {Api} from "../utils/Api";
import {DocumentModel} from "../models/Document";

const {SubMenu} = Menu;
const {Sider} = Layout;


function Sidebar() {
    const [documents, setLibrary] = React.useState<Array<DocumentModel>>([]);

    useEffect(() => {
        const api = new Api()
        const getLibrary = async () => {
            setLibrary(await api.getDocuments());
        }
        getLibrary();
    }, [])

    return <Sider width={200} className="site-layout-background">
        <Menu
            mode="inline"
            defaultOpenKeys={['sub1']}

            style={{height: '100%', borderRight: 0}}
        >
            <Menu.Item key="link" icon={<FileAddOutlined/>}>
                <Link to="/">Upload</Link>
            </Menu.Item>
            <SubMenu key="sub1" icon={<ThunderboltOutlined/>} title="Recent">
                {documents.length ? documents.map(d =>
                    <Menu.Item key={d.id}>
                        <Link to={`/documents/${d.id}`}>{d.filename}</Link>
                    </Menu.Item>
                ) : null}
            </SubMenu>
        </Menu>
    </Sider>
}

export default Sidebar;