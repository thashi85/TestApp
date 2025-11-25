import { useState, useEffect, useRef, useCallback } from 'react';
import { ViewType, TimeInterval, Facility, Booking, RowHeights } from './types';

export const useScheduler = (initialFacilities: Facility[]) => {
    const [view, setView] = useState<ViewType>('week');
    const [timeInterval, setTimeInterval] = useState<TimeInterval>(60);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
    const [bookings, setBookings] = useState<Booking[]>([]);

    const toggleFacility = (facilityId: string) => {
        const toggle = (items: Facility[]): Facility[] => {
            return items.map(item => {
                if (item.id === facilityId) {
                    return { ...item, isExpanded: !item.isExpanded };
                }
                if (item.children) {
                    return { ...item, children: toggle(item.children) };
                }
                return item;
            });
        };

        setFacilities(toggle(facilities));
    };

    const addBooking = (booking: Booking) => {
        setBookings([...bookings, booking]);
    };

    const updateBooking = (bookingId: string, updates: Partial<Booking>) => {
        setBookings(bookings.map(b =>
            b.id === bookingId ? { ...b, ...updates } : b
        ));
    };

    const deleteBooking = (bookingId: string) => {
        setBookings(bookings.filter(b => b.id !== bookingId));
    };

    return {
        view,
        setView,
        timeInterval,
        setTimeInterval,
        startDate,
        setStartDate,
        facilities,
        toggleFacility,
        bookings,
        addBooking,
        updateBooking,
        deleteBooking
    };
};

export const useResponsive = () => {
    const [screenSize, setScreenSize] = useState<string>('lg');
    const [screenWidth, setScreenWidth] = useState<number>(0);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setScreenWidth(width);

            if (width < 576) setScreenSize('xs');
            else if (width < 768) setScreenSize('sm');
            else if (width < 992) setScreenSize('md');
            else if (width < 1200) setScreenSize('lg');
            else setScreenSize('xl');
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return { screenSize, screenWidth };
};



export const useRowHeights = (facilities: Facility[]) => {
    const [rowHeights, setRowHeights] = useState<RowHeights>({});
    const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    const registerRow = useCallback((facilityId: string, element: HTMLDivElement | null) => {
        if (element) {
            rowRefs.current.set(facilityId, element);
        } else {
            rowRefs.current.delete(facilityId);
        }
    }, []);

    const updateRowHeights = useCallback(() => {
        const newHeights: RowHeights = {};
        rowRefs.current.forEach((element, facilityId) => {
            if (element) {
                newHeights[facilityId] = element.offsetHeight;
            }
        });
        setRowHeights(newHeights);
    }, []);

    useEffect(() => {
        // Update heights initially and on facility changes
        updateRowHeights();

        // Create ResizeObserver to watch for height changes
        const resizeObserver = new ResizeObserver(() => {
            updateRowHeights();
        });

        // Observe all registered rows
        rowRefs.current.forEach((element) => {
            if (element) {
                resizeObserver.observe(element);
            }
        });

        return () => {
            resizeObserver.disconnect();
        };
    }, [facilities, updateRowHeights]);

    return { rowHeights, registerRow, updateRowHeights };
};