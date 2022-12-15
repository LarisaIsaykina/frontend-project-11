import i18n from 'i18next';
import axios from 'axios';
import _ from 'lodash';
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
  });
  // const errorCodes = {
  //   network: i18nInstance.t('networkError'),
  //   validation: i18nInstance.t('invalidRssError'),
  //   emptyRss: i18nInstance.t('emptyRss'),
  //   noRss: i18nInstance.t('noRssError'),
  //   existingRssError: i18nInstance.t('existingRssError'),
  // };

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
        watchedState.validatedUrls.push(watchedState.validationProcess.data.hrefValue);

        watchedState.uiState.displayed = watchedState.posts.map((item) => addToUiState(item));
        watchedState.process = 'rssLoaded';
        watchedState.process = '';
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

  const { validatedUrls } = watchedState;
  console.log('validatedUrls', validatedUrls);

  validatedUrls.forEach((url) => {
    fetchWithTimeout(url, watchedState);
  });

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
};

export default app;
