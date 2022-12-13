import _ from 'lodash';

export default (contents, viewer) => { // контент с конкретной ссылки
  const domParser = new DOMParser();
  const dom = domParser.parseFromString(contents, 'application/xml');

  const titleFeed = dom.querySelector('title').textContent;

  console.log('dom in update parsing', dom);

  const items = Array.from(dom.querySelectorAll('item'));

  const { feeds, posts } = viewer;

  console.log('feeds in update parsing', feeds);

  console.log('viewer in update parsing', viewer);

  const currFeed = feeds.find((item) => item.title === titleFeed);

  console.log('curr feed in update parsing', currFeed);

  const currFeedId = currFeed.id;

  const postsInState = posts.filter((post) => post.fId === currFeedId);

  const postTitles = postsInState.map((post) => post.title);
  const addToUiState = (post) => ({
    id: post.id,
    style: 'default',
  });

  const newPosts = [];

  const addPostData = (postEl, feedId) => {
    const newItem = {
      fId: feedId,
      id: _.uniqueId(''),
      title: postEl.querySelector('title').textContent,
      description: postEl.querySelector('description').textContent,
      link: postEl.querySelector('link').textContent,
    };
    newPosts.push(newItem);

    viewer.posts.push(newItem);
  };

  items.forEach((item) => {
    const titleEl = item.querySelector('title');
    const titleText = titleEl.textContent;

    if (!postTitles.includes(titleText)) {
      addPostData(item, currFeedId);
    }
  });

  const currentShownFeed = feeds[feeds.length - 1];
  const idOfShown = currentShownFeed.id;

  console.log('is Empty newposts?', (_.isEmpty(newPosts)));

  if (!_.isEmpty(newPosts) && newPosts[0].fId === idOfShown) {
    viewer.newPosts = newPosts;
    const { displayed } = viewer.uiState;
    const newDisplayed = newPosts.map(addToUiState);
    viewer.uiState.displayed = [...displayed, ...newDisplayed];
    viewer.process = 'rssUpdated';
    viewer.process = '';
  }
};
