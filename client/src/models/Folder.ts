import { DocumentModel } from "./Document";

export interface FolderModel {
  id: number;
  name: string;
  documents: Array<DocumentModel>;
}
