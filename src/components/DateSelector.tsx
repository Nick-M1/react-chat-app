import React, {useState} from "react";
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from "react-datepicker";

type Props = {
    studentDob: Date
    setStudentDob: React.Dispatch<React.SetStateAction<Date>>
}

export default function Example({ studentDob, setStudentDob }: Props) {

    return (
        <DatePicker
            className='mt-1 block w-full input-primary'
            selected={studentDob}
            onChange={(date) => {
                if (date != null) setStudentDob(date)
            }}
            dateFormat='yyyy-MM-dd'
        />
    );
};