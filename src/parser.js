export default (contents) => {
    const domParser = new DOMParser();
    const dom =  domParser.parseFromString(contents, 'text/html');
    
    const data = {

      feed: {
        title: dom.querySelector('title').textContent,
        id: _.uniqueId('f'),
        description: dom.querySelector('description').textContent,
        link: dom.querySelector('link').nextSibling.data.trim(),
      }
    
    };
  
    const currFeedId = data.feed.id;
  
    const items = Array.from(dom.querySelectorAll('item'));

    const addPostData = (postEl, feedId) => {
       return {
        fId: feedId, 
        id: _.uniqueId(''),
        title: postEl.querySelector('title').textContent,
        description: postEl.querySelector('description').textContent,
        link: postEl.querySelector('link').nextSibling.data.trim(),
      };

    };
    const postsColl = items.map((item) => addPostData(item, currFeedId));
    data.posts = postsColl;
    
    return data;         


};