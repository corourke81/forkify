import 'core-js/stable';
import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { getJSON, sendJSON } from './helpers.js';

// state stores the essential data,
// namely recipe details, search data and bookmarks
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE, // after query, number of recipes displayed per page
    page: 1,
  },
  bookmarks: [],
};

// Takes in data (from recipe API or recipe form) and returns recipe object
const createRecipeObject = function (data) {
  let { recipe } = data.data; // ALT: recipe = data.data.recipe;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // For recipes in API, there is no key.
    // So check if there is a key, then add value of object
    ...(recipe.key && { key: recipe.key }),
  };
};

// Loads recipe to state through id, returns recipe
export const loadRecipe = async function (id) {
  try {
    // JSON from API
    const data = await getJSON(`${API_URL}${id}?key=${KEY}`);

    // recipe object is stored in state
    state.recipe = createRecipeObject(data);

    // if id of recipe matches that of any recipes bookmarked,
    // mark recipe as bookmarked
    if (state.bookmarks.some(rec => rec.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    return state.recipe;
  } catch (err) {
    throw err;
  }
};

// Takes food query (user input), loads search results to state and returns them
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    // JSON from API matching query
    const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);

    // Creates results array based on query
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        publisher: rec.publisher,
        title: rec.title,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    // Search page is reset to first page
    state.search.page = 1;

    return state.search.results;
  } catch (err) {
    throw err;
  }
};

// Returns items from results array, depending on page (optional input)
export const getSearchResultsPage = function (page = state.search.page) {
  return state.search.results.slice(
    (page - 1) * state.search.resultsPerPage,
    page * state.search.resultsPerPage
  );
};

// Updates ingredient quantities based on existing serving and new serving (input)
// Updates existing serving to new serving so function can be correctly reused
export const updateServings = function (numServings) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = (ing.quantity * numServings) / state.recipe.servings)
  );

  state.recipe.servings = numServings;
};

// Retains bookmarks if user logs off
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// Adds recipe to bookmarks
export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  // Recipe in state may need to be updated, for future functionality
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // To delete bookmark, find index of recipe with that id
  const index = state.bookmarks.findIndex(rec => id === rec.id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

// When ran, retrieves storage items from local storage
// and if any exist, resets the JSON of storage as state.bookmarks
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

// For development
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// Uploads the user's own new recipe, an object
export const uploadRecipe = async function (newRecipe) {
  try {
    // Up to 6 ingredients, key value pairs, filter based on key including 'ingredient' and value not being empty.
    // Then each value should contain 3 items separated by commas
    // Otherwise an error (the user is notified of this)
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].includes('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3) throw new Error();
        const [quantity, unit, description] = ingArr;
        return {
          // If quantity is a truthy, convert to a number
          // BUG: quantity = "bug", returns NaN
          quantity: quantity ? Number(quantity) : null,
          unit,
          description,
        };
      });

    // recipe key values must match those of the API
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: newRecipe.cookingTime,
      servings: newRecipe.servings,
      // key ingredients: value is the ingredients array calculated above
      ingredients: ingredients,
    };

    // Recipe is uploaded to the user's API (KEY), then stored in state
    const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    // Recipe is (automatically) bookmarked
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
