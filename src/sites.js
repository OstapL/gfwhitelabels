let sites = [{
	id: 37,
	domain: "localhost",
	name: "growthfountain",
	bucket_name: "growthfountain-localhost",
	url: "http://growthfountain-localhost.s3-website-us-east-1.amazonaws.com",
	frontend_bucket: "https://d2ncibef8spfcn.cloudfront.net",
}, {
	id: 1,
	domain: "localhost_BROKEN_2",
	name: "growthfountain",
	bucket_name: "growthfountain-master-storage",
	url: "http://growthfountain-master-storage.s3-website-us-east-1.amazonaws.com",
	frontend_bucket: "https://d2i0hc81gw5f0c.cloudfront.net",
}, {
	id: 21,
	domain: "growthfountain-investment-admin.s3-website-us-east-1.amazonaws.com",
	name: "growthfountain investment admin",
	bucket_name: "growthfountain-investment-admin",
	url: "http://growthfountain-investment-admin.s3-website-us-east-1.amazonaws.com",
	frontend_bucket: "",
}, {
	id: 26,
	domain: "django-admin.growthfountain.com",
	name: "django-admin",
	bucket_name: "",
	url: "",
	frontend_bucket: "", 
}, {
	id: 4,
	domain: "localhost_BROKEN",
	name: "localhost",
	bucket_name: "growthfountain-master-storage",
	url: "http://growthfountain-master-storage.s3-website-us-east-1.amazonaws.com",
	frontend_bucket: "https://d2i0hc81gw5f0c.cloudfront.net",
}, {
	id: 18,
	domain: "dcu.growthfountain.com",
	name: "dcu",
	bucket_name: "growthfountain-dcu-storage",
	url: "http://growthfountain-dcu-storage.s3-website-us-east-1.amazonaws.com",
	frontend_bucket: "", 
}, {
	id: 10,
	domain: "localhost:7071",
	name: "growthfountain",
	bucket_name: "growthfountain-localhost",
	url: "http://growthfountain-localhost.s3-website-us-east-1.amazonaws.com",
	frontend_bucket: "",
}, {
	id: 11,
	domain: "localhost:70720",
	name: "growthfountain",
	bucket_name: "growthfountain-localhost",
	url: "http://growthfountain-localhost.s3-website-us-east-1.amazonaws.com",
	frontend_bucket: "", 
}, {
	id: 20,
	domain: "growthfountain-chagin.s3-website-us-east-1.amazonaws.com",
	name: "growthfountain",
	bucket_name: "growthfountain-master-storage",
	url: "http://growthfountain-master-storage.s3-website-us-east-1.amazonaws.com",
	frontend_bucket: "" 
}, {
	id: 13,
	domain: "localhost:70730",
	name: "growthfountain",
	bucket_name: "growthfountain-localhost",
	url: "http://growthfountain-localhost.s3-website-us-east-1.amazonaws.com",
	frontend_bucket: "" 
}, {
	id: 23,
	domain: "growthfountain.com",
	name: "growthfountain",
	bucket_name: "growthfountain-master-storage",
	url: "http://growthfountain-master-storage.s3-website-us-east-1.amazonaws.com",
	frontend_bucket: "https://d2i0hc81gw5f0c.cloudfront.net" 
}, {
	id: 9,
	domain: "beta.growthfountain.com",
	name: "growthfountain",
	bucket_name: "growthfountain-beta-storage",
	url: "http://growthfountain-beta-storage.s3-website-us-east-1.amazonaws.com",
	frontend_bucket: "" 
}, {
	id: 12,
	domain: "alpha.growthfountain.com",
	name: "growthfountain",
	bucket_name: "growthfountain-alpha-storage",
	url: "http://growthfountain-alpha-storage.s3-website-us-east-1.amazonaws.com",
	frontend_bucket: "" 
}, {
	id: 27,
	domain: "gfauth.com",
	name:  "",
	bucket_name: "",
	url: "",
	frontend_bucket: "" 
}, {
	id: 28,
	domain: "django-admin-dev.growthfountain.com",
	name: "growthfountain",
	bucket_name: "",
	url: "",
	frontend_bucket: "" 
}, {
	id: 29,
	domain: "momentum3.growthfountain.com",
	name:  "momentum3",
	bucket_name: "growthfountain-momentum3-storage",
	url: "http://growthfountain-momentum3-storage.s3-website-us-east-1.amazonaws.com",
	frontend_bucket: "" 
}, {
	id: 30,
	domain: "growthfountain-investment-admin-dev.s3-website-us-east-1.amazonaws.com",
	name:  "",
	bucket_name: "",
	url: "",
	frontend_bucket: "" 
}, {
	id: 36,
	domain: "alpha-dcu.growthfountain.com",
	name: "alpha dcu",
	bucket_name: "growthfountain-alpha-storage",
	url: "http://growthfountain-alpha-storage.s3-website-us-east-1.amazonaws.com",
	frontend_bucket: "" 
}, {
	id: 40,
	domain: "alpha-rivermarkcu.growthfountain.com",
	name: "alpha-rivermarkcu",
	bucket_name: "growthfountain-alpha-rivermark-storage",
	url: "http://growthfountain-alpha-rivermark-storage.s3-website-us-east-1.amazonaws.com",
	frontend_bucket: "" 
}, {
	id: 38,
	domain: "alpha-momentum3.growthfountain.com",
	name: "alpha-momentum3",
	bucket_name: "growthfountain-alpha-momentum3-storage",
	url: "http://growthfountain-alpha-momentum3-storage.s3-website-us-east-1.amazonaws.com",
	frontend_bucket: "" 
}, {
	id: 34,
	domain: "growthfountain-ostap.s3-website-us-east-1.amazonaws.com",
	name: "growthfountain ostap",
	bucket_name: "growthfountain-alpha-storage",
	url: "http://growthfountain-alpha-storage.s3-website-us-east-1.amazonaws.com",
	frontend_bucket: ""
}, {
  id: 45,
  domain: "alpha-infinityfcu.growthfountain.com",
  name: "alpha-infinityfcu",
  bucket_name: "growthfountain-alpha-infinityfcu",
  url: "http://growthfountain-alpha-intinityfcu-storage.s3-website-us-east-1.amazonaws.com",
}] 


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
