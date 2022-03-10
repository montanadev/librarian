import {JobModel} from "../models/Job";
import {DocumentModel} from "../models/Document";
import {ResourceModel} from "../models/Resource";

export class Api {
    getDocuments(): Promise<ResourceModel<DocumentModel>> {
        return fetch("http://localhost:8000/api/documents/").then(d => d.json());
    }

    refreshJob(jobId: number): Promise<JobModel> {
        return fetch(`/api/documents/${jobId}/details`).then(d => d.json());
    }

    createDocument(acceptedFiles: any) {
        return acceptedFiles.map((file: any) => fetch(`/api/documents/${file.name}`, {
            method: 'POST',
            body: file,
        }).then(d => d.json()));
    }

    saveConfig(data: any) {
        return fetch('/api/config/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        }).then(res => res.json());
    }

    createFolder(folderName: string) {
        return fetch('/api/folders/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name: folderName, documents: []}),
        }).then(() => {

            console.log("Invalidated!");
        });
    }

    addDocumentToFolder(documentId: number, folderId: number) {
        return fetch(`/api/folders/${folderId}/document`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: documentId}),
        });
    }

    getFolders() {
        return fetch('/api/folders/').then(d => d.json());
    }

    renameFolder(folderId: number, newFolderName: string) {
        return fetch(`/api/folders/${folderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: folderId, name: newFolderName, documents: []}),
        });
    }

    renameDocument(documentId: number, newDocumentName: string) {
        return fetch(`/api/documents/${documentId}/details`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: documentId, filename: newDocumentName}),
        });
    }
}
