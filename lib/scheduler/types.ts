export type ViewType = 'day' | 'week' | 'month';
export type TimeInterval = 10 | 15 | 30 | 60;
export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface Facility {
    id: string;
    name: string;
    type: 'venue' | 'category' | 'facility';
    parentId?: string;
    children?: Facility[];
    isExpanded?: boolean;

    //diaply purpose
    level?: number;
}

export interface Booking {
    id: string;
    facilityId: string;
    startTime: Date;
    endTime: Date;
    title: string;
    color?: string;
}

export interface SchedulerConfig {
    view: ViewType;
    timeInterval: TimeInterval;
    startDate: Date;
    facilities: Facility[];
    bookings: Booking[];
}

export interface CellPosition {
    facilityId: string;
    date: Date;
    hour: number;
    minute?: number;
}
export interface RowHeights {
    [facilityId: string]: number;
}