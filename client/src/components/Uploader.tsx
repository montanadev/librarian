import React, {useCallback, useEffect} from "react";
import './Uploader.css';
import {useDropzone} from "react-dropzone";
import {useDispatch, useSelector} from "react-redux";
import {addToLibrary} from "../actions/Library";
import {List} from 'antd';
import {FileAddOutlined} from '@ant-design/icons';
import Job from "./Job";
import {RootState, SET_BREADCRUMB} from "../stores";


const Uploader = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({
            type: SET_BREADCRUMB,
            payload: ["Home", "Upload"]
        })
    }, [])

    const {jobs} = useSelector((state: RootState) => {
        if (!state) {
            return {}
        }
        return {
            jobs: state.jobs,
        };
    });

    const onDropInternal = useCallback(acceptedFiles => {
        dispatch(addToLibrary(acceptedFiles));
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