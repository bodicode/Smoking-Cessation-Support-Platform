import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    locales: ["en", "vi",],

    defaultLocale: "vi",

});

export type Locale = (typeof routing.locales)[number];