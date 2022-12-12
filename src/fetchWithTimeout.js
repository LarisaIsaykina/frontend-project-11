import updateParsing from './updateParsing.js';
import _ from 'lodash';

export default (href, viewer) => {

    const fetchData = () =>  {
    fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(href)}`)
    
    .then((response) => {
        console.log('update working')
  
        if (response.ok) return response.json();
        throw new Error(response.status);
      })    
      .then((data) => {
        const { contents } = data;

        updateParsing(contents, viewer); // we say about current url with a unique doc
        
    })
    .catch(err => {
      alert(err.message);
      viewer.process = 'networkFail';
      viewer.process = '';
    })
    };
  
    setTimeout(function recursiveFetch() {
      fetchData();
      setTimeout(recursiveFetch, 5000)
    }, 5000);
    
};
