import i18n from 'i18next';
import axios from 'axios';
import validate from './validation.js';
import { launchViewer, elements } from './viewer.js';
import ru from './locales/ru.js';
import parse from './parser.js';
import fetchWithTimeout from './fetchWithTimeout.js';

import 'bootstrap';

const app = () => {
  const initialState = {

    process: 'default', // validationFail // rssLoaded // modal window opened

    activePost: '',

    validationProcess: {
      isValid: '',
      data: {
        hrefValue: '',
      },
      error: '',
    },

    postValidationErrors: [],
    feeds: [],

    posts: [],

    validatedUrls: [],
    newPosts: [],

    uiState: {
      displayed: [
      ],
      submitBlocked: false,
    },

  };

  const i18nInstance = i18n.createInstance();

  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  })
    .then(() => {
      const watchedState = launchViewer(initialState);

      const loadRss = (url) => {
        axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
          .then((response) => {
            watchedState.uiState.submitBlocked = false;

            const { contents } = response.data;

            const extractedData = parse(contents, watchedState);

            console.log('data from parse with error', extractedData);

            const { feed, newPosts } = extractedData;

            const { posts } = watchedState;
            watchedState.feeds.push(feed);
            watchedState.posts = [...posts, ...newPosts];

            const addToUiState = (post) => ({
              id: post.id,
              style: 'default',
            });
            watchedState.validatedUrls.push(url);

            watchedState.uiState.displayed = watchedState.posts.map((item) => addToUiState(item));
            watchedState.process = 'rssLoaded';
            watchedState.process = '';
            const { validatedUrls } = watchedState;
            console.log('validatedUrls', Array.isArray(validatedUrls), validatedUrls.length);

            validatedUrls.forEach((urll) => {
              console.log('for each hanging fetchtimeout');
              fetchWithTimeout(urll, watchedState);
            });
          })
          .catch((err) => {
            watchedState.postValidationErrors.push(err.message);
          });
      };

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const value = formData.get('url');

        validate(watchedState, value)

          .then((val) => {
            watchedState.validationProcess.data.hrefValue = val;
            watchedState.uiState.submitBlocked = true;
            loadRss(val);
          })
          .catch((err) => {
            watchedState.validationProcess.error = err.errors;
            watchedState.process = 'validationFail';
            watchedState.process = '';
            throw new Error('validation');
          });
      }, true);

      elements.postsContainer.addEventListener('click', (e) => {
        e.preventDefault();

        const { target } = e;

        if (target.tagName === 'BUTTON') {
          watchedState.activePost = target.dataset.id;
          watchedState.process = 'modalWindow';
          watchedState.process = '';
        }
      }, true);

      elements.postsContainer.addEventListener('click', (e) => {
        const { target } = e;

        if (target.tagName === 'BUTTON' || target.tagName === 'A') {
          console.log('click ui state!');
          const shownPostId = target.dataset.id;
          const { displayed } = watchedState.uiState;

          const shownPostUi = displayed.find((item) => item.id === shownPostId);
          shownPostUi.style = 'seen';
        }
      }, true);
    });
};

export default app;
