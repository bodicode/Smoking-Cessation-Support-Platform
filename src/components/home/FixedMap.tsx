"use client";

import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./Map"), {
    ssr: false,
});

export default function FixedMap() {
    return (
        <div>
            <LeafletMap />
        </div>
    );
}
