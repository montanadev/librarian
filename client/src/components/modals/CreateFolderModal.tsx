import { Button, Input, Modal } from "antd";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { Api } from "../../utils/Api";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function CreateFolderModal({ visible, onClose }: Props) {
  const api = new Api();
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    api.createFolder(data.folderName).then(() => {
      queryClient.invalidateQueries("folders");
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      title="Create Folder"
      footer={[
        <Button onClick={onClose}>Return</Button>,
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit(onSubmit)}
        >
          Submit
        </Button>,
      ]}
    >
      <form>
        <h3>Folder name</h3>
        <input
          autoFocus
          className="w-full"
          type="text"
          {...register("folderName")}
        />
      </form>
    </Modal>
  );
}
