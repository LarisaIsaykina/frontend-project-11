import onChange from 'on-change';
import ru from '../locales/ru.js'
import i18n from 'i18next';
import { setLocale } from 'yup';


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
  
      } else if (value === 'rssLoaded') {
        feedBackMessageParagraph.textContent = '';

        urlInput.classList.remove('is-invalid');
        feedBackMessageParagraph.classList.remove('text-danger');
        feedBackMessageParagraph.classList.add('text-success');
        feedBackMessageParagraph.textContent = i18nInstance.t('successMessage');
        urlInput.value = '';

        form.focus();

        postsContainer.innerHTML = '';
        feedsContainer.innerHTML = '';

        const headerPosts = document.createElement('h3');
      
        const headerFeed = document.createElement('h3');
        const titleFeed = document.createElement('p');
        const descriptionFeed = document.createElement('p');
        const feedInnerContainer = document.createElement('div');
        feedInnerContainer.id = 'currentFeed';

        const postsInnerContainer = document.createElement('div');
        postsInnerContainer.id = 'currentPosts';
        const ulPosts = document.createElement('ul');
        ulPosts.classList.add('list-unstyled');
        postsInnerContainer.append(ulPosts);

        headerPosts.textContent = 'Posts';
        postsContainer.append(headerPosts, postsInnerContainer);
        feedInnerContainer.append(titleFeed, descriptionFeed);
        feedsContainer.append(headerFeed, feedInnerContainer);

        headerFeed.textContent = 'Feeds';
        const { feeds, posts } = watchedState;
        const currFeed = feeds[feeds.length - 1];
        const { title, id, description } = currFeed;

        titleFeed.textContent = title;
        descriptionFeed.textContent = description;

        const currPosts = posts.filter((post) => post.fId === id);
        const postEls = currPosts.map((post) => {
          const li = document.createElement('li');

          const a = document.createElement('a');
          a.href = post.link;
          a.textContent = post.title;

        li.append(a);

          return li;
        });
        ulPosts.append(...postEls);

        postsInnerContainer.replaceChildren(ulPosts);

        const btnContainer = document.createElement('span');
        btnContainer.classList.add("btn-group-vertical");
        btnContainer.setAttribute('role', 'group');
        btnContainer.setAttribute('aria-label', 'Basic example');


        currPosts.forEach((post) => {
        const btn = document.createElement('button');
        btn.classList.add('btn', 'btn-primary');
        btn.setAttribute('data-toggle', 'modal');
        btn.setAttribute('type', 'button');
        btn.setAttribute('data-target', "#exampleModal");
        btn.textContent =  i18nInstance.t('see');
        btnContainer.append(btn);

        });
        postsContainer.append(btnContainer);
        
        
      } else if (value === 'rssUpdated') {
        const ul = document.querySelector('.list-unstyled');
        const { newPosts } = watchedState;
        const newPostEls = newPosts.map((post) => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = post.link;
          a.textContent = post.title;
          li.append(a);
          return li;
        });
        ul.prepend(...newPostEls);
       
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