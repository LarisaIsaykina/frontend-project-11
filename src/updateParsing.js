import _ from "lodash";

export default (contents, viewer) => {
    const domParser = new DOMParser();
    const dom =  domParser.parseFromString(contents, 'text/html');
    const titleFeed = dom.querySelector('title');
 
    const items = Array.from(dom.querySelectorAll('item')); // все посты из обновленного документа

    const { feeds } = viewer; 
    const currFeed = feeds.find((item) => item.title = titleFeed); // извлекаем из наблюдателя текущий фид

    const currFeedId = currFeed.id; // извлекаем id для поиска постов в наблюдателе
    
    const postsInState = viewer.posts.filter((post) => post.fId = currFeedId); //  посты из наблюдателя

    console.log('posts in state', postsInState);

    const postTitles = postsInState.map((post) => post.title);

    const newPosts = [];

    const addPostData = (postEl, feedId) => {
       const newItem = {
        fId: feedId, 
        id: _.uniqueId(''),
        title: postEl.querySelector('title').textContent,
        description: postEl.querySelector('description').textContent,
        link: postEl.querySelector('link').nextSibling.data.trim(),
      };
      newPosts.push(newItem);
      viewer.posts.push(newItem);
    };
  
    items.forEach((item) => {

      const titleEl = item.querySelector('title');
      const titleText = titleEl.textContent;
      
       if (!postTitles.includes(titleText)) {
        console.log('item ', item);
        addPostData(item, currFeedId);

       }
    });
    
    if (!_.isEmpty(newPosts)) {
     
      viewer.newPosts = newPosts;
      viewer.process = 'rssUpdated';
      viewer.process = '';   
    
    }
    console.log('els in then', document.getElementsByClassName('btn-outline-primary'));

    Array.from(document.getElementsByClassName('btn-outline-primary')).forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        watchedState.process = 'modalWindow';
        watchedState.activePost = bnt.dataset.id;
      })
    });





};