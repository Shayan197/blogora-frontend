export const maskEmail = (email: string | null) => {
    if (!email) return '';
    const [name, domain] = email.split('@');
    if (!name || !domain) return email;

    const visibleStart = name.slice(0, 3);
    const visibleEnd = name.slice(-2);
    return `${visibleStart}***${visibleEnd}@${domain}`;
};

export const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    if (seconds < 86400)
        return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    return `${Math.floor(seconds / 86400)}d ${Math.floor((seconds % 86400) / 3600)}h`;
};
