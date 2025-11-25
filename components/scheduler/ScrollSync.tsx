"use client";

import { useEffect, useRef } from "react";

export const useScrollSync = () => {
  const facilityListRef = useRef<HTMLDivElement>(null);
  const gridRowsRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    const facilityList = facilityListRef.current;
    const gridRows = gridRowsRef.current;

    if (!facilityList || !gridRows) return;

    const syncScroll = (source: HTMLDivElement, target: HTMLDivElement) => {
      if (isScrolling.current) return;
      isScrolling.current = true;
      target.scrollTop = source.scrollTop;
      requestAnimationFrame(() => {
        isScrolling.current = false;
      });
    };

    const handleFacilityScroll = () => syncScroll(facilityList, gridRows);
    const handleGridScroll = () => syncScroll(gridRows, facilityList);

    facilityList.addEventListener("scroll", handleFacilityScroll);
    gridRows.addEventListener("scroll", handleGridScroll);

    return () => {
      facilityList.removeEventListener("scroll", handleFacilityScroll);
      gridRows.removeEventListener("scroll", handleGridScroll);
    };
  }, []);

  return { facilityListRef, gridRowsRef };
};
