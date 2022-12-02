import * as yup from 'yup';
import viewerFn from './viewer.js'


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
    successMessage: 'RSS успешно загружен',
  };

  const watchedState = viewerFn(initialState);

  const form = document.querySelector('.rss-form');
  const feedBackMessageParagraph = document.querySelector('.feedback');
  const urlInput = document.getElementById('url-input');


    form.addEventListener('submit', (e) => {

      e.preventDefault();
      console.log('e', e);
      watchedState.validationProcess.validationOccurred = '';

      const formData = new FormData(e.target);
      const value = formData.get('url');

      const existingFeeds = watchedState.rssFeeds; 

      const schema = yup.string('Ссылка должна быть валидным URL').url('Ссылка должна быть валидным URL').required('Ссылка должна быть валидным URL').notOneOf(existingFeeds, 'RSS уже существует');

      schema.validate(value)
      .then((val) => {
  
        watchedState.rssFeeds.push(val);
        console.log(watchedState.rssFeeds, 'rss feeds');
        watchedState.validationProcess.isValid = true;
        watchedState.validationProcess.validationOccurred = true;
        watchedState.rssLoaded.push(val);

        console.log('watched state', watchedState);

        })
     
      .catch((err) => {

        console.log('err message', err.errors);
        watchedState.validationProcess.error = err.errors;  
        watchedState.validationProcess.isValid = false;
        watchedState.validationProcess.validationOccurred = true;
        console.log('watched state', watchedState);
        console.log('value from input', watchedState);




    
       
      });
      
      
});

};

export default app;