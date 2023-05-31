<h1 align="center" style="color:#be236a">VidFlix</h1>

### Table of contents
- :movie_camera: [Demo](https://moorebarrett-jodiann.github.io/VidFlix/) :movie_camera:
- [Description](#description)
- [Functionalities](#functionalities)
- [Fetch API](#fetch-api)

### Description

Simple, mobile-first video streaming website, built using the following technologies:
- HTML
- CSS
- EcmaScript (ES)
- [ES Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

![VidFlix](./src/images/screenshots/home.jpeg?raw=true "VidFlix")

### Functionalities

There are a few interactive features of the web page:

#### :label: Search Movie Title

On the main page, there are 2 search fields. To search by movie title simply enter the name of the movie you wish to filter by. The search entry is not case sensitive, and it highlights the matching sequence of letters entered to allow the user a flexible search experience. 

A list of movie titles will be visibly filtered as you type to show you what is available. 

###### Note: The movie posters do not yet have a filter feature.

#### :label: Search City

To search by city, follow the same pattern as the movie title search field. The list of cities currently populated are in Canada, and by default, the search list is set to `Winnipeg`.

#### :label: Responsive Navigation

When the browser is resized to fit tablet or mobile dimensions, the horizontal navigation options are toggled to reveal a burger icon. 

#### :label: Responsive Page Content

When the browser is resized to fit tablet or mobile dimensions, the main content adjusts to grid column fractions from 1 to 6.

### Fetch API

[(Back to top)](#table-of-contents)

The Fetch API provides a generic definition of ```Request``` and ```Response```
objects (and other things involved with network requests). It also defines
related concepts such as CORS and the HTTP Origin header semantics, supplanting
their separate definitions elsewhere. Fetch returns a ```Promise```, an object
represents the eventual completion (or failure) of an asynchronous operation
and its resulting value.

#### :label: Asynchronous functions

The magic of ```async``` functions is that we can write asynchronous code that
looks like synchronous code. It's still asynchronous code but instead of
results and errors landing inside callback functions, errors are thrown
naturally as exceptions and results naturally land on the next line of code.

The key features of ```async``` functions are:

- ```async``` functions implicitly create and return promises.
- In an ```async``` function, ```await``` consumes promises, marking a point
  where the code will wait asynchronously for the promise to settle.
- While the function is waiting for the promisse to settle, the thread can run
  other code.
- Exceptions are rejections, and rejections are exceptions; returns are
  resolutions, and fulfillments are results (that is, if you ```await``` a
  promise, you see the promise's fulfillment value as the result of the ```await```
  expression).

#### :label: Fetch API in action

The simplest use of ```fetch()``` takes one argument - the path to the resource
you want to fetch - and does not directly return the JSON response body but
instead returns a ```Promise``` that resolves with a ```Response``` object.

The ```Response``` object, in turn, does not directly contain the actual JSON
response body but is instead a representation of the entire HTTP response. So,
to extract the JSON body content from the ```Response``` object, we use the
```json()``` method, which returns a second promise that resolves with the
result of parsing the response body text as JSON.

```javascript
// fetch movies and cities from their json files and use the data to populate the filter lists
const citiesUrl = "./src/scripts/cities.json";
const moviesUrl = "./src/scripts/movie-titles.json";
const movieTitles = [];
const cities = [];

const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    },
    mode: 'cors'
};

// Fetch the movie titles from the JSON file and populate an array to be used for autocomplete
async function populateAutoCompleteMovieSearchList() {
    try {
        const response = await fetch(moviesUrl, options);
        if (!response.ok) {
            throw new Error(`${response.statusText} (${response.status})`);
        }
        const data = await response.json();
        movieTitles.push(...data.movies.map(movie => movie.title));
    } catch (error) {
        console.error('Error fetching movie titles:', error);
    }
}

// Fetch the cities from the JSON file and populate an array to be used for autocomplete
async function populateAutoCompleteCitySearchList() {
    try {
        const response = await fetch(citiesUrl, options);
        if (!response.ok) {
            throw new Error(`${response.statusText} (${response.status})`);
        }
        const data = await response.json();
        cities.push(...data.cities.map(city => city.name));
    } catch (error) {
        console.error('Error fetching cities:', error);
    }
}

// Load the movie autocomplete search lists and then invoke the keyup bindings
populateAutoCompleteMovieSearchList().then(() => {
    onEvent('keyup', movieSearchInput, () => {
        const input = movieSearchInput;
        showAutocompleteSuggestions(input);

        // Check if input is empty and call clearAutocompleteSuggestions
        if (input.value === '') {
            clearAutocompleteSuggestions();
        }
    });
});

// Load the city autocomplete search lists and then invoke the keyup bindings
populateAutoCompleteCitySearchList().then(() => {
    onEvent('keyup', citySearchInput, () => {
        const input = citySearchInput;
        showAutocompleteSuggestions(input);

        // Check if input is empty and call clearAutocompleteSuggestions
        if (input.value === '') {
            clearAutocompleteSuggestions();
        }
    });
});
```

#### References

- [JavaScript cookbook](https://www.oreilly.com/library/view/javascript-cookbook-3rd/9781492055747/)
- [JavaScript: the new toys](https://www.wiley.com/en-us/JavaScript:+The+New+Toys-p-9781119367963)
- [Professional JavaScript for web developers](https://www.wiley.com/en-us/Professional+JavaScript+for+Web+Developers%2C+4th+Edition-p-9781119366447)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)

