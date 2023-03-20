export default function dateFormatter(date: Date) {
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.toLocaleString("default", { day: "2-digit" });
    const time = date.toLocaleString("default", { timeStyle: 'short' });

    return `${day} ${month}  ${time}`
}
