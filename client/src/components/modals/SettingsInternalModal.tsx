import { Button, Input, Modal, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import { Api } from "../../utils/Api";
import { useQuery, useQueryClient } from "react-query";
import {
  SettingsModel,
  StorageModes,
  StorageSettingsLocal,
  StorageSettingsNFS,
  StorageSettingsS3,
} from "../../models/Settings";

const { TextArea } = Input;

interface internalProps {
  data: any;
  visible: boolean;
  onClose: () => void;
}

export function SettingsInternalModal({
  visible,
  onClose,
  data,
}: internalProps) {
  const api = new Api();

  const queryClient = useQueryClient();

  let storageOptions;
  const storageMode = data.storage_mode ?? StorageModes[0];
  if (storageMode === "nfs") {
    storageOptions = {
      storage_path: (data.storage_settings as StorageSettingsNFS)?.storage_path,
    };
  }
  if (storageMode === "local") {
    storageOptions = {
      storage_path: (data.storage_settings as StorageSettingsLocal)
        ?.storage_path,
    };
  }
  if (storageMode === "s3") {
    storageOptions = {
      bucket: (data.storage_settings as StorageSettingsS3)?.bucket,
      aws_access_key_id: (data.storage_settings as StorageSettingsS3)
        ?.aws_access_key_id,
      aws_secret_access_key: (data.storage_settings as StorageSettingsS3)
        ?.aws_secret_access_key,
    };
  }

  const { handleSubmit, control, watch } = useForm({
    defaultValues: {
      google_cloud_api_key: data.google_cloud_api_key,
      storage_mode: storageMode,
      storage_settings: storageOptions,
    },
  });

  const storageModeWatch = watch("storage_mode");

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      title="Settings"
      footer={[
        <Button onClick={onClose}>Return</Button>,
        <Button
          data-cy="settings-submit"
          type="primary"
          htmlType="submit"
          onClick={handleSubmit((d) =>
            api
              .writeSettings(d)
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
          render={({ field }: any) => (
            <Select
              data-cy="settings-storage-mode"
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

        {storageModeWatch === "local" || storageModeWatch === "nfs" ? (
          <>
            <h3>Storage Path</h3>
            <Controller
              name={"storage_settings.storage_path"}
              control={control}
              render={({ field }: any) => (
                <Input {...field} className="w-full" type="text" />
              )}
            />
          </>
        ) : null}

        {storageModeWatch === "s3" ? (
          <>
            <h3>AWS Access Key Id</h3>
            <Controller
              name={"storage_settings.aws_access_key_id"}
              control={control}
              render={({ field }: any) => (
                <Input
                  {...field}
                  className="w-full"
                  data-cy="settings-aws-access-key-id"
                  type="text"
                />
              )}
            />

            <h3>AWS Secret Access Key</h3>
            <Controller
              name={"storage_settings.aws_secret_access_key"}
              control={control}
              render={({ field }: any) => (
                <Input
                  {...field}
                  className="w-full"
                  data-cy="settings-aws-secret-access-key"
                  type="text"
                />
              )}
            />

            <h3>AWS Bucket</h3>
            <Controller
              name={"storage_settings.bucket"}
              control={control}
              render={({ field }: any) => (
                <Input
                  {...field}
                  className="w-full"
                  data-cy="settings-aws-bucket"
                  type="text"
                />
              )}
            />
          </>
        ) : null}

        <br />
        <br />

        <h3>Cloud Vision API Key</h3>
        <Controller
          name={"google_cloud_api_key"}
          control={control}
          defaultValue={data.google_cloud_api_key ?? ""}
          render={({ field }: any) => <TextArea {...field} rows={5} />}
        />
      </form>
    </Modal>
  );
}
