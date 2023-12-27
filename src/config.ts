// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = "ABayoumy Blog.";
export const SITE_DESCRIPTION =
  "Ahmed Bayoumy blog!";
export const TWITTER_HANDLE = "@abayoumy78";
export const MY_NAME = "Ahmed Bayoumy";

// setup in astro.config.mjs
const BASE_URL = new URL(import.meta.env.SITE);
export const SITE_URL = BASE_URL.origin;
