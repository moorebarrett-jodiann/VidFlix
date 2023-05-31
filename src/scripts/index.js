'use-strict';

import {select, print } from './utils.js';
import cityInfo from './cities.js';

const cityList = select('section .main-container .filter-container .search-container input[type="text"]');
const cityUrl = "./src/scripts/cities.json";

const movieTitleList = select('section .main-container .filter-container .title-search');
const movieTitleUrl = "./src/scripts/movie-titles.json";

const movieList = select('.movie-grid');
const movieImgUrl = 'https://github.com/mrspecht/media/blob/main/img/avengers-infinity-war.jpg';

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

listMovies(getArray(movieImgUrl));