import { useHistory } from "react-router-dom";
import { findNextAndPrev } from "../../utils/findNextAndPrev";
import { ResourceModel } from "../../models/Resource";
import { FolderModel } from "../../models/Folder";
import { useQuery } from "react-query";
import { Api } from "../../utils/Api";
import { Button, Divider, Spin, Typography } from "antd";

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
  return (
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
  );
}

export default NavButtons;
