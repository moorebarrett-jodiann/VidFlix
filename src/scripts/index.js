'use-strict';

import {select, print, onEvent } from './utils.js';
import cityInfo from './cities.js';

const cityList = select('section .main-container .filter-container .search-container input[type="text"]');
const cityUrl = "./src/scripts/cities.json";

const movieTitleList = select('section .main-container .filter-container .title-search');
const movieTitleUrl = "./src/scripts/movie-titles.json";

const movieList = select('.movie-grid');
const autocompleteResults = select('.autocomplete-results');
const movieImgUrl = 'https://github.com/mrspecht/media/blob/main/img/avengers-infinity-war.jpg';
const movies = [];


// setup options
const options = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json; charset=UTF-8'
    },
    mode: 'cors'
};

// populate movie poster grid
function listMovies(imgArray) {
    movieList.innerHTML = "";
    let movies = "";

    if(imgArray.length > 0) {
        for(let i = 0; i < imgArray.length; i++) {
            movies += `
            <div class="movie-card">
                <img class="movie-img" src="${imgArray[i]}" alt="">
                <p class="title"></p>
            </div>
            `;
        }
    }
    else {
        movies += `<div>Movies not found</div>`;
    }

    movieList.innerHTML = `${movies}`;
}

// reusable method to fetch from json source
async function getArray(url) {
    try {
        const response = await fetch(url, options);

        if(!response.ok) {
            throw new Error(`${response.statusText} (${response.status})`);
        }

        const data = await response.json();
        print(data);
        return data;
    }
    catch(error) {
        print(error.Message);
        return []
    }
}

// Fetch the movie titles from the JSON file and populate an array to be used for autocomplete
function populateAutoCompleteMovieSearch() {
    return fetch(movieTitleUrl)
        .then(response => response.json())
        .then(data => {
            movies.push(...data.titles.map(movie => movie.title));
        })
        .catch(error => {
            console.error('Error fetching movie titles:', error);
        });
}

// Function to filter and display autocomplete suggestions
function showAutocompleteSuggestions(input) {
    const inputValue = input.value.toLowerCase();    
    const autocompleteSuggestions = movies.filter(title => title.toLowerCase().includes(inputValue));
    
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
        
        autocompleteResults.appendChild(suggestionItem);
    });
}
  
// Function to clear autocomplete suggestions
function clearAutocompleteSuggestions() {
    while (autocompleteResults.firstChild) {
        autocompleteResults.removeChild(autocompleteResults.firstChild);
    }
}

// Bind the 'keyup' event to the input field
populateAutoCompleteMovieSearch().then(() => {
    onEvent('keyup', movieTitleList, () => {
        const input = movieTitleList;
        showAutocompleteSuggestions(input);

        // Check if input is empty and call clearAutocompleteSuggestions
        if (input.value === '') {
            clearAutocompleteSuggestions();
        }
    });
});

// if any area outside the movie title search box is clicked, close the suggestions
document.addEventListener('click', function(event) {
    if (event.target !== movieTitleList) {
        clearAutocompleteSuggestions();
    }
});