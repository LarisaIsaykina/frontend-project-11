export default (doc) => {
    const domDoc = new DOMParser();
    return domDoc.parseFromString(doc, 'text/html');
};