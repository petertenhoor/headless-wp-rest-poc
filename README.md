# headless-wp-rest-poc
Proof of concept for headless WordPress using the REST API, Redis caching layer and next.js.

## To do

- Add SSR caching for frontend.
- add Redis caching layer between frontend and WordPress.
- Add a cache clear mechanism in WordPress.
- Create benchmarks.

## In Progress

- Set up basic authentication for WP Rest endpoints.

## Done

- Scaffold WordPress environment with some pages / posts / a menu.
- Add simple WordPress REST Routes to supply the data the frontend needs.
- Scaffold Next.js frontend

## Nice to have's

- Find out a good way to map (Visual Composer) shortcodes to React components
- See how to handle SEO (meta, sitemap etc)
- Add a 404 page

## Routes

### GET {WP_URL}/wp-json/pth/v1/frontpage

Example result:

```
{
    "id": 11,
    "title": "Homepage",
    "content": "Welcome to the homepage."
}
```

### GET {WP_URL}/wp-json/pth/v1/navigation

Example result:

```
{
    "items": [
        {
            "id": 27,
            "label": "Home",
            "href": "/",
            "as": "/"
        },
        {
            "id": 33,
            "label": "Posts",
            "href": "/posts",
            "as": "/posts"
        },
        {
            "id": 28,
            "label": "About",
            "href": "/page?slug=about",
            "as": "/about"
        },
        {
            "id": 29,
            "label": "Contact",
            "href": "/page?slug=contact",
            "as": "/contact"
        },
        {
            "id": 34,
            "label": "Pink moon",
            "href": "/post?slug=pink-moon",
            "as": "/post/pink-moon"
        }
    ]
}
```