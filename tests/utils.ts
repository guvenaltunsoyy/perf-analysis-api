export const diffMinutes = (startDate: Date, endDate: Date) => {
    try {
        // @ts-ignore
        const diffMs = (endDate - startDate); // milliseconds between two dates
        return Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
    } catch (e) {
        return 0;
    }

};

export const now = () => new Date();
// @ts-ignore
export const oneHourAgo = () => new Date(now() - 3600000);
// @ts-ignore
export const halfHourAgo = () => new Date(now() - 1800000);
// @ts-ignore
export const tenMinutesAgo = () => new Date(now() - 600000);
// @ts-ignore
export const oneMinuteAgo = () => new Date(now() - 60000);
