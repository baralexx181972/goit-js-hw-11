import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import { smoothScrollDown } from '../index';

axios.defaults.baseURL = 'https://pixabay.com';
let page = 1;
let currentQuery = '';

export async function getImage(query) {
  try {
    if (currentQuery !== query) {
      page = 1;
    }

    currentQuery = query;
    const response = await axios.get('/api/', {
      params: {
        key: '28535896-0502a7d2e6e12f629e69f1f48',
        q: currentQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page,
        per_page: 40,
      },
    });

    const totalHits = response.data.totalHits;

    if (totalHits > 0) {
      if (page === 1) {
        successAlert(totalHits);
      }
      page += 1;

      return {
        images: response.data.hits,
        page,
      };
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log(error);

    if (error.response) {
      if (error.response.status === 400) {
        document.body.insertAdjacentHTML(
          'beforeend',
          `<div class="wrapper-the-end">
          <p class="the-end">This is the end. Try another query.</p>
        </div>`
        );
        smoothScrollDown();
      }
    } else {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  }
}

function successAlert(hits) {
  Notify.success(`Hooray! We found ${hits} images.`);
}
