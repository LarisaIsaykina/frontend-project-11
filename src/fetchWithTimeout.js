import axios from 'axios';
import updateParsing from './updateParsing.js';

export default (href, viewer) => {
  const fetchData = () => {
    console.log('before get request');
    axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(href)}`)

      .then((response) => {
        console.log('response', response);
        const { contents } = response.data;

        updateParsing(contents, viewer); // we say about current url with a unique doc
      })
      .catch((err) => {
        console.log('err code', err.code);
        viewer.postValidationErrors.push(err.name);
      });
  };

  setTimeout(function recursiveFetch() {
    fetchData();
    setTimeout(recursiveFetch, 5000);
  }, 5000);
};
