import * as yup from 'yup';
import onChange from 'on-change';



const app = () => {


  const initialState = {
    validationProcess: {
      validationOccurred: false,
      isValid: false,
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

const existingFeeds = watchedState.rssFeeds;

  const schema = yup.object().shape({
      href: yup.string().url().required('Ссылка должна быть валидным URL').notOneOf(existingFeeds, 'RSS уже существует')    
    });

const validateUrl = (href) => {

  console.log('HREF', href);

    const urlObj = new URL(href); 

  console.log('OBJect URL', obj);

    schema.isValid(urlObj)

    .then((ref) => {

      console.log('is validaton going???')
      ref; // => true
    })

    .catch((err) => {
      console.log('validation???');

      err.name; // => 'ValidationError'

    });
  
};

  const form = document.querySelector('.rss-form');
   

    form.addEventListener('submit', (e) => {
      // watchedState.validationProcess.validationOccurred = false;

      const { value } = e.target;

      console.log( 'e event', value);

      // watchedState.validationProcess.data.hrefValue = value;

      // validateUrl(value)
      // .then((boolean) => {
      //   watchedState.validationProcess.isValid = boolean;


      //   if (boolean === true) {
      //     watchedState.rssFeeds.push(value);
      //   }
      //   watchedState.validationProcess.validationOccurred = true;
      // });     
});

};

export default app;