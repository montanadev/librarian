import { Button, Input, Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { Api } from "../../utils/Api";

interface Props {
  onClose: () => void;
}

export function CreateFolderModal({ onClose }: Props) {
  const api = new Api();
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm();

  const onSubmit = (data: any) => {
    api.createFolder(data.folderName).then(() => {
      queryClient.invalidateQueries("folders");
      onClose();
      reset();
    });
  };

  return (
    <Modal
      visible
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Folder name</h3>
        <Controller
          name={"folderName"}
          control={control}
          render={({ field }: any) => (
            <Input {...field} autoFocus className="w-full" type="text" />
          )}
        />
      </form>
    </Modal>
  );
}
