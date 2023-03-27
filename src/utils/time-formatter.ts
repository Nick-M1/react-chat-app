export enum DateFormatterOptions {
    FULL,
    DATE_ONLY,
    TIME_ONLY
}

export default function dateFormatter(date: Date, option: DateFormatterOptions) {
    const year = date.toLocaleString("default", { year: "numeric" });
    const month = date.toLocaleString("default", { month: "short" });
    const day = date.toLocaleString("default", { day: "2-digit" });
    const time = date.toLocaleString("default", { timeStyle: 'short' });

    switch (option) {
        case DateFormatterOptions.FULL:         return `${day} ${month}  ${time}`
        case DateFormatterOptions.DATE_ONLY:    return `${day} ${month} ${year}`
        case DateFormatterOptions.TIME_ONLY:    return `${time}`
    }

}
