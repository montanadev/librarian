import {JobModel} from "../models/Job";
import {DocumentModel} from "../models/Document";

export class Api {
    getDocuments(): Promise<Array<DocumentModel>> {
        return fetch("http://localhost:8000/api/documents/").then(d => d.json());
    }

    refreshJob(jobId: number): Promise<JobModel> {
        return fetch(`http://0.0.0.0:8000/api/documents/${jobId}/details`).then(d => d.json());
    }

    createDocument(acceptedFiles: any) {
        return acceptedFiles.map((file: any) => fetch(`http://0.0.0.0:8000/api/documents/${file.name}`, {
            method: 'POST',
            body: file,
        }).then(d => d.json()))
    }
}
