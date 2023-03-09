import {Dispatch, SetStateAction} from "react";

export default function getAllStudents(setStudents: Dispatch<SetStateAction<Student[]>>, sortingAcs: boolean, sortingOrderby: string, sortingTextsearch: string) {
    const urlParams = new URLSearchParams({
        searchBy: sortingTextsearch,
        orderBy: sortingOrderby,
        isAsc: sortingAcs ? 'true' : 'false'
    })

    fetch(`http://localhost:8080/api/v1/student?${urlParams}`)
        .then(res => res.json())
        .then((res: Student[]) => setStudents(res))
}

