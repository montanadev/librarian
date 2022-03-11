import { JobModel } from "../models/Job";
import { DocumentModel } from "../models/Document";
import { ResourceModel } from "../models/Resource";
import axios from "axios";

export class Api {
  getDocuments(): Promise<ResourceModel<DocumentModel>> {
    return axios.get("/api/documents/").then((d) => d.data);
  }

  refreshJob(jobId: number): Promise<JobModel> {
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

  saveConfig(data: any) {
    return axios.post("/api/config/", data).then((d) => d.data);
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
}
