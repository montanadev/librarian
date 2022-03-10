import './Sidebar.css';
import {Layout, Menu, Typography} from "antd";
import {FileAddOutlined, FolderAddOutlined, RadiusUprightOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {Link, useParams} from "react-router-dom";
import {Api} from "../utils/Api";
import {CreateFolderModal} from "./modals/CreateFolderModal";
import {FolderModel} from "../models/Folder";
import {ResourceModel} from "../models/Resource";
import {useQuery, useQueryClient} from 'react-query';

const {Paragraph} = Typography;
const {SubMenu} = Menu;
const {Sider} = Layout;


function Sidebar() {
    const [createFolderOpen, setCreateFolderOpen] = useState(false);
    let {documentId, folderId} = useParams<any>();

    const api = new Api();
    const folders = useQuery<ResourceModel<FolderModel>>("folders", api.getFolders);

    const openDocuments = [`document-${documentId}`];
    const openFolders = [`folder-${folderId}`];

    return <div key={`sidebar-${documentId}-${folderId}`}>
        <CreateFolderModal visible={createFolderOpen} onClose={() => setCreateFolderOpen(false)}/>
        <Sider width={200} className="site-layout-background">
            <Menu mode="inline"
                  defaultSelectedKeys={openDocuments}
                  defaultOpenKeys={openFolders}
                  style={{height: '100%', borderRight: 0}}>
                <Menu.Item key="upload" icon={<FileAddOutlined/>}>
                    <Link to="/">Upload</Link>
                </Menu.Item>
                <Menu.Item key="create-folder" onClick={() => setCreateFolderOpen(true)} icon={<FolderAddOutlined/>}>
                    Add Folder
                </Menu.Item>

                <Menu.Divider />

                {folders.data ? folders.data.results.map((f: FolderModel) =>
                    <SubMenu key={`folder-${f.id}`} title={f.name}
                             icon={f.name === 'Unsorted' ? <RadiusUprightOutlined/> : null}>
                        {f.documents ? f.documents.map(d => {
                            return <Menu.Item key={`document-${d.id}`}>
                                <Link to={`/folders/${f.id}/documents/${d.id}`}>{d.filename}</Link>
                            </Menu.Item>
                        }) : []}
                    </SubMenu>
                ) : null}
            </Menu>
        </Sider>
    </div>
}

export default Sidebar;