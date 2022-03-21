import { DocumentModel } from "./Document";

export interface TagModel {
  name: string;
  id: number;
  documents: DocumentModel[];
}
