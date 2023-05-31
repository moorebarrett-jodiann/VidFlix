'use-strict';

import {select, print, onEvent } from './utils.js';
import cityInfo from './cities.json' assert { type: "json" };;
import movieInfo from './movie-titles.json' assert { type: "json" };

const citySearchInput = select('section .main-container .filter-container .search-container input[type="text"]');
const citiesUrl = "./src/scripts/cities.json";

const movieSearchInput = select('section .main-container .filter-container .title-search');
const moviesUrl = "./src/scripts/movie-titles.json";

const movieList = select('.movie-grid');
const movieAutocompleteResults = select('.autocomplete-results');

const movieTitles = [];
const movieImages = [];
const cities = [];

// setup options
const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    },
    mode: 'cors'
};

// populate movie poster grid
function printMovies() {
    fetch(moviesUrl)
      .then(response => response.json())
      .then(data => {
        movieList.innerHTML = "";
        let movieCard = "";
  
        if (data.movies.length > 0) {
          data.movies.forEach(movie => {
            movieCard += `
              <div class="movie-card">
                <img class="movie-img" src="${movie.image}" alt="${movie.title}">
                <p class="title">${movie.title}</p>
              </div>
            `;
          });
        } else {
          movieCard += `<div>Movies not found</div>`;
        }
  
        movieList.innerHTML = movieCard;
      })
      .catch(error => {
        console.error('Error fetching movie titles:', error);
      });
  }

// reusable method to fetch from json source
// async function getArray(url) {
//     try {
//         const response = await fetch(url, options);

//         if(!response.ok) {
//             throw new Error(`${response.statusText} (${response.status})`);
//         }

//         const data = await response.json();
//         console.log(data);
//         return data;
//     }
//     catch(error) {
//         print(error.Message);
//         return []
//     }
// }

// // fetch movie posters and populate grid
printMovies();

// Fetch the movie titles from the JSON file and populate an array to be used for autocomplete
function populateAutoCompleteMovieSearchList() {
    return fetch(moviesUrl)
        .then(response => response.json())
        .then(data => {
            movieTitles.push(...data.movies.map(movie => movie.title));
        })
        .catch(error => {
            console.error('Error fetching movie titles:', error);
        });
}

// Function to filter and display autocomplete suggestions
function showAutocompleteSuggestions(input) {
    const inputValue = input.value.toLowerCase();    
    const autocompleteSuggestions = movieTitles.filter(title => title.toLowerCase().includes(inputValue));
    
    // Clear previous suggestions
    clearAutocompleteSuggestions();

    // Render new autocomplete suggestions
    autocompleteSuggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('autocomplete-item');
        suggestionItem.textContent = suggestion;
        
        // set text of clicked suggestion to input field
        suggestionItem.addEventListener('click', () => {
            input.value = suggestion;
            clearAutocompleteSuggestions();
        });
        
        movieAutocompleteResults.appendChild(suggestionItem);
    });
}
  
// Function to clear autocomplete suggestions
function clearAutocompleteSuggestions() {
    while (movieAutocompleteResults.firstChild) {
        movieAutocompleteResults.removeChild(movieAutocompleteResults.firstChild);
    }
}

// Load the autocomplete search lists and then invoke the keyup bindings
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

// if any area outside the movie title search box is clicked, close the suggestions
document.addEventListener('click', function(event) {
    if (event.target !== movieSearchInput) {
        clearAutocompleteSuggestions();
    }
});