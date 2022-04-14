import React, { useCallback, useState } from "react";
import "./Uploader.css";
import { useDropzone } from "react-dropzone";
import { List } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import Job from "./Job";
import { Api } from "../utils/Api";
import { useQuery } from "react-query";
import { ResourceModel } from "../models/Resource";
import { DocumentModel } from "../models/Document";
import { Loading } from "./Loading";
import { toastError } from "../utils/toasts";

const Uploader = () => {
  const api = new Api();
  const fifteenMinutesAgo = new Date(Date.now() - 1000 * 60 * 15);
  const [createdAfter] = useState(fifteenMinutesAgo);

  const onDropInternal = useCallback((acceptedFiles) => {
    for (let file of acceptedFiles) {
      api.uploadDocuments(file).catch((error: any) => {
        if (error.response?.data?.reason) {
          toastError(error.response?.data?.reason);
        } else {
          toastError(error.message);
        }
      });
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropInternal,
  } as any);

  const documents = useQuery<ResourceModel<DocumentModel>>(
    "uploaded-documents",
    () => api.getDocuments(createdAfter),
    { refetchInterval: 1000 }
  );
  if (documents.isLoading || !documents.data) {
    return <Loading />;
  }

  return (
    <>
      <div {...getRootProps()} className="Uploader">
        <input {...(getInputProps() as any)} />
        <p />
        <p />
        <FilePdfOutlined style={{ fontSize: 50 }} />
        <p />
        {isDragActive ? (
          <p className="UploaderText" data-cy="dropzone">
            Drop the files here ...
          </p>
        ) : (
          <p className="UploaderText" data-cy="dropzone">
            Drag 'n' drop some PDFs here, or click to select files
          </p>
        )}
      </div>
      <>
        <List
          itemLayout="horizontal"
          dataSource={documents.data.results}
          renderItem={(document) => (
            <List.Item>
              <Job document={document} />
            </List.Item>
          )}
        />
      </>
    </>
  );
};

export default Uploader;
