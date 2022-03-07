import React, {useRef, useState} from "react";
import './Uploader.css';
import {useHistory, useParams} from "react-router-dom";
import {Button, Divider, Spin} from "antd";

import {Document, Page} from 'react-pdf';
import {useContainerDimensions} from "../utils/useContainerDimenstions";
import {AddToFolderModal} from "./modals/AddToFolderModal";
import {Api} from "../utils/Api";
import {ResourceModel} from "../models/Resource";
import {FolderModel} from "../models/Folder";
import {useQuery, useQueryClient} from "react-query";


function Viewer() {
    let {documentId, folderId} = useParams<any>();
    const [openAddToFolderModal, setOpenAddToFolderModal] = useState(false);
    const queryClient = useQueryClient()
    const api = new Api();
    const history = useHistory();

    const [numPages, setNumPages] = useState(null);
    const [pdf, setPdf] = useState(null);

    const onDocumentLoadSuccess = (pdf: any) => {
        setNumPages(pdf.numPages);
        setPdf(pdf);
    }

    const {
        isLoading,
        error,
        data,
        isFetching
    } = useQuery<ResourceModel<FolderModel>>("folders", api.getFolders);

    let next: Array<number> = [];
    let prev: Array<number> = [];

    if (data && !isLoading) {
        let entries = [];
        let foundIdx = -1;

        // flatten the folder / doc hierarchy into list
        for (let folder of data.results) {
            for (let document of folder.documents) {
                entries.push([folder.id, document.id]);
                if (document.id === parseInt(documentId) && folder.id === parseInt(folderId)) {
                    foundIdx = entries.length - 1;
                }
            }
        }

        // find the doc before and after the currently loaded one
        // and use it to power the prev/next buttons
        if (foundIdx !== -1) {
            if (foundIdx - 1 < 0) {
                prev = entries[entries.length - 1];
            } else {
                prev = entries[foundIdx - 1];
            }

            if (foundIdx + 1 === entries.length) {
                next = entries[0]
            } else {
                next = entries[foundIdx + 1];
            }
        }
    }

    const containerRef = useRef<any>()
    const {width} = useContainerDimensions(containerRef)

    return <div>
        <AddToFolderModal visible={openAddToFolderModal}
                          onClose={() => setOpenAddToFolderModal(false)}
                          onAddToFolder={(folderId: number) => {
                              api.addDocumentToFolder(documentId, folderId).then(() => {
                                  setOpenAddToFolderModal(false);
                                  queryClient.invalidateQueries("folders");
                              });
                          }}/>

        <div>
            <Button onClick={() => setOpenAddToFolderModal(true)}>Add to folder</Button>
            <Divider type="vertical"/>
            <Button disabled>Remove from folder</Button>

            <div style={{float: 'right'}}>
                <Button onClick={() => {
                    if (!prev) {
                        return
                    }
                    history.push(`/folders/${prev[0]}/documents/${prev[1]}`);
                }}>Prev</Button>
                <Divider type="vertical"/>
                <Button onClick={() => {
                    if (!next) {
                        return
                    }
                    history.push(`/folders/${next[0]}/documents/${next[1]}`);
                }}>Next</Button>

            </div>

        </div>
        <div ref={containerRef}>
            <Document file={`/api/documents/${documentId}/data`}
                      loading={<Spin size="large"/>}
                      onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (el, index) => (
                    <Page width={width} key={`page_${index + 1}`}
                          pageNumber={index + 1}/>
                ))}
            </Document>
        </div>
    </div>
}

export default Viewer;
