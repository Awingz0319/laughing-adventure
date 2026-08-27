import { parseISO, differenceInCalendarDays, subDays } from "date-fns";

/**
 * Calculates current streak and longest streak from an array of completion dates (YYYY-MM-DD strings).
 */
export function calculateStreaks(dateStrings = []) {
    if (!dateStrings || dateStrings.length === 0) {
        return { currentStreak: 0, longestStreak: 0 };
    }

    // 1. Sort unique dates descending (newest first)
    const sortedDates = Array.from(new Set(dateStrings))
        .map((d) => parseISO(d))
        .sort((a, b) => b - a);

    const today = new Date();
    const yesterday = subDays(today, 1);

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // 2. Check if the streak is active (completed today or yesterday)
    const daysSinceLatest = differenceInCalendarDays(today, sortedDates[0]);
    const isStreakActive = daysSinceLatest === 0 || daysSinceLatest === 1;

    // 3. Calculate current consecutive streak
    if (isStreakActive) {
        let expectedDate = sortedDates[0];
        for (const date of sortedDates) {
            if (differenceInCalendarDays(expectedDate, date) === 0) {
                currentStreak++;
                expectedDate = subDays(expectedDate, 1);
            } else {
                break;
            }
        }
    }

    // 4. Calculate all-time longest streak
    for (let i = 0; i < sortedDates.length; i++) {
        tempStreak = 1;
        for (let j = i; j < sortedDates.length - 1; j++) {
            if (
                differenceInCalendarDays(sortedDates[j], sortedDates[j + 1]) ===
                1
            ) {
                tempStreak++;
            } else {
                break;
            }
        }
        if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
        }
    }

    return { currentStreak, longestStreak };
}
