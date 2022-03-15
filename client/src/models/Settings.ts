export const StorageModes = ["local", "nfs"];

export interface SettingsModel {
  version: number;
  google_cloud_api_key: string;
  storage_mode: typeof StorageModes[number];
  storage_path: string;
  secret_key: string;
}
