import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import "../Uploader.css";
import Document from "./Document";
import { AddToFolderModal } from "../modals/AddToFolderModal";
import { Api } from "../../utils/Api";
import { useQuery, useQueryClient } from "react-query";
import { Button, Divider, Typography } from "antd";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import NavButtons from "./NavButtons";
import { DocumentModel } from "../../models/Document";
import { DeleteDocumentModal } from "../modals/DeleteDocumentModal";

function Viewer() {
  let { documentId, folderId, pageNumber } = useParams<any>();

  const [openAddToFolderModal, setOpenAddToFolderModal] = useState(false);
  const [openDeleteDocumentModal, setOpenDeleteDocumentModal] = useState(false);
  const queryClient = useQueryClient();
  const api = new Api();
  const history = useHistory();

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

  const onDocumentRename = (newDocumentName: string) => {
    api.renameDocument(document.data.id, newDocumentName).then(() => {
      queryClient.invalidateQueries("folders");
      queryClient.invalidateQueries("document");
    });
  };

  const onAddDocumentToFolder = (folderId: number) => {
    api.addDocumentToFolder(documentId, folderId).then(() => {
      setOpenAddToFolderModal(false);
      queryClient.invalidateQueries("folders");
    });
  };

  const onDeleteDocument = () => {
    api
      .deleteDocument(documentId)
      .then(() => {
        queryClient.invalidateQueries("folders");
        queryClient.invalidateQueries("document");
      })
      .then(() => {
        history.push("/");
      });
  };

  return (
    <>
      <AddToFolderModal
        visible={openAddToFolderModal}
        onClose={() => setOpenAddToFolderModal(false)}
        onAddToFolder={onAddDocumentToFolder}
      />

      <DeleteDocumentModal
        visible={openDeleteDocumentModal}
        onClose={() => setOpenDeleteDocumentModal(false)}
        onDeleteDocument={onDeleteDocument}
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
        <Divider type="vertical" />
        <Button onClick={() => setOpenDeleteDocumentModal(true)}>
          Delete Document
        </Button>

        <NavButtons documentId={documentId} folderId={folderId} />
      </div>

      <Document pageNumber={pageNumber} documentId={documentId} />
    </>
  );
}

export default Viewer;
