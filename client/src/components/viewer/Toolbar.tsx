import NavButtons from "./NavButtons";
import React from "react";
import "../Uploader.css";
import { Button, Descriptions, Dropdown, Menu } from "antd";
import { DocumentModel } from "../../models/Document";
import { Tags } from "./Tags";
import { Api } from "../../utils/Api";
import { useQuery, useQueryClient } from "react-query";
import { TagModel } from "../../models/Tag";
import { ResourceModel } from "../../models/Resource";
import { WidthSlider } from "./WidthSlider";
import { EditableTitle } from "./EditableTitle";

interface Props {
  document: DocumentModel;
  onDocumentRename: (name: string) => void;
  onAddToFolder: () => void;
  onDeleteDocument: () => void;
  onSetWidth: (width: number) => void;
  onCreateFolder: () => void;
  documentId: string;
  folderId: string;
  defaultWidth: number;
}

export function Toolbar({
  document,
  onDocumentRename,
  onAddToFolder,
  onDeleteDocument,
  onCreateFolder,
  onSetWidth,
  defaultWidth,
  documentId,
  folderId,
}: Props) {
  const api = new Api();
  const queryClient = useQueryClient();

  const documentTags = useQuery<ResourceModel<TagModel>>("document-tags", () =>
    api.getTagsByDocumentId(documentId)
  );
  const globalTags = useQuery<ResourceModel<TagModel>>("tags", () =>
    api.getTags()
  );

  const refreshTags = () => {
    queryClient.invalidateQueries("document-tags");
    queryClient.invalidateQueries("tags");
  };

  if (!documentTags.data || !globalTags.data) {
    return <>Loading...</>;
  }

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
      {createButton("Add to folder...", onAddToFolder)}
      {createButton("Remove from folder...", () => {})}
    </Menu>
  );

  const documentDropdownButtons = (
    <Menu>{createButton("Delete document...", onDeleteDocument)}</Menu>
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <EditableTitle text={document.filename} onEdit={onDocumentRename} />

        <WidthSlider defaultWidth={defaultWidth} onSetWidth={onSetWidth} />

        <div style={{ display: "flex" }}>
          <Dropdown overlay={folderDropdownButtons} placement="bottomCenter">
            <Button>Folders</Button>
          </Dropdown>

          <div style={{ padding: 6 }} />

          <Dropdown overlay={documentDropdownButtons} placement="bottomCenter">
            <Button>Document</Button>
          </Dropdown>

          <div style={{ padding: 6 }} />

          <NavButtons documentId={documentId} folderId={folderId} />
        </div>
      </div>
      <Descriptions size="small" column={1}>
        <Descriptions.Item>
          <Tags
            documentTags={documentTags.data.results}
            globalTags={globalTags.data.results}
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
        </Descriptions.Item>
      </Descriptions>
    </>
  );
}
