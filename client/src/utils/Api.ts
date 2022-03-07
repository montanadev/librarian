import {JobModel} from "../models/Job";
import {DocumentModel} from "../models/Document";
import {ResourceModel} from "../models/Resource";
import {FolderModel} from "../models/Folder";
import {useQuery, useQueryClient} from "react-query";

export class Api {
    getDocuments(): Promise<ResourceModel<DocumentModel>> {
        return fetch("http://localhost:8000/api/documents/").then(d => d.json());
    }

    refreshJob(jobId: number): Promise<JobModel> {
        return fetch(`http://0.0.0.0:8000/api/documents/${jobId}/details`).then(d => d.json());
    }

    createDocument(acceptedFiles: any) {
        return acceptedFiles.map((file: any) => fetch(`http://0.0.0.0:8000/api/documents/${file.name}`, {
            method: 'POST',
            body: file,
        }).then(d => d.json()));
    }

    saveConfig(data: any) {
        return fetch('http://0.0.0.0:8000/api/config/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        }).then(res => res.json());
    }

    createFolder(folderName: string) {
        return fetch('http://0.0.0.0:8000/api/folders/', {
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
        return fetch(`http://0.0.0.0:8000/api/folders/${folderId}/document`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: documentId}),
        });
    }

    getFolders() {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        return fetch('http://0.0.0.0:8000/api/folders/').then(d => d.json());
    }

    renameFolder(folderId: number, newFolderName: string) {
        return fetch(`http://0.0.0.0:8000/api/folders/${folderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: folderId, name: newFolderName, documents: []}),
        });
    }
}
