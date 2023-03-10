import Table from "./Table";
import {Dispatch, SetStateAction, useState} from "react";
import PopupStudentForm from "./PopupStudentForm";
import Searchbar from "./Searchbar";
import SubjectSelector from "./filters/SubjectSelector";

type Props = {
    columns: StudentColumn[]
    students: Student[]
    allSubjects: string[]

    recentlyUpdatedStudent: number | null
    setRecentlyUpdatedStudent: Dispatch<SetStateAction<number | null>>

    // QUERYING
    sortingAsc: boolean
    setSortingAsc: Dispatch<SetStateAction<boolean>>
    sortingOrderby: string
    setSortingOrderby: Dispatch<SetStateAction<string>>
    sortingTextsearch: string
    setSortingTextsearch: Dispatch<SetStateAction<string>>
    selectedSubjects: string[]
    setSelectedSubjects: Dispatch<SetStateAction<string[]>>
}

export default function MainPage({ columns, students, allSubjects, recentlyUpdatedStudent, setRecentlyUpdatedStudent, sortingAsc, setSortingAsc, sortingOrderby, setSortingOrderby, sortingTextsearch, setSortingTextsearch, selectedSubjects, setSelectedSubjects }: Props) {
    const [popupStudentFormOpen, setPopupStudentFormOpen] = useState(false)
    const [popupStudentFormStudent, setPopupStudentFormStudent] = useState<Student | null>(null)

    return (
        <>
            <div className="min-h-screen bg-gray-100 text-gray-900 py-6">
                <main className="mx-auto px-4 sm:px-6 lg:px-32 pt-4">
                    <div className="">
                        <h1 className="text-3xl font-bold flex tracking-wide pb-6">
                            <img src='/public/brand-logo.png' className='w-20 h-20 mr-3'/>
                            Student Management <br/> System
                        </h1>
                    </div>

                    <div className='grid grid-cols-4'>
                        <div className='col-span-3'>
                            <Searchbar sortingTextsearch={sortingTextsearch} setSortingTextsearch={setSortingTextsearch}/>
                        </div>
                        <div className='col-start-5'>
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
                    </div>

                    <div className='mt-7 block leading-6 text-gray-700 mb-3'>
                        <p className='mb-1'>Filter by subjects</p>
                        <SubjectSelector allPossibleLabels={allSubjects} selectedLabels={selectedSubjects} setSelectedLabels={setSelectedSubjects} />
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