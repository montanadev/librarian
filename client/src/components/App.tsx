import React, { useState } from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { Layout, Menu } from "antd";
import Sidebar from "./Sidebar";
import { SettingsModal } from "./modals/SettingsModal";
import { Link, Route, Switch } from "react-router-dom";
import SearchResults from "./SearchResults";
import Uploader from "./Uploader";
import Viewer from "./viewer/Viewer";
import { Searchbar } from "./Searchbar";

const { Header, Content } = Layout;

function App() {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // withSidebar embeds the sidebar into the rendered component.
  // needed to inform the sidebar what is currently selected
  const withSidebar = (children: any) => {
    return (
      <Layout>
        <Sidebar />
        <Content>{children}</Content>
      </Layout>
    );
  };

  return (
    <>
      <ToastContainer />

      {settingsModalOpen && (
        <SettingsModal visible onClose={() => setSettingsModalOpen(false)} />
      )}

      <Header className="header AppHeader">
        <div className="AppLogo">librarian</div>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="home">
            <Link to={"/"}>Upload</Link>
          </Menu.Item>
          <Menu.Item onClick={() => setSettingsModalOpen(true)} key="settings">
            Settings
          </Menu.Item>
          <Searchbar />
        </Menu>
      </Header>
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
