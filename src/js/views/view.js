import icons from '../../img/icons.svg';

export default class View {
  data;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this.data = data;
    const markup = this.generateMarkup();
    this.clear();
    this.parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this.data = data;
    const newMarkup = this.generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this.parentEl.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderSpinner() {
    const markup = `<div class="spinner">
    <svg>
    <use href="${icons}#icon-loader"></use>
    </svg>
    </div>`;
    this.clear();
    this.parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  clear() {
    this.parentEl.innerHTML = '';
  }

  renderError() {
    const markup = `<div class="error">
    <div>
        <svg>
        <use href="${icons}#icon-smile"></use>
        </svg>
    </div>
    <p>${this.errorMessage}</p>
  </div>`;
    this.clear();
    this.parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this.successMessage) {
    const markup = `<div class="message">
    <div>
      <svg>
        <use href="src/img/icons.svg#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this.clear();
    this.parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}
