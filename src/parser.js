import _ from 'lodash';

export default (contents) => {
  const domParser = new DOMParser();
  const dom = domParser.parseFromString(contents, 'application/xml');
  console.log('dom', dom);

  const parseerror = dom.querySelector('parsererror');
  console.log('parseerr el', parseerror);

  if (parseerror) {
    console.log(('parseerorro!'));
    throw new Error('noRssError');
  }

  const itemEls = dom.querySelectorAll('item');
  if (itemEls.length === 0) {
    console.log(('empty rss!'));

    throw new Error('emptyRss');
  }

  console.log('после блока try catch');

  const items = Array.from(dom.querySelectorAll('item'));
  const data = {

    feed: {
      title: dom.querySelector('title').textContent,
      id: _.uniqueId('f'),
      description: dom.querySelector('description').textContent,
      link: dom.querySelector('link').textContent,
    },
  };

  const currFeedId = data.feed.id;

  const addPostData = (postEl, feedId) => ({
    fId: feedId,
    id: _.uniqueId(''),
    title: postEl.querySelector('title').textContent,
    description: postEl.querySelector('description').textContent,
    link: postEl.querySelector('link').textContent,
  });
  const postsColl = items.map((item) => addPostData(item, currFeedId));
  data.newPosts = postsColl;

  return data;
};
