import React, { useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import "../Uploader.css";
import Document from "./Document";
import { MoveToFolderModal } from "../modals/MoveToFolderModal";
import { Api } from "../../utils/Api";
import { useQuery, useQueryClient } from "react-query";
import { DocumentModel } from "../../models/Document";
import { DeleteDocumentModal } from "../modals/DeleteDocumentModal";
import { Toolbar } from "./Toolbar";
import { CreateFolderModal } from "../modals/CreateFolderModal";
import { useContainerDimensions } from "../../utils/useContainerDimenstions";

function Viewer() {
  let { documentId, folderId, pageNumber } = useParams<any>();

  const [openAddToFolderModal, setOpenMoveToFolderModal] = useState(false);
  const [openDeleteDocumentModal, setOpenDeleteDocumentModal] = useState(false);
  const [openCreateFolderModal, setOpenCreateFolderModal] = useState(false);

  let localZoom = 1;
  if (window.localStorage.getItem("librarian.document.zoom") !== null) {
    localZoom = parseFloat(
      window.localStorage.getItem("librarian.document.zoom")!
    );
  }
  const [zoom, setZoom] = useState(localZoom);

  const documentRef = useRef<any>();
  const { width } = useContainerDimensions(documentRef);

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
      setOpenMoveToFolderModal(false);
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
      {openAddToFolderModal && (
        <MoveToFolderModal
          currentFolderId={document.data.folder}
          onClose={() => setOpenMoveToFolderModal(false)}
          onAddToFolder={onAddDocumentToFolder}
        />
      )}
      {openDeleteDocumentModal && (
        <DeleteDocumentModal
          onClose={() => setOpenDeleteDocumentModal(false)}
          onDeleteDocument={onDeleteDocument}
        />
      )}
      {openCreateFolderModal && (
        <CreateFolderModal onClose={() => setOpenCreateFolderModal(false)} />
      )}
      <Toolbar
        document={document.data}
        documentId={documentId}
        folderId={folderId}
        defaultZoom={zoom}
        onDocumentRename={onDocumentRename}
        onMoveToFolder={() => setOpenMoveToFolderModal(true)}
        onDeleteDocument={() => setOpenDeleteDocumentModal(true)}
        onCreateFolder={() => setOpenCreateFolderModal(true)}
        onSetZoom={(newZoom: number) => {
          setZoom(newZoom);
          window.localStorage.setItem(
            "librarian.document.zoom",
            newZoom.toString()
          );
        }}
      />

      <div id="document-container" ref={documentRef}>
        <Document
          file={`/api/documents/${documentId}/data`}
          scale={zoom}
          pageNumber={pageNumber ? parseInt(pageNumber) : undefined}
        />
      </div>
    </>
  );
}

export default Viewer;
