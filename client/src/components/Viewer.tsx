import React, {useEffect, useRef, useState} from "react";
import './Uploader.css';
import {useParams} from "react-router-dom";
import {Spin} from "antd";

import {Document, Page} from 'react-pdf';
import {useContainerDimensions} from "../utils/useContainerDimenstions";
import {SET_BREADCRUMB} from "../stores";
import {useDispatch} from "react-redux";
import {DocumentModel} from "../models/Document";
//import {VariableSizeList} from 'react-window';


const Viewer = () => {
    const dispatch = useDispatch();
    let {documentId} = useParams<any>();


    useEffect(() => {
        dispatch({
            type: SET_BREADCRUMB,
            payload: ["Docs"]
        })

        fetch(`http://0.0.0.0:8000/api/documents/${documentId}/details`).then(d => d.json()).then((document: DocumentModel) => {
            dispatch({
                type: SET_BREADCRUMB,
                payload: ["Docs", document.filename]
            })
        });
    }, [])

    const [numPages, setNumPages] = useState(null);
    const [pdf, setPdf] = useState(null);

    const onDocumentLoadSuccess = (pdf: any) => {
        setNumPages(pdf.numPages);
        setPdf(pdf);
    }

    const containerRef = useRef<any>()
    const { width } = useContainerDimensions(containerRef)

    return <div ref={containerRef}>
        <Document file={`http://0.0.0.0:8000/api/documents/${documentId}/data`}
                  loading={<Spin size="large"/>}
                  onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (el, index) => (
                    <Page width={width} key={`page_${index + 1}`}
                          pageNumber={index + 1}/>
                ))}
        </Document>
    </div>;
}

export default Viewer;
