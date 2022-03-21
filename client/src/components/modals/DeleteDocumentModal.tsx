import { Button, Modal } from "antd";

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
