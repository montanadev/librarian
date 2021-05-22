import React, {useEffect, useRef, useState} from "react";
import './Uploader.css';
import {useParams} from "react-router-dom";

import {Document, Page} from 'react-pdf/dist/esm/entry.webpack';
import {useContainerDimensions} from "../utils/useContainerDimenstions";
import {SET_BREADCRUMB} from "../stores";
import { useDispatch } from "react-redux";


const Viewer = () => {
    const dispatch = useDispatch();
    let {documentId} = useParams<any>();

    useEffect(() => {
        dispatch({
            type: SET_BREADCRUMB,
            payload: ["Docs", "Recent"]
        })
    }, [])

    const [numPages, setNumPages] = useState(null);

    const onDocumentLoadSuccess = (pdf: any) => {
        setNumPages(pdf.numPages);
    }

    const containerRef = useRef<any>()
    //const { width } = useContainerDimensions(containerRef)

    return <div ref={containerRef}>
        <Document file={`http://0.0.0.0:8000/api/documents/${documentId}/data`}
                  onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
                <Page width={500} key={`page_${index + 1}`}
                      pageNumber={index + 1}/>
            ))}
        </Document>
    </div>;
}

export default Viewer;