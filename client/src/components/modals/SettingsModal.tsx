import { Button, Input, Modal, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import { Api } from "../../utils/Api";
import { useQuery, useQueryClient } from "react-query";
import { SettingsModel, StorageModes } from "../../models/Settings";

const { TextArea } = Input;

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function SettingsModal({ visible, onClose }: Props) {
  const api = new Api();

  const queryClient = useQueryClient();

  const settings = useQuery<SettingsModel>("settings", api.getSettings);
  const { handleSubmit, control } = useForm();

  if (settings.isLoading || !settings.data) {
    return <div>Loading...</div>;
  }

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      title="Setup Wizard"
      footer={[
        <Button onClick={onClose}>Return</Button>,
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit((data) =>
            api
              .writeSettings(data)
              .then(() => queryClient.invalidateQueries("settings"))
              .then(() => onClose())
          )}
        >
          Submit
        </Button>,
      ]}
    >
      <form>
        <h3>Storage Mode</h3>
        <Controller
          name="storage_mode"
          control={control}
          defaultValue={settings.data.storage_mode ?? StorageModes[0]}
          render={({ field }: any) => (
            <Select
              {...field}
              className="w-full"
              options={StorageModes.map((m) => {
                return { value: m, label: m };
              })}
            />
          )}
        />

        <br />
        <br />

        <h3>Storage Path</h3>
        <Controller
          name={"storage_path"}
          control={control}
          defaultValue={settings.data.storage_path ?? "/tmp"}
          render={({ field }: any) => (
            <Input {...field} className="w-full" type="text" />
          )}
        />

        <br />
        <br />

        <h3>Cloud Vision API Key</h3>
        <Controller
          name={"google_cloud_api_key"}
          control={control}
          defaultValue={settings.data.google_cloud_api_key ?? ""}
          render={({ field }: any) => <TextArea {...field} rows={5} />}
        />
      </form>
    </Modal>
  );
}
