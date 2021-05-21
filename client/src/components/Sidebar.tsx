import './Sidebar.css';
import {Layout, Menu} from "antd";
import {FileAddOutlined, ThunderboltOutlined} from "@ant-design/icons";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../stores";
import {refreshLibrary} from "../actions/Library";
import {Link} from "react-router-dom";

const {SubMenu} = Menu;
const {Sider} = Layout;


function Sidebar() {
    const dispatch = useDispatch();

    const {library} = useSelector((state: RootState) => {
        if (!state) {
            return {}
        }
        return {
            library: state.library,
        };
    });

    useEffect(() => {
        dispatch(refreshLibrary)
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
                {library ? library.documents.map(d =>
                    <Menu.Item key={d.id}>
                        <Link to={`/documents/${d.id}`}>{d.filename}</Link>
                    </Menu.Item>
                ) : null}
            </SubMenu>
        </Menu>
    </Sider>
}

export default Sidebar;