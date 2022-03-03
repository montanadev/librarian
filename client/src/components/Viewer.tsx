import React, {useRef, useState} from "react";
import './Uploader.css';
import {useParams} from "react-router-dom";
import {Button, Divider, Spin} from "antd";

import {Document, Page} from 'react-pdf';
import {useContainerDimensions} from "../utils/useContainerDimenstions";
import {AddToFolderModal} from "./modals/AddToFolderModal";
import {Api} from "../utils/Api";


const Viewer = () => {
    let {documentId} = useParams<any>();
    const [openAddToFolderModal, setOpenAddToFolderModal] = useState(false);
    const api = new Api();

    const [numPages, setNumPages] = useState(null);
    const [pdf, setPdf] = useState(null);

    const onDocumentLoadSuccess = (pdf: any) => {
        setNumPages(pdf.numPages);
        setPdf(pdf);
    }

    const containerRef = useRef<any>()
    const {width} = useContainerDimensions(containerRef)

    return <div>
        <AddToFolderModal visible={openAddToFolderModal} onClose={() => setOpenAddToFolderModal(false)} onAddToFolder={(folderId: number) => {
            api.addDocumentToFolder(documentId, folderId).then(() => setOpenAddToFolderModal(false));
        }} />

        <div>
            <Button onClick={() => setOpenAddToFolderModal(true)}>Add to folder</Button>
            <Divider type="vertical" />
            <Button>Remove from folder</Button>
        </div>
        <div ref={containerRef}>
            <Document file={`http://0.0.0.0:8000/api/documents/${documentId}/data`}
                      loading={<Spin size="large"/>}
                      onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (el, index) => (
                    <Page width={width} key={`page_${index + 1}`}
                          pageNumber={index + 1}/>
                ))}
            </Document>
        </div>
    </div>;
}

export default Viewer;
