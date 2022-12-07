import i18n from 'i18next';


'<div class="modal" tabindex="-1" role="dialog"><div class="modal-dialog" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Modal title</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body"><p>Modal body text goes here (description).</p></div><div class="modal-footer"><button type="button" class="btn btn-primary">Читать полностью</button><button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button></div></div></div></div>'

export default () => {
const i18nInstance = i18n.createInstance();
  
  i18nInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  });

const btn = document.createElement('button');
btn.classList.add('btn', 'btn-primary');
btn.setAttribute('data-toggle', 'modal');
btn.setAttribute('type', 'button');
btn.setAttribute('data-target', "#exampleModal");
btn.textContent = t.i18nInstance('see');


  




};
