import './Sidebar.css';
import './Job.css';
import React, {useState} from "react";
import {useInterval} from "../utils/setInterval";
import {useDispatch} from "react-redux";
import {refreshJob} from "../actions/Library";
import Progress from "./Progress";
import {Link} from "react-router-dom";

export interface JobProps {
    job: any
}

function Job(props: JobProps) {
    const dispatch = useDispatch();

    useInterval(() => {
        dispatch(refreshJob(props.job.id))
    }, props.job.status === 'ANNOTATED' ? null : 1000)

    let progress = () => {
        switch (props.job.status) {
            case "CREATED":
                return <Progress percent={10} done={false} success={false}/>
            case "PERSISTING":
                return <Progress percent={25} done={false} success={false}/>
            case "PERSISTED":
                return <Progress percent={40} done={false} success={false}/>
            case "TRANSLATING_PDF_TO_IMAGES":
                return <Progress percent={55} done={false} success={false}/>
            case "TRANSLATED_PDF_TO_IMAGES":
                return <Progress percent={70} done={false} success={false}/>
            case "ANNOTATING":
                return <Progress percent={85} done={false} success={false}/>
            case "ANNOTATED":
                return <Progress percent={100} done={true} success={true}/>
            default:
                return <Progress percent={100} done={true} success={false}/>
        }
    }

    return <div className="Job">
        <div className="JobFilename">
            {props.job.status === "ANNOTATED" ?
                <Link to={`/documents/${props.job.id}`}>{props.job.filename}</Link> : props.job.filename}
        </div>
        <div className="JobProgress">
            {progress()}
        </div>
    </div>
}

export default Job;