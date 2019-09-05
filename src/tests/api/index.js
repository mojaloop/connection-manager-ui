import fetchMock from 'fetch-mock';
// import partners from '../json/partners.json';

const prepareFetch = () => {
  //fetchMock.get('end:tpm/api/partners', partners);
  // fetchMock.get('express:tpm/api/partners/partnerships/:partnershipId/:resource', function(url){
  //   const regex = /^tpm\/api\/partners\/partnerships\/([a-f0-9\-]+)\/([a-zA-Z]+)$/;
  //   url.match(regex)
  //   console.log(url.match(regex))
  //   return partners;
  // })

  fetchMock.get('*', url => {
    const queryPosition = url.indexOf('?');
    const filename = url
      .substring(0, queryPosition !== -1 ? queryPosition : url.length)
      .replace('tpm/api', '../json')
      .concat('.json');

    try {
      const file = require(filename);
      return JSON.stringify(file);
    } catch (e) {
      return '{}';
    }
  });
  return fetchMock;
};

export default prepareFetch;
