type Student = {
    id: number,
    name: string,
    email: string,
    dob: string,
    age: number
}

type StudentRequest = {
    name: string,
    email: string,
    dob: string,
}

type StudentColumn = {
    header: string
    accessor: string
}