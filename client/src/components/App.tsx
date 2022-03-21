import React, { useState } from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";

import { Breadcrumb, Button, Input, Layout, Menu } from "antd";
import Sidebar from "./Sidebar";
import { SetupWizardModal } from "./modals/SetupWizardModal";
import { SearchOutlined } from "@ant-design/icons";
import { useHistory } from "react-router";
import { Link, Route, Switch } from "react-router-dom";
import Search from "./Search";
import Uploader from "./Uploader";
import Viewer from "./viewer/Viewer";

const { Header, Content } = Layout;

function App() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [search, setSearch] = useState<string>();
  const [breadcrumbs, setBreadcrumbs] = useState<Array<string>>([]);
  const history = useHistory();

  const onSearch = () => {
    if (!search) {
      // TODO - alert?
      return;
    }
    history.push({
      pathname: "/search",
      search: "?" + new URLSearchParams({ q: search }).toString(),
    });
  };

  // withSidebar embeds the sidebar into the rendered component.
  // needed to inform the sidebar what is currently selected
  const withSidebar = (children: any) => {
    return (
      <Layout>
        <Sidebar />
        <Breadcrumb style={{ margin: "16px 0" }}>
          {breadcrumbs
            ? breadcrumbs.map((b, idx) => (
                <Breadcrumb.Item key={idx}>{b}</Breadcrumb.Item>
              ))
            : null}
        </Breadcrumb>
        <Content className="AppContent">{children}</Content>
      </Layout>
    );
  };

  return (
    <Layout>
      <ToastContainer />

      <SetupWizardModal
        visible={wizardOpen}
        onClose={() => setWizardOpen(false)}
      />

      <Header className="header AppHeader">
        <div className="AppLogo">librarian</div>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="home">
            <Link to={"/"}>Home</Link>
          </Menu.Item>
          <Menu.Item onClick={() => setWizardOpen(true)} key="settings">
            Settings
          </Menu.Item>
          <li style={{ order: 2, width: "100%" }}>
            <div className="items-center h-16 flex float-right pr-4 w-auto">
              <Input
                onChange={(e) => setSearch(e.target.value)}
                onPressEnter={onSearch}
                type="text"
                placeholder="Search"
              />
              <Button onClick={onSearch} className="items-center">
                <SearchOutlined />
              </Button>
            </div>
          </li>
        </Menu>
      </Header>
      <Layout>
        <Switch>
          <Route path="/folders/:folderId/documents/:documentId/pages/:pageNumber">
            {withSidebar(<Viewer />)}
          </Route>
          <Route path="/search">{withSidebar(<Search />)}</Route>
          <Route path="/folders/:folderId/documents/:documentId">
            {withSidebar(<Viewer />)}
          </Route>
          <Route path="/">{withSidebar(<Uploader />)}</Route>
        </Switch>
      </Layout>
    </Layout>
  );
}

export default App;
