import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import "../Uploader.css";
import Document from "./Document";
import { AddToFolderModal } from "../modals/AddToFolderModal";
import { Api } from "../../utils/Api";
import { useQuery, useQueryClient } from "react-query";
import { DocumentModel } from "../../models/Document";
import { DeleteDocumentModal } from "../modals/DeleteDocumentModal";
import { Toolbar } from "./Toolbar";

function Viewer() {
  let { documentId, folderId, pageNumber } = useParams<any>();

  const [openAddToFolderModal, setOpenAddToFolderModal] = useState(false);
  const [openDeleteDocumentModal, setOpenDeleteDocumentModal] = useState(false);
  const queryClient = useQueryClient();
  const api = new Api();
  const history = useHistory();

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
      queryClient.invalidateQueries("tags");
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
        queryClient.invalidateQueries("tags");
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
      <Toolbar
        document={document.data}
        documentId={documentId}
        folderId={folderId}
        onDocumentRename={onDocumentRename}
        onAddToFolder={() => setOpenAddToFolderModal(true)}
        onDeleteDocument={() => setOpenDeleteDocumentModal(true)}
      />
      <Document pageNumber={pageNumber} documentId={documentId} />
    </>
  );
}

export default Viewer;
