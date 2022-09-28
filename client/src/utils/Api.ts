import { DocumentModel } from "../models/Document";
import { ResourceModel } from "../models/Resource";
import axios from "axios";
import { toastError } from "./toasts";

const toastErrorHandler = (error: any) => {
  if (error.response.status === 403) {
    toastError(`Not available in demo mode`);
    throw error;
  }

  if (error.response?.data?.reason) {
    toastError(error.response?.data?.reason);
  } else {
    toastError(error.message);
  }
  throw error;
};

export class Api {
  getDocuments(
    updatedAfter: Date | null = null
  ): Promise<ResourceModel<DocumentModel>> {
    return axios
      .get("/api/documents/", {
        params: { updated_after: updatedAfter, limit: 100 },
      })
      .then((d) => d.data)
      .catch(toastErrorHandler);
  }

  getDocumentById(documentId: string): Promise<DocumentModel> {
    return axios
      .get(`/api/documents/${documentId}/details`)
      .then((d) => d.data)
      .catch(toastErrorHandler);
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
      .catch(toastErrorHandler);
  }

  getSettings() {
    return axios
      .get("/api/settings")
      .then((d) => d.data)
      .catch(toastErrorHandler);
  }

  writeSettings(data: any) {
    return axios
      .post("/api/settings", data)
      .then((d) => d.data)
      .catch(toastErrorHandler);
  }

  dismissSetupWizard() {
    return axios
      .put("/api/settings", { dismissed_setup_wizard: true })
      .then((d) => d.data)
      .catch(toastErrorHandler);
  }

  createFolder(folderName: string) {
    return axios
      .post("/api/folders/", { name: folderName, documents: [] })
      .catch(toastErrorHandler);
  }

  addDocumentToFolder(documentId: number, folderId: number) {
    return axios
      .put(`/api/folders/${folderId}/document`, { id: documentId })
      .catch(toastErrorHandler);
  }

  getFolders() {
    return axios
      .get("/api/folders/")
      .then((d) => d.data)
      .catch(toastErrorHandler);
  }

  renameFolder(folderId: number, newFolderName: string) {
    return axios
      .put(`/api/folders/${folderId}`, {
        id: folderId,
        name: newFolderName,
        documents: [],
      })
      .catch(toastErrorHandler);
  }

  renameDocument(documentId: number, newDocumentName: string) {
    return axios
      .put(`/api/documents/${documentId}/details`, {
        id: documentId,
        filename: newDocumentName,
      })
      .catch(toastErrorHandler);
  }

  searchDocumentTitles(
    q: string | null,
    limit: number | null = null,
    offset: number | null = null
  ) {
    return axios
      .get("/api/documents/search/title", {
        params: { q, limit, offset },
      })
      .then((d) => d.data)
      .catch(toastErrorHandler);
  }

  searchDocumentText(
    q: string | null,
    limit: number | null = null,
    offset: number | null = null
  ) {
    return axios
      .get("/api/documents/search/text", {
        params: { q, limit, offset },
      })
      .then((d) => d.data)
      .catch(toastErrorHandler);
  }

  deleteDocument(documentId: string) {
    return axios
      .delete(`/api/documents/${documentId}/details`)
      .catch(toastErrorHandler);
  }

  replaceTag(documentId: string, oldTagId: number, newTagName: string) {
    return this.deleteTag(documentId, oldTagId)
      .then(() => this.createTag(documentId, newTagName))
      .catch(toastErrorHandler);
  }

  createTag(documentId: string, newTagName: string) {
    return axios
      .post(`/api/documents/${documentId}/tags`, {
        name: newTagName,
      })
      .catch(toastErrorHandler);
  }

  deleteTag(documentId: string, tagId: number) {
    return axios
      .delete(`/api/documents/${documentId}/tags/${tagId}`)
      .catch(toastErrorHandler);
  }

  getTagsByDocumentId(documentId: string) {
    return axios
      .get(`/api/documents/${documentId}/tags`)
      .then((d) => d.data)
      .catch(toastErrorHandler);
  }

  getTags() {
    return axios
      .get("/api/tags/")
      .then((d) => d.data)
      .catch(toastErrorHandler);
  }
}
