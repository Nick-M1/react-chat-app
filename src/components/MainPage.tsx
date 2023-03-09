import Table from "./Table";
import {Dispatch, SetStateAction, useState} from "react";
import PopupStudentForm from "./PopupStudentForm";
import Searchbar from "./Searchbar";

type Props = {
    columns: StudentColumn[]
    students: Student[]

    recentlyUpdatedStudent: number | null
    setRecentlyUpdatedStudent: Dispatch<SetStateAction<number | null>>

    // QUERYING
    sortingAsc: boolean
    setSortingAsc: Dispatch<SetStateAction<boolean>>
    sortingOrderby: string
    setSortingOrderby: Dispatch<SetStateAction<string>>
    sortingTextsearch: string
    setSortingTextsearch: Dispatch<SetStateAction<string>>
}

export default function MainPage({ columns, students, recentlyUpdatedStudent, setRecentlyUpdatedStudent, sortingAsc, setSortingAsc, sortingOrderby, setSortingOrderby, sortingTextsearch, setSortingTextsearch }: Props) {
    const [popupStudentFormOpen, setPopupStudentFormOpen] = useState(false)
    const [popupStudentFormStudent, setPopupStudentFormStudent] = useState<Student | null>(null)

    return (
        <>
            <div className="min-h-screen bg-gray-100 text-gray-900 py-6">
                <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    <div className="flex justify-between">
                        <h1 className="text-xl font-semibold">
                            Student Management System
                        </h1>
                        <button
                            type='button'
                            onClick={() => {
                                setPopupStudentFormStudent(null)
                                setPopupStudentFormOpen(true)
                            }}
                            className='btn-primary'
                        >
                            Add new student
                        </button>
                    </div>

                    <div className='grid grid-cols-2'>
                        <Searchbar sortingTextsearch={sortingTextsearch} setSortingTextsearch={setSortingTextsearch}/>
                    </div>

                    <div className="mt-6">
                        <Table
                            columns={columns}
                            students={students}
                            recentlyUpdatedStudent={recentlyUpdatedStudent}
                            setPopupStudentFormOpen={setPopupStudentFormOpen}
                            setPopupStudentFormStudent={setPopupStudentFormStudent}
                            setRecentlyUpdatedStudent={setRecentlyUpdatedStudent}

                            sortingAsc={sortingAsc}
                            setSortingAsc={setSortingAsc}
                            sortingOrderby={sortingOrderby}
                            setSortingOrderby={setSortingOrderby}
                        />
                    </div>
                </main>
            </div>

            <PopupStudentForm
                open={popupStudentFormOpen}
                setOpen={setPopupStudentFormOpen}

                setRecentlyUpdatedStudent={setRecentlyUpdatedStudent}

                studentToEdit={popupStudentFormStudent}
                setPopupStudentFormStudent={setPopupStudentFormStudent}
            />
        </>
    );
}