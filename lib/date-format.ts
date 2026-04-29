export function formatDate(timestamp: number) {
    const ts = timestamp < 1e12 ? timestamp * 1000 : timestamp;
    const now = Date.now();
    const diffMs = now - ts;

    const second = 1000;
    const minute = 60 * second;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;

    if (diffMs < 10 * second) {
        return "just now";
    }

    if (diffMs < minute) {
        const s = Math.floor(diffMs / second);
        return `${s} second${s > 1 ? "s" : ""} ago`;
    }

    if (diffMs < hour) {
        const m = Math.floor(diffMs / minute);
        return `${m} minute${m > 1 ? "s" : ""} ago`;
    }

    if (diffMs < day) {
        const h = Math.floor(diffMs / hour);
        return `${h} hour${h > 1 ? "s" : ""} ago`;
    }

    if (diffMs < week) {
        const d = Math.floor(diffMs / day);
        return `${d} day${d > 1 ? "s" : ""} ago`;
    }

    if (diffMs < month) {
        const w = Math.floor(diffMs / week);
        return `${w} week${w > 1 ? "s" : ""} ago`;
    }

    if (diffMs < year) {
        const mo = Math.floor(diffMs / month);
        return `${mo} month${mo > 1 ? "s" : ""} ago`;
    }

    const y = Math.floor(diffMs / year);
    return `${y} year${y > 1 ? "s" : ""} ago`;
}