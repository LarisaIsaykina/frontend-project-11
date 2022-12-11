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

    uiState: {
      displayed: [
        // { postId: id, style: new/ shown }
      ]
    }
    

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

            const extractedData = parse(contents);
            const { feed, posts1 } = extractedData;
            const { posts } = watchedState;
            watchedState.feeds.push(feed);
            watchedState.posts = [...posts, ...posts1];

            const addToUiState = (post) => {
              return { 
                id: post.id,
                style: 'default',
              };
            };


            watchedState.uiState.displayed = watchedState.posts.map((item) => addToUiState(item));
          
            
            watchedState.process = 'rssLoaded';

            
            watchedState.process = '';
           
          }
        })
        
        .then(() => {
          const { validatedUrls } = watchedState;

          validatedUrls.forEach((url) => {
            fetchWithTimeout(url, watchedState);
          })
        })

      });

      const postsContainer = document.querySelector('.posts');

      postsContainer.addEventListener('click', (e) => {
        e.preventDefault();

        const { target } = e;
        console.log('target', e.target);

        if (target.tagName === 'BUTTON') {
          console.log('in application add event listener if true',)
          watchedState.activePost = target.dataset.id;
          watchedState.process = 'modalWindow';
          watchedState.process = '';

      
        }
      }, true);

      postsContainer.addEventListener('click', (e) => {

        const { target } = e;
        console.log(target.tagName, 'tagname')
        console.log('boolean', (target.tagName === 'BUTTON' || target.tagName === 'A'));

        if (target.tagName === 'BUTTON' || target.tagName === 'A') {
          console.log('click ui state!')
            const shownPostId = target.dataset.id;

            const shownPostUi = watchedState.uiState.displayed.find((item) => item.id === shownPostId);
            shownPostUi.style =  'seen';


            // console.log('state proxy displayed collection', watchedState.uiState.displayed )
        }
      }, true);




};

export default app;