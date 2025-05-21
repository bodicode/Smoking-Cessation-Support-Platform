import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    locales: ["en", "vi",],

    defaultLocale: "vi",
    pathnames: {
        "/about": {
            en: "/about-us",
            vi: "/ve-chung-toi",
        },
    },
});

export type Locale = (typeof routing.locales)[number];