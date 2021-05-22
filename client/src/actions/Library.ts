import {Dispatch, Store} from 'redux';
import {ADD_JOB, LOAD_DOCUMENT, LOAD_LIBRARY, REFRESH_JOB} from "../stores";

export const refreshLibrary = async (dispatch: Dispatch, store: Store) => {
    const data = await fetch("http://localhost:8000/api/documents/").then(d => d.json());

    dispatch({type: LOAD_LIBRARY, payload: {
        documentsAvailable: 0,
        documents: data.results,
        ready: true,
        loading: false,
    }});
}

export const refreshJob = (jobId: any) => async (dispatch: Dispatch, store: Store) => {
    await fetch(`http://0.0.0.0:8000/api/documents/${jobId}/details`).then(d => d.json()).then((job: any) => {
       dispatch({
           type: REFRESH_JOB,
           payload: job,
       })
    });
}

export const loadDocument = (documentId: any) => async (dispatch: Dispatch, store: Store) => {
    await fetch(`http://0.0.0.0:8000/api/documents/${documentId}/data`).then(d => d.arrayBuffer()).then(d => {
        dispatch({
            type: LOAD_DOCUMENT,
            payload: new Uint8Array(d),
        })
    });
}

export const addToLibrary = (acceptedFiles: any) => async (dispatch: Dispatch, store: Store) => {
    for (let file of acceptedFiles) {
        await fetch(`http://0.0.0.0:8000/api/documents/${file.name}`, {
            method: 'POST',
            body: file,
        }).then(d => d.json())
        .then(((document: any) => {
                console.log('here!');
                dispatch({
                    type: ADD_JOB,
                    payload: document,
                })
            }
            // do something to inform the Progress store of the item to watch
            //
            // each instance of the progress bar should be phoning home to check
            // updates to the status.
        ));
    }
}
