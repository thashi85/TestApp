import { ViewType, TimeInterval, Facility } from './types';

export const getColumnsForView = (view: ViewType, date?: Date): number => {
    switch (view) {
        case 'day':
            return 1;
        case 'week':
            return 7;
        case 'month':
            if (date) {
                // Get the actual number of days in the month (28/29/30/31)
                const year = date.getFullYear();
                const month = date.getMonth();
                return new Date(year, month + 1, 0).getDate();
            }
            return 30; // fallback
        default:
            return 1;
    }
};

export const getSubCellsPerHour = (interval: TimeInterval): number => {
    return 60 / interval;
};

export const getTotalSubCells = (view: ViewType, interval: TimeInterval): number => {
    const columns = getColumnsForView(view);
    const hoursPerDay = 24;
    const subCellsPerHour = getSubCellsPerHour(interval);
    return columns * hoursPerDay * subCellsPerHour;
};

export const flattenFacilities = (facilities: Facility[]): Facility[] => {
    const result: Facility[] = [];

    const traverse = (facility: Facility, level: number) => {
        facility.level = level;

        result.push(facility);
        if (facility.isExpanded && facility.children) {
            facility.children.forEach(child => traverse(child, level + 1));

        }
    };

    facilities.forEach(child => traverse(child, 0));
    return result;
};

export const toggleFacilityExpansion = (
    facilities: Facility[],
    facilityId: string
): Facility[] => {
    return facilities.map(facility => {
        if (facility.id === facilityId) {
            return { ...facility, isExpanded: !facility.isExpanded };
        }
        if (facility.children) {
            return {
                ...facility,
                children: toggleFacilityExpansion(facility.children, facilityId)
            };
        }
        return facility;
    });
};

export const getDateRange = (view: ViewType, startDate: Date): Date[] => {
    const dates: Date[] = [];

    switch (view) {
        case 'day':
            dates.push(new Date(startDate));
            break;
        case 'week':
            // For week view, generate 7 days starting from Sunday
            const weekStart = new Date(startDate);
            const dayOfWeek = weekStart.getDay();
            weekStart.setDate(weekStart.getDate() - dayOfWeek);

            for (let i = 0; i < 7; i++) {
                const date = new Date(weekStart);
                date.setDate(date.getDate() + i);
                dates.push(date);
            }
            break;
        case 'month':
            // For month view, generate all days in the month starting from the 1st
            const monthStart = new Date(startDate);
            monthStart.setDate(1);

            // Calculate actual number of days in the month (28/29/30/31)
            const daysInMonth = getColumnsForView(view, startDate);

            for (let i = 0; i < daysInMonth; i++) {
                const date = new Date(monthStart);
                date.setDate(date.getDate() + i);
                dates.push(date);
            }
            break;
    }

    return dates;
};

export const formatTime = (hour: number, minute: number = 0): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
};

export const getScreenSize = (width: number): string => {
    if (width < 375) return 'xs';      // Extra small (< 375px)
    if (width < 576) return 'sm';      // Small (375px - 576px)
    if (width < 798) return 'md';      // Medium (576px - 798px)
    if (width < 992) return 'lg';      // Large (798px - 992px)
    if (width < 1200) return 'xl';     // Extra large (992px - 1200px)
    if (width < 1600) return 'xxl';    // 2XL (1200px - 1600px)
    return '3xl';                       // 3XL (> 1600px)
};

/**
 * Get the optimal cell min-width based on screen size and view type
 * @param view - The current view type (day, week, month)
 * @param screenWidth - The current screen width in pixels
 * @returns The min-width value as a string (e.g., "20px") or undefined for day view
 */
export const getCellMinWidth = (view: ViewType, screenWidth: number): string | undefined => {
    // Day view uses flexible width
    if (view === 'day') {
        return undefined;
    }

    // Week/Month views use responsive min-width based on screen size
    const screenSize = getScreenSize(screenWidth);

    switch (screenSize) {
        case 'xs':
            return '6px';   // Extra small devices (< 375px)
        case 'sm':
            return '8px';   // Small devices (375px - 576px)
        case 'md':
            return '12px';  // Medium devices (576px - 798px)
        case 'lg':
            return '18px';  // Large devices (798px - 992px)
        case 'xl':
            return '22px';  // Extra large devices (992px - 1200px)
        case 'xxl':
            return '26px';  // 2XL devices (1200px - 1600px)
        case '3xl':
            return '30px';  // 3XL devices (> 1600px)
        default:
            return '20px';  // Fallback
    }
};