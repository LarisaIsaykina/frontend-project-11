export default (doc) => {
    const domDoc = new window.DOMParser();
    return domDoc.parseFromString(doc, 'text/html');
};