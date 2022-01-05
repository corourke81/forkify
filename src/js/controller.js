import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { CLOSE_MODAL_SEC } from './config.js';

import 'regenerator-runtime/runtime';
import 'core-js/stable';

// https://forkify-api.herokuapp.com/v2

// Controls what happens for a hashchange or load event
const controlRecipes = async function () {
  try {
    // The id of the current web page ("after the hash")
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Display spinner while waiting for recipeView to be rendered with data
    recipeView.renderSpinner();

    // resultsView is updated (depends on state.search)
    resultsView.update(model.getSearchResultsPage());

    // Current bookmarks are rendered
    bookmarksView.render(model.state.bookmarks);

    const data = await model.loadRecipe(id);
    // recipeView is rendered with data to match id, if there is no error
    recipeView.render(data);
  } catch (err) {
    // if there is an error, display error message
    recipeView.renderError();
  }
};

// Controls what happens when the user enters a query
const controlSearchResults = async function () {
  try {
    // Display spinner while waiting for resultsView to be rendered with data
    resultsView.renderSpinner();

    const query = searchView.getQuery();

    if (!query) return;

    // Await search results for query
    await model.loadSearchResults(query);
    // Selects search results for a particular page
    const selectedData = model.getSearchResultsPage();
    // Renders recipes for query and page
    resultsView.render(selectedData);
    // Changes page, using model.state.search.page
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

// Controls what happens when pagination buttons are clicked
const controlPagination = function (pageNumber) {
  model.state.search.page = pageNumber;
  const selectedData = model.getSearchResultsPage();
  resultsView.render(selectedData);
  paginationView.render(model.state.search);
};

// Controls what happens when number of servings is changed
const controlServings = function (numServings) {
  // ingredients updated, view then updated
  model.updateServings(numServings);
  recipeView.update(model.state.recipe);
};

// Controls what happens when bookmark icon is clicked (on or off)
const controlBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update bookmark icon
  recipeView.update(model.state.recipe);

  // re-render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

// Controls what happens when a new recipe is added
const controlAddRecipe = async function (newRecipe) {
  try {
    // Render spinner while waiting for modal to appear
    addRecipeView.renderSpinner();

    // New recipe is stored in state, then rendered
    await model.uploadRecipe(newRecipe);
    recipeView.render(model.state.recipe);

    // If recipe has been successfully added, display message
    addRecipeView.renderMessage();

    // Adds id to the browser's session history stack
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Modal and overlay showing. After some time, hide this
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, CLOSE_MODAL_SEC * 1000);

    // UploadRecipe() creates a new bookmark, the added recipe
    bookmarksView.render(model.state.bookmarks);
  } catch (err) {
    addRecipeView.renderError();
  }
};

const init = function () {
  // When an event occurs, the handler arguments control what happens.
  // Publisher-subscriber pattern.
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerAddBookmark(controlBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
