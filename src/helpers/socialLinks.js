const socialNetworksMap = {
  instagram: ['instagram.com'],
  facebook: ['facebook.com', 'fb.com'],
  twitter: ['twitter.com'],
  linkedin: ['linkedin.com'],
};

module.exports = {
  events: {
    'change #twitter,#facebook,#instagram,#linkedin': 'ensureSocialNetworkLink',
  },
  methods: {
    ensureSocialNetworkLink(e) {
      const network = e.target.name;
      const value = e.target.value.toLowerCase();

      if(value === '') {
        return false;
      }

      const withNetwork = !!(socialNetworksMap[network] || []).find(link => value.indexOf(link) >= 0);

      if (withNetwork) {
        return e.target.value = app.helpers.format.ensureLinkProtocol(value, true);
      }

      let linkValue = socialNetworksMap[network][0] + (value.startsWith('/') ? value : '/' + value);

      e.target.value = app.helpers.format.ensureLinkProtocol(linkValue, true);
    },
  }
};
