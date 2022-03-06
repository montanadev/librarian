import './Sidebar.css';
import {Layout, Menu} from "antd";
import {FileAddOutlined, FolderAddOutlined, RadiusUprightOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {Link} from "react-router-dom";
import {Api} from "../utils/Api";
import {CreateFolderModal} from "./modals/CreateFolderModal";
import {FolderModel} from "../models/Folder";
import {ResourceModel} from "../models/Resource";
import {useQuery} from 'react-query';

const {SubMenu} = Menu;
const {Sider} = Layout;


function Sidebar() {
    const [createFolderOpen, setCreateFolderOpen] = useState(false);

    const api = new Api();
    const {isLoading, error, data, isFetching} = useQuery<ResourceModel<FolderModel>>("folders", api.getFolders);

    return <div>
        <CreateFolderModal visible={createFolderOpen} onClose={() => setCreateFolderOpen(false)}/>
        <Sider width={200} className="site-layout-background">
            <Menu mode="inline"
                  defaultOpenKeys={['sub1']}
                  style={{height: '100%', borderRight: 0}}>
                <Menu.Item key="upload" icon={<FileAddOutlined/>}>
                    <Link to="/">Upload</Link>
                </Menu.Item>
                <Menu.Item key="create-folder" onClick={() => setCreateFolderOpen(true)} icon={<FolderAddOutlined/>}>
                    Create Folder
                </Menu.Item>
                {data ? data.results.map((f: FolderModel) =>
                    <SubMenu key={f.id} title={f.name} icon={f.name === 'Unsorted' ? <RadiusUprightOutlined/> : null}>
                        {f.documents ? f.documents.map(d => {
                            return <Menu.Item key={d.id}>
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