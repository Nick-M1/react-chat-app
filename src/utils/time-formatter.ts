export default function dateFormatter(date: Date) {
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.toLocaleString("default", { day: "numeric" });

    const hour = date.toLocaleString("default", { hour: "2-digit" });
    const minute = date.toLocaleString("default", { minute: "2-digit" });

    return `${day} ${month}  ${hour}:${minute}`
}

// export default function dateFormatter(date: Date) {
//     // Get year, month, and day part from the date
//     const year = date.toLocaleString("default", { year: "numeric" });
//     const month = date.toLocaleString("default", { month: "2-digit" });
//     const day = date.toLocaleString("default", { day: "2-digit" });
//
//     return `${year}-${month}-${day}`
// }
