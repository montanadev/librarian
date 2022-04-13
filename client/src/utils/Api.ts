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
    const form = new FormData();
    form.append("file", file);

    return axios
      .post(`/api/documents/${file.name}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
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

  searchDocumentTitles(
    q: string | null,
    limit: number | null = null,
    offset: number | null = null
  ) {
    return axios
      .get("/api/documents/search", {
        params: { q, limit, offset },
      })
      .then((d) => d.data);
  }

  searchDocumentText(
    q: string | null,
    limit: number | null = null,
    offset: number | null = null
  ) {
    return axios
      .get("/api/documents/text/search", {
        params: { q, limit, offset },
      })
      .then((d) => d.data);
  }

  deleteDocument(documentId: string) {
    return axios.delete(`/api/documents/${documentId}/details`);
  }

  replaceTag(documentId: string, oldTagId: number, newTagName: string) {
    return this.deleteTag(documentId, oldTagId).then(() =>
      this.createTag(documentId, newTagName)
    );
  }

  createTag(documentId: string, newTagName: string) {
    return axios.post(`/api/documents/${documentId}/tags`, {
      name: newTagName,
    });
  }

  deleteTag(documentId: string, tagId: number) {
    return axios.delete(`/api/documents/${documentId}/tags/${tagId}`);
  }

  getTagsByDocumentId(documentId: string) {
    return axios.get(`/api/documents/${documentId}/tags`).then((d) => d.data);
  }

  getTags() {
    return axios.get("/api/tags/").then((d) => d.data);
  }
}
