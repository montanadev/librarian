import React, { useRef, useState } from "react";
import "./Uploader.css";
import { useHistory, useParams } from "react-router-dom";
import { Button, Divider, Spin, Typography } from "antd";
import {
  CheckOutlined,
  HighlightOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Document, Page } from "react-pdf";
import { useContainerDimensions } from "../utils/useContainerDimenstions";
import { AddToFolderModal } from "./modals/AddToFolderModal";
import { Api } from "../utils/Api";
import { ResourceModel } from "../models/Resource";
import { FolderModel } from "../models/Folder";
import { useQuery, useQueryClient } from "react-query";
import { DocumentModel } from "../models/Document";

const { Paragraph } = Typography;

function Viewer() {
  let { documentId, folderId } = useParams<any>();
  const [openAddToFolderModal, setOpenAddToFolderModal] = useState(false);
  const queryClient = useQueryClient();
  const api = new Api();
  const history = useHistory();

  const [numPages, setNumPages] = useState(null);
  const [pdf, setPdf] = useState(null);

  const onDocumentLoadSuccess = (pdf: any) => {
    setNumPages(pdf.numPages);
    setPdf(pdf);
  };

  const folders = useQuery<ResourceModel<FolderModel>>(
    "folders",
    api.getFolders
  );

  let next: Array<number> = [];
  let prev: Array<number> = [];
  let folder: any = null;
  let document: any = null;

  if (folders.data && !folders.isLoading) {
    let entries = [];
    let foundIdx = -1;

    // flatten the folder / doc hierarchy into list
    for (let seekFolder of folders.data.results) {
      for (let seekDocument of seekFolder.documents) {
        entries.push([seekFolder.id, seekDocument.id]);
        if (
          seekDocument.id === parseInt(documentId) &&
          seekFolder.id === parseInt(folderId)
        ) {
          foundIdx = entries.length - 1;
          document = seekDocument;
          folder = seekFolder;
        }
      }
    }

    // find the doc before and after the currently loaded one
    // and use it to power the prev/next buttons
    if (foundIdx !== -1) {
      if (foundIdx - 1 < 0) {
        prev = entries[entries.length - 1];
      } else {
        prev = entries[foundIdx - 1];
      }

      if (foundIdx + 1 === entries.length) {
        next = entries[0];
      } else {
        next = entries[foundIdx + 1];
      }
    }
  }

  const containerRef = useRef<any>();
  const { width } = useContainerDimensions(containerRef);

  console.log(
    `Rendering pdf from http://0.0.0.0:8000/api/documents/${documentId}/data`
  );
  return (
    <div>
      <AddToFolderModal
        visible={openAddToFolderModal}
        onClose={() => setOpenAddToFolderModal(false)}
        onAddToFolder={(folderId: number) => {
          api.addDocumentToFolder(documentId, folderId).then(() => {
            setOpenAddToFolderModal(false);
            queryClient.invalidateQueries("folders");
          });
        }}
      />

      <div>
        {document ? (
          <Typography.Title
            style={{ margin: 0 }}
            level={1}
            editable={{
              icon: <EditOutlined style={{ fontSize: 22 }} />,
              onChange: (newDocumentName: string) => {
                api.renameDocument(document.id, newDocumentName).then(() => {
                  queryClient.invalidateQueries("folders");
                });
              },
              enterIcon: <CheckOutlined />,
            }}
          >
            {document.filename}
          </Typography.Title>
        ) : null}
        <Button onClick={() => setOpenAddToFolderModal(true)}>
          Add to folder
        </Button>
        <Divider type="vertical" />
        <Button disabled>Remove from folder</Button>

        <div style={{ float: "right" }}>
          <Button
            onClick={() => {
              if (!prev) {
                return;
              }
              history.push(`/folders/${prev[0]}/documents/${prev[1]}`);
            }}
          >
            Prev
          </Button>
          <Divider type="vertical" />
          <Button
            onClick={() => {
              if (!next) {
                return;
              }
              history.push(`/folders/${next[0]}/documents/${next[1]}`);
            }}
          >
            Next
          </Button>
        </div>
      </div>
      <div ref={containerRef}>
        <Document
          file={`/api/documents/${documentId}/data`}
          loading={<Spin size="large" />}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) =>
            alert("Error while loading document! " + error.message)
          }
          onSourceError={(error) =>
            alert("Error while retrieving document source! " + error.message)
          }
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              width={width}
              key={`page_${index + 1}`}
              pageNumber={index + 1}
            />
          ))}
        </Document>
      </div>
    </div>
  );
}

export default Viewer;
