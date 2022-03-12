import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../Uploader.css";
import Document from "./Document";
import { AddToFolderModal } from "../modals/AddToFolderModal";
import { Api } from "../../utils/Api";
import { useQuery, useQueryClient } from "react-query";
import { Button, Divider, Typography } from "antd";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import NavButtons from "./NavButtons";
import { DocumentModel } from "../../models/Document";

function Viewer() {
  let { documentId, folderId, pageNumber } = useParams<any>();

  const [openAddToFolderModal, setOpenAddToFolderModal] = useState(false);
  const queryClient = useQueryClient();
  const api = new Api();

  // if (pageNumber) {
  //   setJump(true);
  // } else {
  //   history.push(`/folders/${folderId}/documents/${documentId}/pages/1`);
  // }

  const document = useQuery<DocumentModel>(["document", documentId], () =>
    api.getDocumentById(documentId)
  );

  if (!document.data || document.isLoading) {
    return <div />;
  }

  const onDocumentRename = () => (newDocumentName: string) => {
    api.renameDocument(document.data.id, newDocumentName).then(() => {
      queryClient.invalidateQueries("folders");
    });
  };

  const onAddDocumentToFolder = () => (folderId: number) => {
    api.addDocumentToFolder(documentId, folderId).then(() => {
      setOpenAddToFolderModal(false);
      queryClient.invalidateQueries("folders");
    });
  };

  return (
    <>
      <AddToFolderModal
        visible={openAddToFolderModal}
        onClose={() => setOpenAddToFolderModal(false)}
        onAddToFolder={onAddDocumentToFolder}
      />

      <div>
        {document ? (
          <Typography.Title
            style={{ margin: 0 }}
            level={1}
            editable={{
              icon: <EditOutlined style={{ fontSize: 22 }} />,
              onChange: onDocumentRename,
              enterIcon: <CheckOutlined />,
            }}
          >
            {document.data.filename}
          </Typography.Title>
        ) : null}
        <Button onClick={() => setOpenAddToFolderModal(true)}>
          Add to folder
        </Button>
        <Divider type="vertical" />
        <Button disabled>Remove from folder</Button>

        <NavButtons documentId={documentId} folderId={folderId} />
      </div>

      <Document pageNumber={pageNumber} documentId={documentId} />
    </>
  );
}

export default Viewer;
