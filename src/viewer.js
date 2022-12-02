import onChange from 'on-change';

 const form = document.querySelector('.rss-form');
 const feedBackMessageParagraph = document.querySelector('.feedback');
 const urlInput = document.getElementById('url-input');

const viewerFn = (initialState) => {
    const watchedState = onChange(initialState, (path, value, previous) => {
      if (path === 'validationProcess.validationOccurred') {
        if (watchedState.validationProcess.isValid === true) {
            urlInput.classList.remove('is-invalid');
            feedBackMessageParagraph.classList.remove('text-danger');
            feedBackMessageParagraph.classList.add('text-success');
            feedBackMessageParagraph.textContent = watchedState.successMessage;
            urlInput.value = '';
            form.focus();
            

        } else if (watchedState.validationProcess.isValid === false) {
          urlInput.classList.add('is-invalid');
          feedBackMessageParagraph.classList.remove('text-success');
          feedBackMessageParagraph.classList.add('text-danger');
          feedBackMessageParagraph.textContent = watchedState.validationProcess.error;
    
        }

      }
    });
    return watchedState;
  }
  export default viewerFn;