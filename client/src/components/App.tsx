import React, { useState } from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { Layout, Menu } from "antd";
import Sidebar from "./Sidebar";
import { SettingsModal } from "./modals/SettingsModal";
import { Link, Route, Switch } from "react-router-dom";
import SearchResults from "./search/SearchResults";
import Uploader from "./Uploader";
import Viewer from "./viewer/Viewer";
import { SearchBox } from "./search/SearchBox";

const { Header, Content } = Layout;

function App() {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // withSidebar embeds the sidebar into the rendered component.
  // needed to inform the sidebar what is currently selected
  const withSidebar = (children: any) => {
    return (
      <>
        <div className="flex">
          <Sidebar />
          <div style={{ height: "100vh", width: "100%" }}>
            <Header className="header AppHeader">
              <Menu theme="dark" mode="horizontal">
                <Menu.Item key="home">
                  <Link to={"/"}>Upload</Link>
                </Menu.Item>
                <Menu.Item
                  data-cy='settings'
                  onClick={() => setSettingsModalOpen(true)}
                  key="settings"
                >
                  Settings
                </Menu.Item>
                <SearchBox />
              </Menu>
            </Header>
            <div style={{ padding: "20px 20px 0px 20px" }}>{children}</div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <ToastContainer />

      {settingsModalOpen && (
        <SettingsModal visible onClose={() => setSettingsModalOpen(false)} />
      )}

      <Switch>
        <Route path="/folders/:folderId/documents/:documentId/pages/:pageNumber">
          {withSidebar(<Viewer />)}
        </Route>
        <Route path="/search">{withSidebar(<SearchResults />)}</Route>
        <Route path="/folders/:folderId/documents/:documentId">
          {withSidebar(<Viewer />)}
        </Route>
        <Route path="/">{withSidebar(<Uploader />)}</Route>
      </Switch>
    </>
  );
}

export default App;
