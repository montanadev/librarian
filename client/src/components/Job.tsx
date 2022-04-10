import "./Job.css";
import React, { useState } from "react";
import { useInterval } from "../utils/setInterval";
import Progress from "./Progress";
import { Link } from "react-router-dom";
import { Api } from "../utils/Api";
import { useQueryClient } from "react-query";

export interface JobProps {
  job: any;
}

function Job(props: JobProps) {
  const api = new Api();
  const queryClient = useQueryClient();
  const [job, setJob] = useState(props.job);

  useInterval(
    () => {
      api.refreshJob(props.job.id).then((job) => setJob(job));
    },
    job.status === "ANNOTATED" ? null : 1000
  );

  if (job.status === "ANNOTATED") {
    // job finished, reload folders to pick up newly uploaded document
    queryClient.invalidateQueries("folders");
  }

  let progress = () => {
    switch (job.status) {
      case "CREATED":
        return <Progress percent={10} done={false} success={false} />;
      case "PERSISTING":
        return <Progress percent={25} done={false} success={false} />;
      case "PERSISTED":
        return <Progress percent={40} done={false} success={false} />;
      case "TRANSLATING_PDF_TO_IMAGES":
        return <Progress percent={55} done={false} success={false} />;
      case "TRANSLATED_PDF_TO_IMAGES":
        return <Progress percent={70} done={false} success={false} />;
      case "ANNOTATING":
        return <Progress percent={85} done={false} success={false} />;
      case "ANNOTATED":
        return <Progress percent={100} done={true} success={true} />;
      default:
        return <Progress percent={100} done={true} success={false} />;
    }
  };

  return (
    <div className="Job">
      <div className="JobFilename">
        {job.status === "ANNOTATED" ? (
          <Link to={`/folders/${job.folder}/documents/${job.id}`}>
            {job.filename} (click to view)
          </Link>
        ) : (
          job.filename
        )}
      </div>
      <div className="JobProgress">{progress()}</div>
    </div>
  );
}

export default Job;
