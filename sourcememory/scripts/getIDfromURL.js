const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const subjectID = urlParams.get('id');