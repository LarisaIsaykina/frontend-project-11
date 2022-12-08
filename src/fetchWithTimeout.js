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
        console.log(data, 'data');
        const { contents } = data;

        updateParsing(contents, viewer); // we say about current url with a unique doc
        console.log('els in then', document.getElementsByClassName('btn-outline-primary'));

        Array.from(document.getElementsByClassName('btn-outline-primary')).forEach((btn) => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            watchedState.process = 'modalWindow';
            watchedState.activePost = bnt.dataset.id;

          })
        });
    
    })
    };
  
    setTimeout(function recursiveFetch() {
      fetchData();
      setTimeout(recursiveFetch, 5000)
    }, 5000);
    
};
