import React, {useCallback, useState} from "react";
import './Uploader.css';
import {useDropzone} from "react-dropzone";
import {List} from 'antd';
import {FileAddOutlined} from '@ant-design/icons';
import Job from "./Job";
import {Api} from "../utils/Api";


const Uploader = () => {
    const [jobs, setJobs] = useState([])
    const api = new Api();

    const onDropInternal = useCallback(acceptedFiles => {
        Promise.all(api.createDocument(acceptedFiles)).then(docs => setJobs(prevJobs => prevJobs.concat(docs as any)));
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop: onDropInternal} as any)

    return <div>
        <div {...getRootProps()} className="Uploader">
            <input {...getInputProps() as any} />
            <p/><p/>
            <FileAddOutlined style={{fontSize: 50}}/>
            <p/>
            {
                isDragActive ?
                    <p className="UploaderText">Drop the files here ...</p> :
                    <p className="UploaderText">Drag 'n' drop some files here, or click to select files</p>
            }
        </div>
        <div>
            <List
                itemLayout="horizontal"
                dataSource={jobs}
                renderItem={job => (
                    <List.Item>
                        <Job job={job}/>
                    </List.Item>
                )}
            />
        </div>
    </div>;
}

export default Uploader;