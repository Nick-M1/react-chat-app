import "@fontsource/montserrat";
import React, { useEffect, useState} from 'react'
import getAllStudents from "../utils/DB/getAllStudents";
import MainPage from "./components/MainPage";
import {Column} from "react-table";
import {Toaster} from "react-hot-toast";

// const getData = () => [
//     {
//         name: "Jane Cooper",
//         email: "jane.cooper@example.com",
//         title: "Regional Paradigm Technician",
//         department: "Optimization",
//         status: "Active",
//         role: "Admin",
//         imgUrl:
//             "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
//     },
//     {
//         name: "Cody Fisher",
//         email: "cody.fisher@example.com",
//         title: "Product Directives Officer",
//         department: "Intranet",
//         status: "Active",
//         role: "Owner",
//         imgUrl:
//             "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
//     },
//     {
//         name: "Esther Howard",
//         email: "esther.howard@example.com",
//         title: "Forward Response Developer",
//         department: "Directives",
//         status: "Active",
//         role: "Member",
//         imgUrl:
//             "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
//     },
//     {
//         name: "Jenny Wilson",
//         email: "jenny.wilson@example.com",
//         title: "Central Security Manager",
//         department: "Program",
//         status: "Active",
//         role: "Member",
//         imgUrl:
//             "https://images.unsplash.com/photo-1498551172505-8ee7ad69f235?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
//     },
//     {
//         name: "Kristin Watson",
//         email: "kristin.watson@example.com",
//         title: "Lean Implementation Liaison",
//         department: "Mobility",
//         status: "Active",
//         role: "Admin",
//         imgUrl:
//             "https://images.unsplash.com/photo-1532417344469-368f9ae6d187?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
//     },
//     {
//         name: "Cameron Williamson",
//         email: "cameron.williamson@example.com",
//         title: "Internal Applications Engineer",
//         department: "Security",
//         status: "Active",
//         role: "Member",
//         imgUrl:
//             "https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
//     },
// ];

const columns: StudentColumn[] = [
    {
        header: "Student id",
        accessor: "id",
    },
    {
        header: "Name",
        accessor: "name",
    },
    {
        header: "Email",
        accessor: "email",
    },
    {
        header: "DOB (age)",
        accessor: "dob",
    },
]


export default function App() {
    // From DB
    const [students, setStudents] = useState([] as Student[])

    // Querying for DB
    const [sortingAsc, setSortingAsc] = useState(true)
    const [sortingOrderby, setSortingOrderby] = useState('id')
    const [sortingTextsearch, setSortingTextsearch] = useState('')

    // For updates from client to db
    const [recentlyUpdatedStudent, setRecentlyUpdatedStudent] = useState<number | null>(null)

    useEffect(() => {
        getAllStudents(setStudents, sortingAsc, sortingOrderby, sortingTextsearch)
        setTimeout(() => setRecentlyUpdatedStudent(null), 400)
    }, [recentlyUpdatedStudent, sortingAsc, sortingOrderby, sortingTextsearch])

    return (
        <div className="font-montserrat">
            <Toaster/>
            <MainPage
                columns={columns}
                students={students}
                recentlyUpdatedStudent={recentlyUpdatedStudent}
                setRecentlyUpdatedStudent={setRecentlyUpdatedStudent}

                sortingAsc={sortingAsc}
                setSortingAsc={setSortingAsc}
                sortingOrderby={sortingOrderby}
                setSortingOrderby={setSortingOrderby}
                sortingTextsearch={sortingTextsearch}
                setSortingTextsearch={setSortingTextsearch}
            />
        </div>
    )
}
