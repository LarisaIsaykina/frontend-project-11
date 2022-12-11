import updateParsing from './updateParsing.js';
import _ from 'lodash';

export default (href, viewer) => {

    const fetchData = () =>  {
    fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(href)}`)
    
    .then((response) => {
        console.log('update working')
  
        if (response.ok) return response.json();
        return Promise.reject(response);
      })

      .catch(err => {
        viewer.process = 'networkFail';
        viewer.process = '';
        return Promise.reject(err);
      })
    
      .then((data) => {
        const { contents } = data;

        updateParsing(contents, viewer); // we say about current url with a unique doc

        
    })
    };
  
    setTimeout(function recursiveFetch() {
      fetchData();
      setTimeout(recursiveFetch, 5000)
    }, 5000);
    
};
