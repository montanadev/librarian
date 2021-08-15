import axios from "axios";
import {useEffect, useState} from "react";
import {useLocation} from "react-router";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Search() {
    const [documentSearch, setDocumentSearch] = useState([])
    const [documentTextSearch, setDocumentTextSearch] = useState([])
    const query = useQuery();
    const q = query.get('q');
    console.log(q);

    useEffect(() => {
        axios.get('http://localhost:8000/api/documents/search', {
            params: {q}
        }).then(d => setDocumentSearch(d.data))

        axios.get('http://localhost:8000/api/documents/text/search', {
            params: {q}
        }).then(d => setDocumentTextSearch(d.data))
    }, [q])

    return <div>
        <h1>Document Search</h1>
        <p>{JSON.stringify(documentSearch)}</p>

        <h1>Document Text Search</h1>
        <p>{JSON.stringify(documentTextSearch)}</p>
    </div>
}

export default Search