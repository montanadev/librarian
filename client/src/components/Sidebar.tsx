import './Sidebar.css';
import {Layout, Menu} from "antd";
import {FileAddOutlined, ThunderboltOutlined, FolderAddOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Api} from "../utils/Api";
import {DocumentModel} from "../models/Document";
import {ResourceModel} from "../models/Resource";
import {CreateFolderModal} from "./modals/CreateFolderModal";
import {FolderModel} from "../models/Folder";

const {SubMenu} = Menu;
const {Sider} = Layout;


function Sidebar() {
    const [recentDocuments, setRecentDocuments] = useState<ResourceModel<DocumentModel>>();
    const [folders, setFolders] = useState<ResourceModel<FolderModel>>();
    const [createFolderOpen, setCreateFolderOpen] = useState(false);

    useEffect(() => {
        (async () => {
            const api = new Api()
            const docs = await api.getDocuments()
            setRecentDocuments(docs);
        })()
    }, []);

    useEffect(() => {
        (async () => {
            const api = new Api()
            const folders = await api.getFolders()
            setFolders(folders);
        })()
    }, [createFolderOpen])

    return <div>
        <CreateFolderModal visible={createFolderOpen} onClose={() => setCreateFolderOpen(false)}/>
        <Sider width={200} className="site-layout-background">
            <Menu
                mode="inline"
                defaultOpenKeys={['sub1']}

                style={{height: '100%', borderRight: 0}}
            >
                <Menu.Item key="upload" icon={<FileAddOutlined/>}>
                    <Link to="/">Upload</Link>
                </Menu.Item>
                <Menu.Item key="create-folder" onClick={() => setCreateFolderOpen(true)} icon={<FolderAddOutlined/>}>Create
                    Folder</Menu.Item>
                <SubMenu key="sub1" icon={<ThunderboltOutlined/>} title="Recent">
                    {recentDocuments ? recentDocuments.results.map(d =>
                        <Menu.Item key={d.id}>
                            <Link to={`/documents/${d.id}`}>{d.filename}</Link>
                        </Menu.Item>
                    ) : null}
                </SubMenu>
                {folders ? folders.results.map(f =>
                    <SubMenu key={f.id} title={f.name}>
                        {f.documents ? f.documents.map(d => {
                            return <Menu.Item key={d.id}>
                                <Link to={`/documents/${d.id}`}>{d.filename}</Link>
                            </Menu.Item>
                        }) : []}
                    </SubMenu>
                ) : null}
            </Menu>
        </Sider>
    </div>
}

export default Sidebar;