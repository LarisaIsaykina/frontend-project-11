import * as yup from 'yup';
import { setLocale } from 'yup';
import viewerFn from './viewer.js'
import ru from '../locales/ru.js'
import i18n from 'i18next';
import parse from './parser.js';
import _ from 'lodash';


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
    noRssError: [],
    feeds: [],

    posts: [],

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
      const formData = new FormData(e.target);
      const value = formData.get('url');
      const existingFeeds = watchedState.feeds.map((feed) => feed.title); 
    
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
        return fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(val)}`)
      })
   
      .then((response) => {
  
        if (response.ok) return response.json()
          throw new Error('Network response was not ok.')

        })
      .then((data) => {
        //console.log(data);
        const dataType = data.contents;
        //console.log(dataType);

          if (!dataType.includes('rss')) {
            watchedState.noRssError.push(i18nInstance.t('noRssError'));
          } else {
            const val = watchedState.validationProcess.data.hrefValue;
            watchedState.feeds.push({ title: val , id: _.uniqueId('f') });
            watchedState.validationProcess.isValid = true;
            watchedState.validationProcess.validationOccurred = true;
            watchedState.validationProcess.validationOccurred = '';
  
            const dom = parse(data.contents);
            console.log('body nodes child', dom.body.rss.channel.childNodes);

            const titles = dom.getElementsByTagName('title');
           
              Array.from(titles).forEach((title) => {
                console.log(title.innerText);
              })
              const descriptions = dom.getElementsByTagName('description');
                   
              Array.from(descriptions).forEach((item) => {
                console.log(item, item.innerText);
              })

              const links = dom.getElementsByTagName('link');
        
           
              Array.from(links).forEach((item) => {
                console.log('link', item.nextSibling);
              })


              

          }
        })
        
     
      .catch((err) => { // ошибка невалидный адрес -> невалидный стиль
        console.log('err', err);
        watchedState.validationProcess.error = err.errors;  
        watchedState.validationProcess.isValid = false;
        watchedState.validationProcess.validationOccurred = true;
        watchedState.validationProcess.validationOccurred = '';
      })

  
     
      ;

      
});

};

export default app;