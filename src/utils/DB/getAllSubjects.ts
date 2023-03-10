import {Dispatch, SetStateAction} from "react";

export default function getAllSubjects(setAllSubjects: Dispatch<SetStateAction<string[]>>) {
    fetch('http://localhost:8080/api/v1/student/subjects')
        .then(res => res.json())
        .then((res: string[]) => setAllSubjects(res))
}

