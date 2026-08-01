// utils/formatDate.ts
export const formatDateParts = (isoString: string) => {
    const date = new Date(isoString);
    return {
        date: date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "2-digit" }),
        time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    };
};