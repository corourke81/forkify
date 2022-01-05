import View from './view.js';
import icons from '../../img/icons.svg';

export default class previewView extends View {
  // Takes data from View, and returns list of recipe items with image,
  // title, publisher.
  // If recipe id matches that of page, highlight that item.
  // If recipe key exists, mark recipe as user's own recipe.
  generateMarkup() {
    const id = window.location.hash.slice(1);

    return this.data
      .map(
        rec => `
              <li class="preview">
                <a class="preview__link ${
                  rec.id === id ? 'preview__link--active' : ''
                }" href="#${rec.id}">
                  <figure class="preview__fig">
                    <img src="${rec.image}" alt="${rec.title}" />
                  </figure>
                  <div class="preview__data">
                    <h4 class="preview__title">${rec.title}</h4>
                    <p class="preview__publisher">${rec.publisher}</p>
                    <div class="preview__user-generated ${
                      rec.key ? '' : 'hidden'
                    }">
                    <svg>
                        <use href="${icons}#icon-user"></use>
                    </svg>
                  </div>
                  </div>
                </a>
              </li>
            `
      )
      .join('');
  }
}
