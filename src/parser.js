import _ from 'lodash';

export default (contents) => {
    const domParser = new DOMParser();
    const dom =  domParser.parseFromString(contents, 'application/xml');    
    const data = {

      feed: {
        title: dom.querySelector('title').textContent,
        id: _.uniqueId('f'),
        description: dom.querySelector('description').textContent,
        link: dom.querySelector('link').textContent,
      }
    };
  
    const currFeedId = data.feed.id;
  
    const items = Array.from(dom.querySelectorAll('item')); // find all els = posts from parsed

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
    
    return data;         


};