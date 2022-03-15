export interface DocumentModel {
  id: number;
  folder: number;
  filename: string;
  hash: string | null;
  temp_path: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
}
