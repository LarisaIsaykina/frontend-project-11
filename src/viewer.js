import onChange from 'on-change';
import i18n from 'i18next';
import ru from './locales/ru.js';
import 'bootstrap';

const form = document.querySelector('.rss-form');
const feedBackMessageParagraph = document.querySelector('.feedback');
const urlInput = document.getElementById('url-input');
const postsContainer = document.querySelector('.posts');
const feedsContainer = document.querySelector('.feeds');
const submitBtn = document.querySelector('button[type="submit"]');

const launchViewer = (initialState) => {
  const i18nInstance = i18n.createInstance();

  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

  const watchedState = onChange(initialState, (path, value) => {
    if (path === 'process') {
      if (value === 'validationFail') {
        urlInput.classList.add('is-invalid');
        feedBackMessageParagraph.textContent = '';
        feedBackMessageParagraph.classList.remove('text-success');
        feedBackMessageParagraph.classList.add('text-danger');
        feedBackMessageParagraph.textContent = watchedState.validationProcess.error;
      } else if (value === 'rssLoaded' || value === 'rssUpdated') {
        feedBackMessageParagraph.textContent = '';

        urlInput.classList.remove('is-invalid');
        feedBackMessageParagraph.classList.remove('text-danger');
        feedBackMessageParagraph.classList.add('text-success');
        feedBackMessageParagraph.textContent = i18nInstance.t('successMessage');
        urlInput.value = '';

        form.focus();

        postsContainer.innerHTML = '';
        feedsContainer.innerHTML = '';

        const feedsInnerContainer = document.createElement('div');
        feedsInnerContainer.id = 'currentFeed';
        const postsInnerContainer = document.createElement('div');
        postsInnerContainer.id = 'currentPosts';

        const headerFeed = document.createElement('h3');
        const titleFeed = document.createElement('h3');
        titleFeed.classList.add('h6', 'm-0');
        const descriptionFeed = document.createElement('p');
        descriptionFeed.classList.add('m-0', 'small', 'black-text-50');

        const headerPosts = document.createElement('h3');
        const ulFeeds = document.createElement('ul');
        ulFeeds.classList.add('list-group', 'border-0');
        ulFeeds.id = 'ulFeeds';

        const ulPosts = document.createElement('ul');
        ulPosts.classList.add('list-group', 'border-0');
        ulPosts.id = 'ulPosts';
        postsInnerContainer.append(ulPosts);

        feedsInnerContainer.append(ulFeeds);

        headerPosts.textContent = 'Posts';

        headerFeed.textContent = 'Feeds';
        const { feeds, posts } = watchedState;
        const currFeed = feeds[feeds.length - 1];
        const { title, id, description } = currFeed;

        titleFeed.textContent = title;
        descriptionFeed.textContent = description;
        feedsInnerContainer.append(ulFeeds);

        feedsContainer.append(headerFeed, feedsInnerContainer);
        postsContainer.append(headerPosts, postsInnerContainer);

        const currPosts = posts.filter((post) => post.fId === id);

        const postsUiState = watchedState.uiState.displayed;

        const postEls = currPosts.map((post) => {
          const li = document.createElement('li');
          li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

          const a = document.createElement('a');

          a.href = post.link;
          a.textContent = post.title;
          a.dataset.id = post.id;
          const postInUi = postsUiState.find((item) => item.id === post.id);
          const { style } = postInUi;
          const styleToApply = (style === 'default') ? 'fw-bold' : 'fw-normal';
          a.classList.add(styleToApply);
          a.setAttribute('data-id', post.id);

          li.append(a);

          const btn = document.createElement('button');
          btn.classList.add('btn', 'btn-outline-primary');
          btn.setAttribute('type', 'button');
          btn.setAttribute('data-id', post.id);

          btn.setAttribute('data-bs-toggle', 'modal');
          btn.setAttribute('data-bs-target', '#modal');

          btn.textContent = i18nInstance.t('see');
          li.appendChild(btn);
          return li;
        });

        ulPosts.append(...postEls);
        postsInnerContainer.replaceChildren(ulPosts);

        const feedEls = feeds.map((feed) => {
          const li = document.createElement('li');
          li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
          const h = document.createElement('h3');
          h.textContent = feed.title;
          const p = document.createElement('p');
          p.textContent = feed.description;
          li.append(h, p);
          return li;
        });
        ulFeeds.prepend(...feedEls);
        feedsInnerContainer.replaceChildren(ulFeeds);
      } else if (value === 'modalWindow') {
        const { activePost, posts } = watchedState;

        const postData = posts.find((item) => item.id === activePost);
        const modalTitle = document.querySelector('.modal-title');
        modalTitle.textContent = postData.title;
        const modalBody = document.querySelector('.modal-body');
        modalBody.textContent = postData.description;
        const modalHref = document.querySelector('.full-article');
        modalHref.href = postData.link;
      } else if (value === 'networkFail') {
        feedBackMessageParagraph.textContent = '';
        feedBackMessageParagraph.textContent = i18nInstance.t('networkError');
      }
    } else if (path.startsWith('noRssError')) {
      console.log('goes into render no rss');

      feedBackMessageParagraph.classList.remove('text-success');
      feedBackMessageParagraph.classList.add('text-danger');
      feedBackMessageParagraph.textContent = value[value.length - 1];
    } else if (path.startsWith('uiState.displayed')) {
      console.log('state in render', watchedState.uiState.displayed);
      const coll = watchedState.uiState.displayed;
      console.log('coll foreach all posts in ui state', coll);

      coll.forEach((post) => {
        if (post.style === 'seen') {
          const { id } = post;
          const elToSetStyle = document.querySelector(`a[data-id="${id}"]`);
          console.log(elToSetStyle, 'element to change style');
          elToSetStyle.classList.remove('fw-bold');
          elToSetStyle.classList.add('fw-normal');
        }
      });
    } else if (path === 'uiState.submitBlocked') {
      if (value === true) {
        submitBtn.disabled = true;
      } else {
        submitBtn.disabled = false;
      }
    }
  });

  return watchedState;
};
export default launchViewer;
