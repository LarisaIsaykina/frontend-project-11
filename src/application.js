import * as yup from 'yup';
import { setLocale } from 'yup';
import viewerFn from './viewer.js'
import ru from '../locales/ru.js'
import i18n from 'i18next';


const app = () => {

  const initialState = {
    validationProcess: {
      validationOccurred: false,
      isValid: '',
      data: {
        hrefValue: '',
      },
      error: '',
    },
    rssFeeds: [],
    rssLoaded: [],
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
  const feedBackMessageParagraph = document.querySelector('.feedback');
  const urlInput = document.getElementById('url-input');


    form.addEventListener('submit', (e) => {

      e.preventDefault();
      console.log('e', e);

      const formData = new FormData(e.target);
      const value = formData.get('url');
      console.log('value from event', value);

      const existingFeeds = watchedState.rssFeeds; 

    
      setLocale({
        mixed: {
          notOneOf: i18nInstance.t('existingRssError'),
        },
        
        string: {
          url: i18nInstance.t('invalidRssError'),
        }
      });
 

      const schema = yup.string().url().notOneOf(existingFeeds);
      watchedState.validationProcess.data.hrefValue = value;
      
      schema.validate(value)
      
      .then((val) => {
  
        watchedState.rssFeeds.push(val);
        console.log(watchedState.rssFeeds, 'rss feeds');
        watchedState.validationProcess.isValid = true;
        watchedState.validationProcess.validationOccurred = true;
        watchedState.validationProcess.validationOccurred = '';


        console.log('watched state then', watchedState);

        })
     
      .catch((err) => {
        

        console.log('err message', err.name);
        watchedState.validationProcess.error = err.errors;  
        watchedState.validationProcess.isValid = false;
        watchedState.validationProcess.validationOccurred = true;
        watchedState.validationProcess.validationOccurred = '';

        console.log('watched state catch', watchedState);
        console.log('value from input', watchedState);

      });

      
});

};

export default app;