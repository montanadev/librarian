import { Button, Cascader, Modal } from "antd";
import { Api } from "../../utils/Api";
import { ResourceModel } from "../../models/Resource";
import { FolderModel } from "../../models/Folder";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

interface Props {
  visible: boolean;
  onClose: () => void;
  onDeleteDocument: () => void;
}

export function DeleteDocumentModal({
  visible,
  onClose,
  onDeleteDocument,
}: Props) {
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      title="Delete document"
      footer={[
        <Button htmlType="submit" onClick={() => onDeleteDocument()}>
          Yes
        </Button>,
        <Button type="primary" onClick={onClose}>
          No
        </Button>,
      ]}
    >
      <p>Are you sure?</p>
    </Modal>
  );
}
