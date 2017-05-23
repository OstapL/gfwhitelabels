const sites = require('./sites.json');

let exportData = {
  getId() {
    let currentHost = window.location.host.split(':')[0];
    let hostId = sites.filter((i) => {
      if(currentHost == i.domain) {
        return i.id;
      }
    });

		if(hostId.length == 0) {
			console.debug('cannot find site for ' + currentHost + ' please update sites var');
			return 4;
		} else {
			return hostId[0].id;
		}
  }
};

sites.forEach((el) => {
	exportData[el.id] = el.frontend_bucket || el.url;
});

module.exports = exportData; 
