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
    if (width < 576) return 'xs';
    if (width < 768) return 'sm';
    if (width < 992) return 'md';
    if (width < 1200) return 'lg';
    return 'xl';
};