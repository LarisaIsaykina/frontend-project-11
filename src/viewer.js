import onChange from 'on-change';
import ru from '../locales/ru.js'
import i18n from 'i18next';
import { setLocale } from 'yup';


const form = document.querySelector('.rss-form');
const feedBackMessageParagraph = document.querySelector('.feedback');
const urlInput = document.getElementById('url-input');

const viewerFn = (initialState) => {
  const i18nInstance = i18n.createInstance();
  
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

    
  const watchedState = onChange(initialState, (path, value, previous) => {
    if (path === 'validationProcess.validationOccurred') {
      if (watchedState.validationProcess.isValid === true) {
          urlInput.classList.remove('is-invalid');
          feedBackMessageParagraph.classList.remove('text-danger');
          feedBackMessageParagraph.classList.add('text-success');
          feedBackMessageParagraph.textContent = i18nInstance.t('successMessage');
          urlInput.value = '';
          form.focus();
            

      } else if (watchedState.validationProcess.isValid === false) {
          urlInput.classList.add('is-invalid');
          feedBackMessageParagraph.classList.remove('text-success');
          feedBackMessageParagraph.classList.add('text-danger');
          feedBackMessageParagraph.textContent = watchedState.validationProcess.error;
    
      }

    }
  });
 
    return watchedState;
  }
  export default viewerFn;