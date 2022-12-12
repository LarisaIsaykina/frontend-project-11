import _ from 'lodash';

export default (contents) => {
    const domParser = new DOMParser();
    const dom =  domParser.parseFromString(contents, 'application/xml'); 
    console.log('точка останова в beginnin parser');
    const parsererrors = Array.from(dom.getElementsByTagName('parsererror'));

    const items = Array.from(dom.querySelectorAll('item')); // find all els = posts from parsed
    console.log(items);

    console.log('dom contains parseerror', parsererrors.length);

    if (parsererrors.length !== 0) {
      console.log('return parseerror');
      return 'parseerror';
    }   else if (items.length === 0) {
      console.log('return empty');

      return 'emptyRss';
    } else {
      console.log('else in parser')

    const data = {

      feed: {
        title: dom.querySelector('title').textContent,
        id: _.uniqueId('f'),
        description: dom.querySelector('description').textContent,
        link: dom.querySelector('link').textContent,
      }
    };
  
    const currFeedId = data.feed.id;
      


    const addPostData = (postEl, feedId) => {
       return {
        fId: feedId, 
        id: _.uniqueId(''),
        title: postEl.querySelector('title').textContent,
        description: postEl.querySelector('description').textContent,
        link: postEl.querySelector('link').textContent,
      };

    };
    const postsColl = items.map((item) => addPostData(item, currFeedId));
    data.newPosts = postsColl;
    console.log('точка остановка в конце parser.js')
    
    return data;    
  }     


};