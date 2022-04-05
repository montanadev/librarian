import "./Sidebar.css";
import { Layout, Menu, Typography } from "antd";
import { FileAddOutlined, FolderAddOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Api } from "../utils/Api";
import { CreateFolderModal } from "./modals/CreateFolderModal";
import { FolderModel } from "../models/Folder";
import { ResourceModel } from "../models/Resource";
import { useQuery } from "react-query";
import { TagModel } from "../models/Tag";

const { Paragraph } = Typography;
const { SubMenu } = Menu;
const { Sider } = Layout;

function Sidebar() {
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  let { documentId, folderId } = useParams<any>();

  const api = new Api();
  const folders = useQuery<ResourceModel<FolderModel>>(
    "folders",
    api.getFolders
  );

  const tags = useQuery<ResourceModel<TagModel>>("tags", api.getTags);

  const openDocuments = [`document-${documentId}`];

  return (
    <div key={`sidebar-${documentId}-${folderId}`}>
      {createFolderOpen && (
        <CreateFolderModal onClose={() => setCreateFolderOpen(false)} />
      )}
      <Sider width={200} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={openDocuments}
          defaultOpenKeys={["folders"]}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item
            key="create-folder"
            onClick={() => setCreateFolderOpen(true)}
            icon={<FolderAddOutlined />}
          >
            Add Folder
          </Menu.Item>

          <Menu.Divider />

          <SubMenu key={"folders"} title={"Folders"}>
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

          <SubMenu key={"tags"} title={"Tags"}>
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
