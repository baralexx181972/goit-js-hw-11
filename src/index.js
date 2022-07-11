// 28535896-0502a7d2e6e12f629e69f1f48
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImage } from './js/fetch-img.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
let currentQuery = '';
const lightbox = new SimpleLightbox('.gallery a');

refs.form.addEventListener('submit', searchImg);
refs.loadMoreBtn.addEventListener('click', loadAndRenderImgs);

function searchImg(event) {
  event.preventDefault();
  refs.gallery.innerHTML = '';

  const endOfItems = document.querySelector('.wrapper-the-end');
  if (endOfItems) {
    endOfItems.remove();
  }

  const { searchQuery } = event.target.elements;
  currentQuery = searchQuery.value;
  if (currentQuery) {
    loadAndRenderImgs();
  } else {
    hideLoadMoreBtn();
    Notify.info('Enter a query');
  }
}

function makeImgCard({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
            <div class="photo-card-img-wrapper">
            <a href="${largeImageURL}">
              <img
                class="photo-card-img"
                src="${webformatURL}"
                alt="${tags}"
                loading="lazy"
              />
            </a>
            </div>
              <div class="info">
                <p class="info-item">
                  <span><b>Likes</b></span>
                  <span>${likes}</span>
                </p>
                <p class="info-item">
                  <span><b>Views</b></span>
                  <span>${views}</span>
                </p>
                <p class="info-item">
                  <span><b>Comments</b></span>
                  <span>${comments}</span>
                </p>
                <p class="info-item">
                  <span><b>Downloads</b></span>
                  <span>${downloads}</span>
                </p>
              </div>
            </div>`;
}

function makeGallery(images) {
  refs.gallery.insertAdjacentHTML('beforeend', images);
  lightbox.refresh();
}

function loadAndRenderImgs() {
  const MatchedImages = getImage(currentQuery);

  hideLoadMoreBtn();

  MatchedImages.then(({ images, page }) => {
    if (images) {
      showLoadMoreBtn();
      const galleryMarkup = images.map(img => makeImgCard(img)).join('');
      makeGallery(galleryMarkup);
      if (page > 2) {
        smoothScrollDown();
      }
    } else {
      return;
    }
  }).catch(error => console.log(error));
}

function hideLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('is-hidden');
}

function showLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}

export function smoothScrollDown() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

// scroll to top
const toTopBtn = document.getElementById('myBtn');

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    toTopBtn.style.display = 'block';
    toTopBtn.addEventListener('click', topFunction);
  } else {
    toTopBtn.style.display = 'none';
  }
}

function topFunction() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

// infinite scroll
const options = {
  rootMargin: '200px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && currentQuery) {
      loadAndRenderImgs();
    }
  });
}, options);

observer.observe(document.querySelector('.scroll-guard'));
