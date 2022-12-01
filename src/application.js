import * as yup from 'yup';
import onChange from 'on-change';



const app = () => {


  const initialState = {
    validationProcess: {
      validationOccurred: false,
      isValid: '',
      data: {
        hrefValue: '',
      },
      errorData: {},
    },
    rssFeeds: [],
  };




const watchedState = onChange(initialState, (path, value, previous) => {
  if (path === 'watchedState.validationProcess.validationOccurred') {
    if (watchedState.validationProcess.isValid === false) {
      
      const form = document.querySelector('.rss-form');
      const input = document.getElementById('url-input');

      form.focus();
      input.classList.add('is-invalid');
    }
  }
  if (path === 'watchedState.validationProcess.isValid') {
  }
  if (path === 'watchedState.validationProcess.validationOccurred') {
  }
});


  const form = document.getElementsByClassName('rss-form')[0];
  

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      watchedState.validationProcess.validationOccurred = false;
      const formData = new FormData(e.target);
      const value = formData.get('url');

      watchedState.validationProcess.data.hrefValue = value;
      const existingFeeds = watchedState.rssFeeds; 

      const schema = yup.string().url().required('Ссылка должна быть валидным URL').notOneOf(existingFeeds, 'RSS уже существует');

      schema.isValid(value, { abortEarly: false })

     
      .catch((err) => {
        console.log('err message', err.errors);
        
        err.name; // => 'ValidationError'
  
      })
      .then((boolean) => {
  
        console.log('result val', boolean)
        watchedState.validationProcess.isValid = boolean;
        if (boolean === true) {

          watchedState.rssFeeds.push(value);
          console.log(watchedState.rssFeeds, 'rss feeds');
        }
        console.log('errors, path', ValidationError);
      });
      
      
});

};

export default app;