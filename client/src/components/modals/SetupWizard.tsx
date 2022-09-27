import { Button, Input, Modal, Select, Space, Typography, Radio } from "antd";
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
import { useState } from "react";

const { Link, Title, Paragraph, Text } = Typography;

const { TextArea } = Input;

export function SetupWizard() {
  const [visible, setVisible] = useState(false);
  const [storageMode, setStorageMode] = useState("local");

  const onClose = () => {
    setVisible(false);
  };

  const api = new Api();

  const settings = useQuery<SettingsModel>("settings", api.getSettings);

  const { handleSubmit, control, watch } = useForm();

  if (settings.isLoading || !settings.data) {
    return null;
  }

  return (
    <Modal
      visible={!settings.data.dismissed_setup_wizard}
      onCancel={onClose}
      title={
        <Typography>
          <Title>Welcome!</Title>
          <Paragraph>
            Find these options any time on the <b>Settings</b> tab at the top of
            the page.
          </Paragraph>
        </Typography>
      }
      footer={[
        <Button onClick={onClose}>Dismiss</Button>,
        <Button
          data-cy="settings-submit"
          type="primary"
          htmlType="submit"
          // onClick={handleSubmit((d) =>
          //   api
          //     .writeSettings(d)
          //     .then(() => queryClient.invalidateQueries("settings"))
          //     .then(() => onClose())
          // )}
        >
          Save
        </Button>,
      ]}
    >
      <form>
        <Typography>
          <Title level={2}>Storage</Title>
          <Paragraph>
            Librarian can store your documents to several places:
          </Paragraph>

          <Radio.Group
            value={storageMode}
            onChange={(e) => setStorageMode(e.target.value)}
          >
            <Space direction="vertical">
              <Radio value="local">
                <Title level={5}>Local</Title>
                <Paragraph>
                  Choose this if you want uploaded documents to save to a local
                  disk, like an external hard drive.
                </Paragraph>
                <Paragraph>
                  {storageMode === "local" && (
                    <>
                      <Text strong>Local path</Text>
                      <Controller
                        name={"storage_settings.storage_path"}
                        control={control}
                        render={({ field }: any) => (
                          <Input
                            {...field}
                            className="w-full"
                            type="text"
                            placeholder="/home/<username>/Documents"
                          />
                        )}
                      />
                    </>
                  )}
                </Paragraph>
              </Radio>
              <Radio value="nfs">
                <Title level={5}>NFS</Title>
                <Paragraph>
                  Choose this if you have a NAS or device that speaks NFS.
                </Paragraph>
                <Paragraph>
                  {storageMode === "nfs" && (
                    <>
                      <Text strong>NFS path</Text>
                      <Controller
                        name={"storage_settings.storage_path"}
                        control={control}
                        render={({ field }: any) => (
                          <Input
                            {...field}
                            className="w-full"
                            type="text"
                            placeholder="nfs://10.0.3.5/volume1/librarian"
                          />
                        )}
                      />
                    </>
                  )}
                </Paragraph>
              </Radio>
              <Radio value="s3">
                <Title level={5}>S3</Title>
                <Paragraph>
                  Choose this to bring your own Amazon S3 bucket.
                </Paragraph>
                <Paragraph>
                  {storageMode === "s3" && (
                    <>
                      <Text strong>AWS Access Key Id</Text>
                      <Controller
                        name={"storage_settings.aws_access_key_id"}
                        control={control}
                        render={({ field }: any) => (
                          <Input {...field} className="w-full" type="text" />
                        )}
                      />

                      <Text strong>AWS Secret Access Key</Text>
                      <Controller
                        name={"storage_settings.aws_secret_access_key"}
                        control={control}
                        render={({ field }: any) => (
                          <Input {...field} className="w-full" type="text" />
                        )}
                      />

                      <Text strong>AWS Bucket</Text>
                      <Controller
                        name={"storage_settings.bucket"}
                        control={control}
                        render={({ field }: any) => (
                          <Input {...field} className="w-full" type="text" />
                        )}
                      />
                    </>
                  )}
                </Paragraph>
              </Radio>
            </Space>
          </Radio.Group>
        </Typography>

        <Title level={2}>Text Detection</Title>
        <Paragraph>
          Librarian uses{" "}
          <Link href="https://cloud.google.com/vision">Google Vision AI</Link>{" "}
          to parse documents.
          <br />
        </Paragraph>
        <Paragraph>
          <Text strong>
            Follow{" "}
            <Link href="https://cloud.google.com/vision/docs/setup">
              these steps
            </Link>{" "}
            to download a service account file. Paste the contents of that file
            (JSON) here:
          </Text>
          <Controller
            name={"google_cloud_api_key"}
            control={control}
            render={({ field }: any) => (
              <TextArea
                {...field}
                placeholder={
                  "{\n" +
                  '  "type": "service_account",\n' +
                  '  "project_id": "...",\n' +
                  '  "private_key_id": "...",\n' +
                  '  "private_key": "-----BEGIN PRIVATE KEY-----",\n' +
                  '  "client_email": "...",\n' +
                  "   ... \n" +
                  "}\n"
                }
                rows={7}
              />
            )}
          />
        </Paragraph>
      </form>
    </Modal>
  );
}
