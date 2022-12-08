import onChange from 'on-change';
import ru from '../locales/ru.js'
import i18n from 'i18next';
import { setLocale } from 'yup';
import _ from 'lodash';
import 'bootstrap';



const form = document.querySelector('.rss-form');
const feedBackMessageParagraph = document.querySelector('.feedback');
const urlInput = document.getElementById('url-input');
const postsContainer = document.querySelector('.posts');
const feedsContainer = document.querySelector('.feeds');

const viewerFn = (initialState) => {
  const i18nInstance = i18n.createInstance();
  
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

    
  const watchedState = onChange(initialState, (path, value, previous) => {
    if (path === 'process') {
           
      if (value === 'validationFail') {
          urlInput.classList.add('is-invalid');
          feedBackMessageParagraph.textContent = '';
          feedBackMessageParagraph.classList.remove('text-success');
          feedBackMessageParagraph.classList.add('text-danger');
          feedBackMessageParagraph.textContent = watchedState.validationProcess.error;
  
      } else if (value === 'rssLoaded' || value == 'rssUpdated') {
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
        const titleFeed = document.createElement('p');
        const descriptionFeed = document.createElement('p');
  

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
        

        const postEls = currPosts.map((post) => {
          const li = document.createElement('li');
          li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

          const a = document.createElement('a');

          a.href = post.link;
          a.textContent = post.title;
          a.setAttribute('data-id', post.id);


          li.append(a);

          const btn = document.createElement('button');
          btn.id = _.uniqueId('btn'),
          btn.classList.add('btn', 'btn-outline-primary');
          btn.setAttribute('data-toggle', 'modal');
          btn.setAttribute('type', 'button');
          btn.setAttribute('data-id', post.id);


          btn.setAttribute('data-target', "#modal");
          btn.setAttribute('data-bs-target', "#modal");

          btn.textContent =  i18nInstance.t('see');
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
          console.log('feed', feed);
          const p = document.createElement('p');
          p.textContent = feed.description;
          li.append(h, p);
          return li;
        });

        ulFeeds.append(...feedEls);
        feedsInnerContainer.replaceChildren(ulFeeds);

       
      } else if (value === 'modalWindow') {
        const { activePost } = watchedState;
        const modalElement = document.getElementById('modal');
        
      }


    } else if (path === 'noRssError') {
        
        feedBackMessageParagraph.classList.remove('text-success');
        feedBackMessageParagraph.classList.add('text-danger');
        feedBackMessageParagraph.textContent = value[value.length - 1];

    } else if (path === 'networkFail') {
      feedBackMessageParagraph.textContent = '';
      feedBackMessageParagraph.textContent = i18nInstance.t('networkError');
    }

});
 
    return watchedState;
  }
  export default viewerFn;