export const StorageModes = ["local", "nfs", "s3"];

export interface StorageSettingsLocal {
  storage_path: string;
}

export interface StorageSettingsNFS {
  storage_path: string;
}

export interface StorageSettingsS3 {
  aws_access_key_id: string;
  aws_secret_access_key: string;
  bucket: string;
}

export interface SettingsModel {
  version: number;
  google_cloud_api_key: string;
  storage_mode: typeof StorageModes[number];
  storage_settings:
    | StorageSettingsLocal
    | StorageSettingsNFS
    | StorageSettingsS3;
  secret_key: string;
  dismissed_setup_wizard: boolean;
}
