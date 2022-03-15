import React, { useCallback, useState } from "react";
import "./Uploader.css";
import { useDropzone } from "react-dropzone";
import { List } from "antd";
import { FileAddOutlined, FilePdfOutlined } from "@ant-design/icons";
import Job from "./Job";
import { Api } from "../utils/Api";

const Uploader = () => {
  const [jobs, setJobs] = useState([]);
  const api = new Api();

  const onDropInternal = useCallback((acceptedFiles) => {
    for (let file of acceptedFiles) {
      api
        .uploadDocuments(file)
        .then((doc: any) => setJobs((prevJobs) => prevJobs.concat(doc as any)))
        .catch((error: any) => {
          alert(error);
        });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropInternal,
  } as any);

  return (
    <div>
      <div {...getRootProps()} className="Uploader">
        <input {...(getInputProps() as any)} />
        <p />
        <p />
        <FilePdfOutlined style={{ fontSize: 50 }} />
        <p />
        {isDragActive ? (
          <p className="UploaderText">Drop the files here ...</p>
        ) : (
          <p className="UploaderText">
            Drag 'n' drop some PDFs here, or click to select files
          </p>
        )}
      </div>
      <div>
        <List
          itemLayout="horizontal"
          dataSource={jobs}
          renderItem={(job) => (
            <List.Item>
              <Job job={job} />
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default Uploader;
