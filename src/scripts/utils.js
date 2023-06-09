// Add event listener
export function onEvent(event, selector, callback) {
    return selector.addEventListener(event, callback);
}  
  
// Get HTML element by id
export function getElement(selector, parent = document) {
    return parent.getElementById(selector);
}

// Select HTML element
export function select(selector, parent = document) {
    return parent.querySelector(selector);
}

// Get a (node) list of HTML elements as array
export function selectAll(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
}

// Print
export function print(...arg) {
    console.log(arg);
}

// Sleep
export function sleep(duration) {
    return new Promise(resolve => {
        setTimeout(resolve, duration)
    });
}

// Generate random number between - and including - 'min' and 'max'
export function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Filter array
export function filterArray(array, callback) {
    return array.filter(callback);
}

// Create an HTML element
export function create(element, parent = document) {
    return parent.createElement(element);
}