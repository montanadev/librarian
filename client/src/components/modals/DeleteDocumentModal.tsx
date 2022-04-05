import { Button, Modal } from "antd";

interface Props {
  onClose: () => void;
  onDeleteDocument: () => void;
}

export function DeleteDocumentModal({ onClose, onDeleteDocument }: Props) {
  return (
    <Modal
      visible
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
