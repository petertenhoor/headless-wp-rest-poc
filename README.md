# headless-wp-rest-poc
Proof of concept for headless WordPress using the REST API, Redis caching layer and next.js.

## To do

- add Redis caching layer between frontend and WordPress.
- Add a cache clear mechanism in WordPress.
- Create cache warmer script which fires after cached is cleared
- Create benchmarks.

## In Progress
- add Redis caching layer between frontend and WordPress.

## Done

- Scaffold WordPress environment with some pages / posts / a menu.
- Add simple WordPress REST Routes to supply the data the frontend needs.
- Scaffold Next.js frontend
- Set up CORS for WP Rest endpoints to only accept requests from frontend origin.
- Add SSR caching with Redis in frontend.

## Nice to have's

- Find out a good way to map (Visual Composer) shortcodes to React components
- Find out a good way to handle SEO (meta, robots.txt, sitemap.xml etc)
- Find out a good way to handle forms
- Add a 404 page
- Make this project a PWA