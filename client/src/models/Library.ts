import {DocumentModel} from "./Document";

export interface LibraryModel {
    documentsAvailable: number;
    documents: DocumentModel[];
    ready: boolean;
    loading: boolean;
}