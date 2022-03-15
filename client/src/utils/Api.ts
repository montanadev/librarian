import { JobModel } from "../models/Job";
import { DocumentModel } from "../models/Document";
import { ResourceModel } from "../models/Resource";
import axios from "axios";

export class Api {
  getDocuments(): Promise<ResourceModel<DocumentModel>> {
    return axios.get("/api/documents/").then((d) => d.data);
  }

  getDocumentById(documentId: string): Promise<DocumentModel> {
    return axios
      .get(`/api/documents/${documentId}/details`)
      .then((d) => d.data);
  }

  refreshJob(jobId: number): Promise<JobModel> {
    // TODO - dedupe this with `getDocumentById`
    return axios.get(`/api/documents/${jobId}/details`).then((d) => d.data);
  }

  uploadDocuments(file: any) {
    return axios
      .post(`/api/documents/${file.name}`, file)
      .then((d) => d.data)
      .catch((error: any) => {
        return Promise.reject(error.response.data.reason);
      });
  }

  getSettings() {
    return axios.get("/api/settings").then((d) => d.data);
  }

  writeSettings(data: any) {
    return axios.post("/api/settings", data).then((d) => d.data);
  }

  createFolder(folderName: string) {
    return axios.post("/api/folders/", { name: folderName, documents: [] });
  }

  addDocumentToFolder(documentId: number, folderId: number) {
    return axios.put(`/api/folders/${folderId}/document`, { id: documentId });
  }

  getFolders() {
    return axios.get("/api/folders/").then((d) => d.data);
  }

  renameFolder(folderId: number, newFolderName: string) {
    return axios.put(`/api/folders/${folderId}`, {
      id: folderId,
      name: newFolderName,
      documents: [],
    });
  }

  renameDocument(documentId: number, newDocumentName: string) {
    return axios.put(`/api/documents/${documentId}/details`, {
      id: documentId,
      filename: newDocumentName,
    });
  }

  searchDocumentTitles(q: string | null) {
    return axios.get("/api/documents/search", {
      params: { q },
    });
  }

  searchDocumentText(q: string | null) {
    return axios.get("/api/documents/text/search", {
      params: { q },
    });
  }
}
