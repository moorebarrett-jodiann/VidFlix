'use-strict';

import {select, print, onEvent } from './utils.js';
import cityInfo from './cities.js';
import movieInfo from './movie-titles.js';

// ======== VARIABLES =====================================================================================================
const citySearchInput = select('section .main-container .filter-container .city-search-container .city-search');
const citiesUrl = "./src/scripts/cities.json";

const movieSearchInput = select('section .main-container .filter-container .title-search');
const moviesUrl = "./src/scripts/movie-titles.json";

const movieList = select('.movie-grid');
const movieAutocompleteResults = select('section .main-container .filter-container .autocomplete-movies .autocomplete-results');
const cityAutocompleteResults = select('section .main-container .filter-container .autocomplete-cities .autocomplete-results');

const movieTitles = [];
const cities = [];

// setup options
const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    },
    mode: 'cors'
};

// ======== FUNCTIONS =====================================================================================================

// populate movie poster grid
function printMovies() {
    fetch(moviesUrl, options)
        .then(response => response.json())
        .then(data => {
        movieList.innerHTML = "";
        let movieCard = "";

        if (data.movies.length > 0) {
            data.movies.forEach(movie => {

                const categories = movie.categories.map(category => `<span class="genre">${category}</span>`).join('');
                
                movieCard += `
                <div class="movie-card">
                    <div class="overlay">
                        <div class="info">
                            <p class="year">${movie.year}</p>
                            <p class="category">${categories}</p>
                        </div>
                    </div>
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

// Fetch the movie titles from the JSON file and populate an array to be used for autocomplete
function populateAutoCompleteMovieSearchList() {
    return fetch(moviesUrl, options)
        .then(response => response.json())
        .then(data => {
            movieTitles.push(...data.movies.map(movie => movie.title));
        })
        .catch(error => {
            console.error('Error fetching movie titles:', error);
        });
}

// Fetch the cities from the JSON file and populate an array to be used for autocomplete
function populateAutoCompleteCitySearchList() {
    return fetch(citiesUrl, options)
        .then(response => response.json())
        .then(data => {
            cities.push(...data.cities.map(city => city.name));
        })
        .catch(error => {
            console.error('Error fetching cities:', error);
        });
}

// Function to filter and display autocomplete suggestions
function showAutocompleteSuggestions(input) {
    const inputValue = input.value.toLowerCase(); 
    let autocompleteSuggestions = "";
    
    // filter suggestions to those that include the sequence of characters entered
    if(input === movieSearchInput) {
        autocompleteSuggestions = movieTitles.filter(title => title.toLowerCase().includes(inputValue));
    } else {
        autocompleteSuggestions = cities.filter(name => name.toLowerCase().includes(inputValue));
    }    
    
    // Clear previous suggestions
    clearAutocompleteSuggestions();

    // if user input is not found add a "Not found" item
    if (autocompleteSuggestions.length === 0) {

        // Add a default "Movie not found" or "City not found" suggestion
        const notFoundSuggestion = document.createElement('div');
        notFoundSuggestion.classList.add('autocomplete-item', 'not-found');
        notFoundSuggestion.textContent = input === movieSearchInput ? 'Movie not found' : 'City not found';
        
        if (input === movieSearchInput) {
          movieAutocompleteResults.appendChild(notFoundSuggestion);
        } else {
          cityAutocompleteResults.appendChild(notFoundSuggestion);
        }

    } else {
    
        // Render new autocomplete suggestions
        autocompleteSuggestions.forEach(suggestion => {
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('autocomplete-item');
            suggestionItem.textContent = suggestion;

            // Create a new string with matching characters wrapped in a <span> tag with class "match"
            // RegExp flags 'g' is for 'global(all occurences)' and 'i' stands for case-insensitive
            const highlightedSuggestion = suggestion.replace(new RegExp(inputValue, 'gi'), match => `<span class="match">${match}</span>`);
            suggestionItem.innerHTML = highlightedSuggestion;
            
            // set text of clicked suggestion to input field
            suggestionItem.addEventListener('click', () => {
                input.value = suggestion;
                clearAutocompleteSuggestions();
            });
            
            if(input === movieSearchInput) {
                movieAutocompleteResults.appendChild(suggestionItem);
            } else {
                cityAutocompleteResults.appendChild(suggestionItem);
            }
        });
    }
}

// Function to clear all autocomplete suggestions if there is a list visible
function clearAutocompleteSuggestions() {
    while (movieAutocompleteResults.firstChild) {
        movieAutocompleteResults.removeChild(movieAutocompleteResults.firstChild);
    }    
    while (cityAutocompleteResults.firstChild) {
        cityAutocompleteResults.removeChild(cityAutocompleteResults.firstChild);
    }
}

// ======== FUNCTION CALLS ===============================================================================================

// fetch movie posters and populate grid
printMovies();

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

// if any area outside the movie title search box is clicked, close the suggestions
document.addEventListener('click', function(event) {
    if (event.target !== movieSearchInput && event.target !== citySearchInput) {
        clearAutocompleteSuggestions();
    }
});

// manually load default city
window.onload = function () {
    citySearchInput.value = "Winnipeg";
};