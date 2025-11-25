import { ViewType, TimeInterval, Facility } from './types';

export const getColumnsForView = (view: ViewType): number => {
    switch (view) {
        case 'day':
            return 1;
        case 'week':
            return 7;
        case 'month':
            return 30; // or dynamic based on month
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

    const traverse = (facility: Facility) => {
        result.push(facility);
        if (facility.isExpanded && facility.children) {
            facility.children.forEach(traverse);
        }
    };

    facilities.forEach(traverse);
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
    const columns = getColumnsForView(view);

    for (let i = 0; i < columns; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        dates.push(date);
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