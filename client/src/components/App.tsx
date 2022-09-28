import React, { useState } from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { Layout, Menu } from "antd";
import Sidebar from "./Sidebar";
import { Link, Route, Switch } from "react-router-dom";
import SearchResults from "./search/SearchResults";
import Uploader from "./Uploader";
import Viewer from "./viewer/Viewer";
import { SearchBox } from "./search/SearchBox";
import { SetupWizard } from "./modals/SetupWizard";
import { useQuery, useQueryClient } from "react-query";
import { SettingsModel } from "../models/Settings";
import { Api } from "../utils/Api";
import { BooleanParam, useQueryParam, useQueryParams } from "use-query-params";

const { Header } = Layout;

function App() {
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const api = new Api();
  const queryClient = useQueryClient();
  const settings = useQuery<SettingsModel>("settings", api.getSettings);
  const [disableWizard, _] = useQueryParam("disableWizard", BooleanParam);

  // withSidebar embeds the sidebar into the rendered component.
  // needed to inform the sidebar what is currently selected
  const withSidebar = (children: any) => {
    return (
      <>
        <div className="flex">
          {settings.data ? (
            <SetupWizard
              settings={settings.data}
              onClose={() => {
                setSettingsModalOpen(false);
                api
                  .dismissSetupWizard()
                  .then(() => queryClient.invalidateQueries("settings"));
              }}
              visible={
                settingsModalOpen ||
                (!settings.data.dismissed_setup_wizard && !disableWizard)
              }
            />
          ) : null}
          <Sidebar />

          <div style={{ height: "100vh", width: "100%" }}>
            <Header className="header AppHeader">
              <Menu theme="dark" mode="horizontal" selectable={false}>
                <Menu.Item key="home">
                  <Link to={"/"}>Upload</Link>
                </Menu.Item>
                <Menu.Item
                  data-cy="settings"
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
