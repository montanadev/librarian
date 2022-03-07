import './Sidebar.css';
import {Layout, Menu, Typography} from "antd";
import {
    FileAddOutlined,
    FolderAddOutlined,
    RadiusUprightOutlined,
    CheckOutlined,
    HighlightOutlined
} from "@ant-design/icons";
import React, {useState} from "react";
import {Link} from "react-router-dom";
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
    const queryClient = useQueryClient();

    const api = new Api();
    const {isLoading, error, data, isFetching} = useQuery<ResourceModel<FolderModel>>("folders", api.getFolders);

    const makeEditable = (folder: FolderModel) => {
        if (folder.name === 'Unsorted') {
            return folder.name;
        }
        return <Paragraph
            editable={{
                icon: <HighlightOutlined/>,
                tooltip: 'Click to rename',
                onChange: (newFolderName) => {
                    api.renameFolder(folder.id, newFolderName).then(() => {
                        queryClient.invalidateQueries('folders');
                    })
                },
                enterIcon: <CheckOutlined/>,
            }}>{folder.name}</Paragraph>
    }

    return <div>
        <CreateFolderModal visible={createFolderOpen} onClose={() => setCreateFolderOpen(false)}/>
        <Sider width={200} className="site-layout-background">
            <Menu mode="inline"
                  defaultOpenKeys={['sub1']}
                  style={{height: '100%', borderRight: 0}}>
                <Menu.Item key="upload" icon={<FileAddOutlined/>}>
                    <Link to="/">Upload</Link>
                </Menu.Item>

                {data ? data.results.map((f: FolderModel) =>
                    <SubMenu key={f.id} title={makeEditable(f)} icon={f.name === 'Unsorted' ? <RadiusUprightOutlined/> : null}>
                        {f.documents ? f.documents.map(d => {
                            return <Menu.Item key={d.id}>
                                <Link to={`/folders/${f.id}/documents/${d.id}`}>{d.filename}</Link>
                            </Menu.Item>
                        }) : []}
                    </SubMenu>
                ) : null}

                <Menu.Item key="create-folder" onClick={() => setCreateFolderOpen(true)} icon={<FolderAddOutlined/>}>
                    Add Folder
                </Menu.Item>
            </Menu>
        </Sider>
    </div>
}

export default Sidebar;