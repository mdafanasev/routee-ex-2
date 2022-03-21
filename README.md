

# Test excersice #2 for Routee

This is a test excersice for a front-end assessment in Routee

## Original requirements
Create a single page application, which works with Google api. (https://serpapi.com/search-api )

- You are free to use a javascript framework you feel most comfortable with. Although, an angular framework would be preferred.
- There should be a navigation menu with 2 items: https://serpapi.com/, News.
- In the first screen, “Home”, there should be a search field with the ability to search for the desired information.
- In the “News” page, there should be tiles with the latest news.
- The code behind these pages should be as close as it could be to production quality code.
- It is expected that an adequate number of unit tests are implemented.

## How to run

1. Clone the repo
2. Get api key from [https://serpapi.com/](https://serpapi.com/)
3. Put the key to `.env` file: `echo "SERPAPI_KEY=<api_key>" > .env`
4. Install dependencies: `npm install`
5. Run the app: `npm start`
6. Go to [http://localhost:4200](http://localhost:4200) in your browser

## Testing

To run unit tests just use `npm run test`;
## Technical desicions

### Back-end app
I decided to implement back-end app mainly for security reasons. We have no possibility to keep API key safety on the front-end part.
Back-end app is implemented as simple Nest.js application which just proxies requests to SerpAPI

### NX
I use NX to bootstrap app fast, it provides all nessesary tooling: formatting, linters, tests and so on. Also it has a good support for Angular and Nest.js

## What can be improved

### Extract common code from `home` and `news` modules

These modules looks pretty similar, it seems a good idea to extract common functionality to some abstract services and components.
But without understanding nearest future of this application (is it would be real app) it can be wrong way.
Such decision can produce extra fragility of the application architucture and make independant changes in modules very hard.