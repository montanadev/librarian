import NavButtons from "./NavButtons";
import React from "react";
import "../Uploader.css";
import { Button, Divider, Typography } from "antd";
import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import { DocumentModel } from "../../models/Document";
import { Tags } from "./Tags";
import { Api } from "../../utils/Api";
import { useQuery, useQueryClient } from "react-query";
import { TagModel } from "../../models/Tag";
import { ResourceModel } from "../../models/Resource";

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
      <Button disabled>Remove from folder</Button>
      <Button onClick={onDeleteDocument}>Delete Document</Button>

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

      <NavButtons documentId={documentId} folderId={folderId} />
    </>
  );
}
