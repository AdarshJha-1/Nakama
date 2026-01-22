export function formatDate(timestamp: number) {
    const ts = timestamp < 1e12 ? timestamp * 1000 : timestamp;
    const now = Date.now();
    const diffMs = now - ts;

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const year = 365 * day;

    if (diffMs < minute) {
        return "just now";
    }

    if (diffMs < hour) {
        return `${Math.floor(diffMs / minute)}m`;
    }

    if (diffMs < day) {
        return `${Math.floor(diffMs / hour)}h`;
    }

    if (diffMs < 7 * day) {
        return `${Math.floor(diffMs / day)}d`;
    }

    const date = new Date(ts);

    if (diffMs >= year) {
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
    });
}
