import NavButtons from "./NavButtons";
import React from "react";
import "../Uploader.css";
import { Button, Divider, Typography } from "antd";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import { DocumentModel } from "../../models/Document";

interface Props {
  document: DocumentModel;
  onDocumentRename: (name: string) => void;
  onAddToFolder: () => void;
  onDeleteDocument: () => void;
  documentId: string;
  folderId: string;
}

export function Toolbar({
  document,
  onDocumentRename,
  onAddToFolder,
  onDeleteDocument,
  documentId,
  folderId,
}: Props) {
  return (
    <>
      <Typography.Title
        style={{ margin: 0 }}
        level={1}
        editable={{
          icon: <EditOutlined style={{ fontSize: 22 }} />,
          onChange: onDocumentRename,
          enterIcon: <CheckOutlined />,
        }}
      >
        {document.filename}
      </Typography.Title>

      <Button onClick={onAddToFolder}>Add to folder</Button>
      <Divider type="vertical" />
      <Button disabled>Remove from folder</Button>
      <Divider type="vertical" />
      <Button onClick={onDeleteDocument}>Delete Document</Button>

      <NavButtons documentId={documentId} folderId={folderId} />
    </>
  );
}
