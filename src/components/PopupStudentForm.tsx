import {Dialog, Transition} from "@headlessui/react";
import React, {Dispatch, Fragment, SetStateAction, useEffect, useState} from "react";
import DateSelector from "./DateSelector";
import dateFormatter from "../utils/time-formatter";
import toast from "react-hot-toast";
import {toastOptionsCustom} from "../utils/toast-options-custom";
import SubjectSelector from "./filters/SubjectSelector";
import getAllPossibleSubjects from "../utils/DB/getAllPossibleSubjects";

type Props = {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>

    studentToEdit: Student | null
    setPopupStudentFormStudent: Dispatch<SetStateAction<Student | null>>

    setRecentlyUpdatedStudent: Dispatch<SetStateAction<number | null>>
}

const DEFAULT_PROFILE_IMAGE = 'https://res.cloudinary.com/dmtc1wlgq/image/upload/v1641911896/media/avatar/default_zrdbiq.png'

export default function PopupStudentForm({ open, setOpen, studentToEdit, setPopupStudentFormStudent, setRecentlyUpdatedStudent }: Props) {
    const isEdit = studentToEdit != null

    const [studentName, setStudentName] = useState('')
    const [studentEmail, setStudentEmail] = useState( '')
    const [studentDob, setStudentDob] = useState<Date>(new Date())
    // const [studentYear, setStudentYear] = useState( getAllPossibleYears()[0])
    const [studentSubjects, setStudentSubjects] = useState( [] as string[])
    const [studentImage, setStudentImage] = useState( '')

    // Set or reset state, based on what 'studentToEdit' is
    useEffect(() => {
        if (studentToEdit != null) {
            setStudentName(studentToEdit.name)
            setStudentEmail(studentToEdit.email)
            setStudentDob(new Date(studentToEdit.dob))
            // setStudentYear(studentToEdit.year)
            setStudentSubjects(studentToEdit.subjects)
            setStudentImage(studentToEdit.image)
        } else {
            setStudentName('')
            setStudentEmail('')
            setStudentDob(new Date())
            // setStudentYear(getAllPossibleYears()[0])
            setStudentSubjects([] as string[])
            setStudentImage('')
        }
    }, [studentToEdit])


    // POST - Add new student to DB
    const postStudent = async () => {
        const studentRequest: StudentRequest = {
            name: studentName,
            email: studentEmail,
            image: studentImage == '' ? DEFAULT_PROFILE_IMAGE : studentImage,
            // year: studentYear,
            dob: dateFormatter(studentDob),
            subjects: studentSubjects
        }

        return fetch(
            'http://localhost:8080/api/v1/student',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify( studentRequest ),

            }
        )
    }

    // PUT - Update info of an already existing student in DB
    const putStudent = async () => {
        const urlSearchParams = new URLSearchParams({
            name: studentName,
            email: studentEmail,
            image: studentImage == '' ? DEFAULT_PROFILE_IMAGE : studentImage,
            // year: studentYear,
            dob: dateFormatter(studentDob),
        });

        studentSubjects.forEach(subject => urlSearchParams.append('subjects', subject))

        return fetch(
            `http://localhost:8080/api/v1/student/${studentToEdit?.id}?${urlSearchParams}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
    }

    const submitHandler = async () => {
        toast.loading('Uploading student to database...', { ...toastOptionsCustom, id: 'post/put student' } )

        // Run checks
        if (studentName == '' || studentEmail == '') {
            toast.error('Upload failed as some inputs field were left empty', { id: 'post/put student' })
            return
        }

        const response = isEdit ? await putStudent() : await postStudent()
        const responseJson = await response.json()

        if (!response.ok) {
            console.log(responseJson)
            toast.error('Upload failed', { id: 'post/put student' })
            return
        }

        const newStudentId: number = responseJson as number
        toast.success('Uploaded student successfully', { id: 'post/put student' })

        setOpen(false)
        setRecentlyUpdatedStudent(newStudentId)
        setPopupStudentFormStudent(null)

        setTimeout(() => {
            setStudentName('')
            setStudentEmail('')
            setStudentDob(new Date())
            // setStudentYear(getAllPossibleYears()[0])
            setStudentSubjects([] as string[])
            setStudentImage('')
        }, 200)
    }

    return (
        <Transition appear show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900"
                                >
                                    {isEdit ? 'Edit' : 'Add new'} student 👨🏻‍🎓
                                </Dialog.Title>
                                <section className='space-y-5 py-4'>
                                    <div className="">
                                        <div>
                                            <h1 className='leading-6 font-medium text-gray-900'>
                                                Student's Name
                                            </h1>
                                            <input
                                                type="text"
                                                name="title"
                                                id="title"
                                                className={`mt-1 block w-full input-primary ${true ? '' : 'input-secondary-invalid' }`}
                                                placeholder="Jack Smith"
                                                value={studentName}
                                                onChange={(e) => setStudentName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="">
                                        <div>
                                            <h1 className='leading-6 font-medium text-gray-900'>
                                                Student's Email Address
                                            </h1>
                                            <input
                                                type="text"
                                                name="title"
                                                id="title"
                                                className={`mt-1 block w-full input-primary ${true ? '' : 'input-secondary-invalid' }`}
                                                placeholder="jacksmith@gmail.com"
                                                value={studentEmail}
                                                onChange={(e) => setStudentEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    {/*<div className=''>*/}
                                    {/*    <h1 className='leading-6 font-medium text-gray-900 mb-0.5'>*/}
                                    {/*        Student's Year Group*/}
                                    {/*    </h1>*/}
                                    {/*    <LabelSelectorSingle allPossibleLabels={getAllPossibleYears()} selectedLabel={studentYear} setSelectedLabel={setStudentYear}/>*/}
                                    {/*</div>*/}
                                    <div className=''>
                                        <h1 className='leading-6 font-medium text-gray-900 mb-0.5'>
                                            Student's Subjects
                                        </h1>
                                        <SubjectSelector allPossibleLabels={getAllPossibleSubjects()} selectedLabels={studentSubjects} setSelectedLabels={setStudentSubjects}/>
                                    </div>
                                    <div className="">
                                        <h1 className='leading-6 font-medium text-gray-900'>
                                            Student's Date of Birth
                                        </h1>
                                        <DateSelector studentDob={studentDob} setStudentDob={setStudentDob}/>
                                    </div>
                                    <div className="">
                                        <div>
                                            <h1 className='leading-6 font-medium text-gray-900'>
                                                Student's Profile Image url
                                            </h1>
                                            <input
                                                type="text"
                                                name="title"
                                                id="title"
                                                className={`mt-1 block w-full input-primary ${true ? '' : 'input-secondary-invalid' }`}
                                                placeholder="www.example.com/image.png (optional)"
                                                value={studentImage}
                                                onChange={(e) => setStudentImage(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </section>

                                <div className="mt-4 flex justify-end gap-x-2">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center btn-secondary"
                                        onClick={() => setOpen(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        className="inline-flex justify-center btn-primary"
                                        onClick={() => submitHandler()}
                                    >
                                        Submit
                                    </button>
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}