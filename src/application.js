import * as yup from 'yup';
import { setLocale } from 'yup';
import viewerFn from './viewer.js'
import ru from '../locales/ru.js'
import i18n from 'i18next';
import parse from './parser.js';
import _ from 'lodash';
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

    noRssError: [],
    feeds: [],

    posts: [],

    validatedUrls: [],
    newPosts: [],
    

  };

  const i18nInstance = i18n.createInstance();
  
    i18nInstance.init({
      lng: 'ru',
      debug: true,
      resources: {
        ru,
      },
  }).then(() => {
    
    document.querySelector('h1').textContent = i18nInstance.t('header1');
    document.querySelector('.lead').textContent = i18nInstance.t('header2');
    document.querySelector('button[type="submit"]').textContent = i18nInstance.t('btnSubmit');
    document.querySelector('label[for="url-input"]').textContent = i18nInstance.t('inputLabel');
    
    });
     
  const watchedState = viewerFn(initialState);

  const form = document.querySelector('.rss-form');

    form.addEventListener('submit', (e) => {

      e.preventDefault();
      const formData = new FormData(e.target);
      const value = formData.get('url');
      const existingReferences = watchedState.validatedUrls;
    
      setLocale({
        mixed: {
          notOneOf: i18nInstance.t('existingRssError'),
        },
        string: {
          url: i18nInstance.t('invalidRssError'),
        }
      });
 
      const schema = yup.string().url().notOneOf(existingReferences);
      
      schema.validate(value)

      .catch((err) => { // ошибка невалидный адрес -> невалидный стиль
        console.log('err', err);
        watchedState.validationProcess.error = err.errors;  
        watchedState.process = 'validationFail';
        watchedState.process = '';
      })
      
      .then((val) => {
        watchedState.validationProcess.data.hrefValue = val;
        watchedState.validatedUrls.push(val);
        return fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(val)}`)

      })

      .then((response) => {
  
        if (response.ok) return response.json();
        return Promise.reject(response);
      })

       
      .then((data) => {
        console.log(data, 'data');
        const { contents } = data;
          if (!contents.includes('rss')) {
            watchedState.noRssError.push(i18nInstance.t('noRssError'));
          } else {

            console.log('точка останова в else after first parse');
            const extractedData = parse(contents);
            const { feed, posts } = extractedData;
            watchedState.feeds.push(feed);
            watchedState.posts.push(posts);
            
            watchedState.process = 'rssLoaded';
            watchedState.process = '';
           
          }
        })
        .then(() => {
          console.log('els in then', document.getElementsByClassName('btn-outline-primary'));

          Array.from(document.getElementsByClassName('btn-outline-primary')).forEach((btn) => {
            btn.addEventListener('click', (e) => {
              e.preventDefault();
              watchedState.process = 'modalWindow';
              watchedState.activePost = bnt.dataset.id;
  
            })
          })
        })
        .then(() => {
          const { validatedUrls } = watchedState;

          validatedUrls.forEach((url) => {
            fetchWithTimeout(url, watchedState);
          })
        })

      })

};

export default app;