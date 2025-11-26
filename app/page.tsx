"use client";

import { Scheduler } from "@/components/scheduler/Scheduler";
import { Facility } from "@/lib/scheduler/types";
import "@/styles/scheduler.css";

const sampleFacilities: Facility[] = [
  {
    id: "venue-1",
    name: "Main Sports Complex",
    type: "venue",
    isExpanded: true,
    children: [
      {
        id: "cat-1",
        name: "Indoor Facilities",
        type: "category",
        parentId: "venue-1",
        isExpanded: true,
        children: [
          { id: "fac-1", name: "Basketball Court 1", type: "facility", parentId: "cat-1" },
          { id: "fac-2", name: "Basketball Court 2 asasas ewfrc weewf  werew", type: "facility", parentId: "cat-1" },
          { id: "fac-3", name: "Volleyball Court", type: "facility", parentId: "cat-1" },
        ],
      },
      {
        id: "cat-2",
        name: "Outdoor Facilities",
        type: "category",
        parentId: "venue-1",
        isExpanded: false,
        children: [
          { id: "fac-4", name: "Tennis Court 1", type: "facility", parentId: "cat-2" },
          { id: "fac-5", name: "Tennis Court 2", type: "facility", parentId: "cat-2" },
          { id: "fac-6", name: "Soccer Field", type: "facility", parentId: "cat-2" },
        ],
      },
    ],
  },
  {
    id: "venue-2",
    name: "Community Center",
    type: "venue",
    isExpanded: false,
    children: [
      {
        id: "cat-3",
        name: "Meeting Rooms",
        type: "category",
        parentId: "venue-2",
        isExpanded: false,
        children: [
          { id: "fac-7", name: "Conference Room A", type: "facility", parentId: "cat-3" },
          { id: "fac-8", name: "Conference Room B", type: "facility", parentId: "cat-3" },
        ],
      },
    ],
  },
];

export default function Home() {
  return (
    <main>
      <Scheduler initialFacilities={sampleFacilities} />
    </main>
  );
}
