import { Layout, Menu } from "antd";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Api } from "../utils/Api";
import { FolderModel } from "../models/Folder";
import { ResourceModel } from "../models/Resource";
import { useQuery } from "react-query";
import { TagModel } from "../models/Tag";
import { FolderOpenOutlined, TagsOutlined } from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";

const { SubMenu } = Menu;
const { Sider } = Layout;

function Sidebar() {
  const { documentId, folderId } = useParams<any>();

  let collapsedInt = 0;
  if (window.localStorage.getItem("librarian.document.collapsed") !== null) {
    collapsedInt = parseInt(
      window.localStorage.getItem("librarian.document.collapsed")!
    );
  }
  const [collapsed, setCollapsed] = useState(collapsedInt === 1);

  const api = new Api();
  const folders = useQuery<ResourceModel<FolderModel>>(
    "folders",
    api.getFolders
  );
  const tags = useQuery<ResourceModel<TagModel>>("tags", api.getTags);
  return (
    <div key={`sidebar-${documentId}-${folderId}`}>
      <Sider
        collapsible
        collapsed={collapsed}
        defaultCollapsed={collapsed}
        onCollapse={(newCollapsed: boolean) => {
          if (newCollapsed) {
            window.localStorage.setItem("librarian.document.collapsed", "1");
          } else {
            window.localStorage.setItem("librarian.document.collapsed", "0");
          }
          setCollapsed(newCollapsed);
        }}
        width={200}
        className="site-layout-background"
      >
        <Header className="header AppHeader">
          {collapsed ? (
            <h3 style={{ color: "white", textAlign: "center" }}>Librarian</h3>
          ) : (
            <h3 style={{ color: "white", paddingLeft: "48px" }}>Librarian</h3>
          )}
        </Header>
        <Menu
          mode="inline"
          defaultSelectedKeys={[`document-${documentId}`]}
          style={{ height: "100%", borderRight: 0 }}
        >
          <SubMenu
            key={"folders"}
            title={"Folders"}
            icon={<FolderOpenOutlined />}
          >
            {folders.data
              ? folders.data.results.map((f: FolderModel) => (
                  <Menu.ItemGroup key={`folder-${f.id}`} title={f.name}>
                    {f.documents
                      ? f.documents.map((d) => {
                          return (
                            <Menu.Item key={`document-${d.id}`}>
                              <Link to={`/folders/${f.id}/documents/${d.id}`}>
                                {d.filename}
                              </Link>
                            </Menu.Item>
                          );
                        })
                      : []}
                  </Menu.ItemGroup>
                ))
              : null}
          </SubMenu>

          <SubMenu key={"tags"} title={"Tags"} icon={<TagsOutlined />}>
            {tags.data
              ? tags.data.results.map((t: TagModel) => (
                  <Menu.ItemGroup key={`tag-${t.id}`} title={t.name}>
                    {t.documents.map((d) => (
                      <Menu.Item key={`document-tag-${d.id}`}>
                        <Link to={`/folders/${d.folder}/documents/${d.id}`}>
                          {d.filename}
                        </Link>
                      </Menu.Item>
                    ))}
                  </Menu.ItemGroup>
                ))
              : null}
          </SubMenu>
        </Menu>
      </Sider>
    </div>
  );
}

export default Sidebar;
