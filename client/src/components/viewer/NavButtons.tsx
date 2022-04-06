import { useHistory } from "react-router-dom";
import { findNextAndPrev } from "../../utils/findNextAndPrev";
import { ResourceModel } from "../../models/Resource";
import { FolderModel } from "../../models/Folder";
import { useQuery } from "react-query";
import { Api } from "../../utils/Api";
import { Button } from "antd";
import React from "react";

interface Props {
  documentId: string;
  folderId: string;
}

function NavButtons({ documentId, folderId }: Props) {
  const history = useHistory();
  const api = new Api();

  const folders = useQuery<ResourceModel<FolderModel>>(
    "folders",
    api.getFolders
  );

  if (!folders.data || folders.isLoading) {
    return <div />;
  }

  const [next, prev] = findNextAndPrev(
    folders.data.results,
    documentId,
    folderId
  );

  const goTo = (item: number[]) => () => {
    if (!item) {
      return;
    }
    history.push(`/folders/${item[0]}/documents/${item[1]}`);
  };

  return (
    <>
      <Button onClick={goTo(prev)}>Back</Button>
      <Button onClick={goTo(next)}>Next</Button>
    </>
  );
}

export default NavButtons;
