export default (contents) => {
  const domParser = new DOMParser();
  const dom = domParser.parseFromString(contents, 'application/xml');
  console.log('dom', dom);

  const parseerror = dom.querySelector('parsererror');
  console.log('parseerr el', parseerror);

  if (parseerror) {
    console.log(('parseerorro!'));
    throw new Error('noRssError');
  } return dom;
};
