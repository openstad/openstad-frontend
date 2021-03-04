const fetch = require('node-fetch');

module.exports = (self, options) => {

  self.lijstje = async function() {

    // TODO: verplaats dit naar apos.openstadApi
    
    let url = `${self.apiUrl}/api/site/${self.siteId}/choicesguide`;
    return fetch(url, {
	    headers: { "Content-type": "application/json" },
    })
	    .then((response) => {
		    if (!response.ok) throw Error(response)
		    return response.json();
	    })
	    .then( json => {

        let list = json.map(entry => {
          return {
            value: entry.id,
            label: entry.title,
          }
        });

        return list;

	    })
	    .catch((err) => {
		    console.log('Niet goed');
		    console.log(err);
	    });
  };
  
}
