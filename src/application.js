import * as yup from 'yup';
import { setLocale } from 'yup';
import viewerFn from './viewer.js'
import ru from './locales/ru.js'
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

    
      .then((val) => {
        watchedState.validationProcess.data.hrefValue = val;

        return val;
      })

      .then((val) => {

        const response = fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(val)}`)
        watchedState.uiState.submitBlocked = true;

        return response;
      })

      .then((response) => {

        console.log('in then');
        watchedState.validatedUrls.push(watchedState.validationProcess.data.hrefValue);

        watchedState.uiState.submitBlocked = false;

  
        if (response.ok) {
          console.log('response ok', (response.ok) )

          return response.json();
        }
     
        throw new Error("Status code error :" + response.status);

      })

      .then((data) => {
        console.log('after response json returned data', data)

        const { contents } = data;
        console.log('cintents', contents);
          
          const extractedData = parse(contents);
          console.log('extracted data', extractedData);
          if (extractedData === 'parseerror') {
            console.log('state in app', watchedState.noRssError);
            throw new Error('noRSS');
          } else if (extractedData === 'emptyRss') {
              throw new Error('emptyRSS');

          } else {
            console.log('in else')

          const { feed, newPosts } = extractedData;
            
          const { posts } = watchedState;
          watchedState.feeds.push(feed);
          watchedState.posts = [...posts, ...newPosts];

          const addToUiState = (post) => {
            return { 
              id: post.id,
              style: 'default',
            };
          };

          watchedState.uiState.displayed = watchedState.posts.map((item) => addToUiState(item));
          }
        })

          .catch(err =>  {
            watchedState.uiState.submitBlocked = false;

            if (err.name === 'ValidationError') {
              watchedState.validationProcess.error = err.errors;  
              watchedState.process = 'validationFail';
              watchedState.process = '';
              throw new Error('validation');

            } else if(err.message === 'noRSS') {
              watchedState.noRssError.push(i18nInstance.t('noRssError'));
              throw new Error();


            } else if (err.message === 'emptyRSS') {
              watchedState.noRssError.push(i18nInstance.t('emptyRss'));
              throw new Error();

            }
            
            else {
              console.log('error in network catch error', err.name)
              watchedState.process = 'networkFail';
              watchedState.process = '';
              throw new Error('network');
            }
    
          })
          
          .then(() => {
  
            watchedState.process = 'rssLoaded';
            watchedState.process = '';
          })
               
        
        .then(() => {
          const { validatedUrls } = watchedState;

          validatedUrls.forEach((url) => {
            fetchWithTimeout(url, watchedState);
          })
        });

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

        }
      }, true);




};

export default app;