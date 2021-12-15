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

  constructor() {
    super();
    this.addHandlerShowWindow();
    this.addHandlerHideWindow();
  }

  toggleWindow() {
    this.overlayEl.classList.toggle('hidden');
    this.windowEl.classList.toggle('hidden');
  }

  addHandlerShowWindow() {
    this.btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerHideWindow() {
    this.btnClose.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this.parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      if (!data) return;

      handler(data);
    });
  }

  generateMarkup() {}
}
export default new AddRecipeView();
