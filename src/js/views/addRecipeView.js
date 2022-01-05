import icons from '../../img/icons.svg';
import View from './view.js';

class AddRecipeView extends View {
  parentEl = document.querySelector('.upload');
  windowEl = document.querySelector('.add-recipe-window');
  overlayEl = document.querySelector('.overlay');
  btnOpen = document.querySelector('.nav__btn--add-recipe');
  btnClose = document.querySelector('.btn--close-modal');
  errorMessage = 'Wrong ingredient format. Please use the correct format.';
  successMessage = 'Brilliant! Recipe about to upload!';

  // Constuctor is initially called
  constructor() {
    super();
    this.addHandlerShowWindow();
    this.addHandlerHideWindow();
  }

  // Toggles the hidden class
  toggleWindow() {
    this.overlayEl.classList.toggle('hidden');
    this.windowEl.classList.toggle('hidden');
  }

  // When called, listens for the click event which calls toggleWindow,
  // where 'this' is the AddRecipe object
  // Contrast to this.toggleWindow(), 'this' is btnOpen
  addHandlerShowWindow() {
    this.btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerHideWindow() {
    this.btnClose.addEventListener('click', this.toggleWindow.bind(this));
  }

  //
  addHandlerUpload(handler) {
    this.parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      // Convert formData object into a key-value pair array, 'this' is parentEl
      const dataArr = [...new FormData(this)];
      // Convert to object, for handler
      const data = Object.fromEntries(dataArr);
      if (!data) return;

      handler(data);
    });
  }
}
export default new AddRecipeView();
