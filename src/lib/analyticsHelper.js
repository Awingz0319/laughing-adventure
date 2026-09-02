import { format, subDays, startOfDay, isSameDay, parseISO } from "date-fns";

export function generateWeeklyData(habits = []) {
    const today = startOfDay(new Date());
    const last7Days = [];

    // Generate the last 7 days (oldest to newest)
    for (let i = 6; i >= 0; i--) {
        last7Days.push(subDays(today, i));
    }

    // Count total completed habits for each day
    return last7Days.map((day) => {
        let completedCount = 0;

        habits.forEach((habit) => {
            const isDoneOnDay = (habit.habit_logs || []).some((log) =>
                isSameDay(parseISO(log.completed_at), day),
            );
            if (isDoneOnDay) completedCount++;
        });

        return {
            day: format(day, "EEE"), // "Mon", "Tue", etc.
            completed: completedCount,
            totalHabits: habits.length,
        };
    });
}
