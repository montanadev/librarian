import NavButtons from "./NavButtons";
import React from "react";
import "../Uploader.css";
import { Button, Col, Dropdown, Menu, Row } from "antd";
import { DocumentModel } from "../../models/Document";
import { Tags } from "./Tags";
import { Api } from "../../utils/Api";
import { useQuery, useQueryClient } from "react-query";
import { TagModel } from "../../models/Tag";
import { ResourceModel } from "../../models/Resource";
import { Zoom } from "./Zoom";
import { EditableTitle } from "./EditableTitle";

interface Props {
  document: DocumentModel;
  documentTags: TagModel[];
  globalTags: TagModel[];
  onDocumentRename: (name: string) => void;
  onMoveToFolder: () => void;
  onDeleteDocument: () => void;
  onSetZoom: (zoom: number) => void;
  onCreateFolder: () => void;
  documentId: string;
  folderId: string;
  defaultZoom: number;
}

export function Toolbar({
  document,
  documentTags,
  globalTags,
  onDocumentRename,
  onMoveToFolder,
  onDeleteDocument,
  onCreateFolder,
  onSetZoom,
  defaultZoom,
  documentId,
  folderId,
}: Props) {
  const api = new Api();
  const queryClient = useQueryClient();

  const refreshTags = () => {
    queryClient.invalidateQueries("document-tags");
    queryClient.invalidateQueries("tags");
  };

  const createButton = (text: string, callback: () => void) => {
    return (
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" onClick={callback}>
          {text}
        </a>
      </Menu.Item>
    );
  };

  const folderDropdownButtons = (
    <Menu>
      {createButton("Create folder...", onCreateFolder)}
      {createButton("Move to folder...", onMoveToFolder)}
      {createButton("Remove from folder...", () => {})}
    </Menu>
  );

  const documentDropdownButtons = (
    <Menu>{createButton("Delete document...", onDeleteDocument)}</Menu>
  );

  return (
    <>
      <Row>
        <EditableTitle text={document.filename} onEdit={onDocumentRename} />
      </Row>
      <Row>
        <Col span={8}>
          <Tags
            documentTags={documentTags}
            globalTags={globalTags}
            onCreateTag={(newTagName) =>
              api.createTag(documentId, newTagName).then(refreshTags)
            }
            onDeleteTag={(tagId) =>
              api.deleteTag(documentId, tagId).then(refreshTags)
            }
            onReplaceTag={(oldTagId, newTagName) =>
              api.replaceTag(documentId, oldTagId, newTagName).then(refreshTags)
            }
          />
        </Col>

        <Col span={8} style={{ display: "flex", justifyContent: "center" }}>
          <Zoom defaultZoom={defaultZoom} onSetZoom={onSetZoom} />
        </Col>

        <Col span={8}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <>
              <Dropdown overlay={folderDropdownButtons} placement="bottom">
                <Button>Folders</Button>
              </Dropdown>

              <Dropdown overlay={documentDropdownButtons} placement="bottom">
                <Button>Document</Button>
              </Dropdown>
            </>
            <NavButtons documentId={documentId} folderId={folderId} />
          </div>
        </Col>
      </Row>
    </>
  );
}
