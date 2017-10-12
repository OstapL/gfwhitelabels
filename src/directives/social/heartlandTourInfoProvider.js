
const SPECIAL_SYMBOLS = {
  BULLET: '%E2%80%A2',
  NEW_LINE: '%0D%0A',
};

const listMarker = SPECIAL_SYMBOLS.NEW_LINE + ' ' + SPECIAL_SYMBOLS.BULLET + ' ';

const ShareInfoProvider = require('src/directives/social/infoProvider.js');


class HeartlandInfoProvider extends ShareInfoProvider {
  constructor(model) {
    super(model);

    this.places = [
      'New York, New York',
      'Portland, Maine',
      'Boston / Worcester, Massachusetts',
      'Jacksonville, Florida',
      'Chattanooga, Tennessee',
      'Waterloo, Iowa',
      'New Orleans, Louisiana',
      'Tulsa, Oklahoma',
      'Portland, Oregon',
      'Los Angeles, California',
    ];

    this.placesList = listMarker + this.places.join(listMarker);

    this.templates = {
      title: 'Calling all successful entrepreneurs, startups and small businesses',
      description: 'Companies can join GrowthFountain\'s Heartland Tour by pitching their ' +
        '%E2%80%A2product or service to thousands of people. Apply now for your chance to participate!',
      confirmationMessage: 'Do you want to share heartland page with your :network network?',
    };

    this.__initData(model);
  }

  __initData(model) {

    this.data = {
      title: this._format('title'),
      url: window.location.href,
      picture: window.location.origin + require('images/banners/cities.png'),
    };
  }

  twitter() {
    return 'https://twitter.com/share' +
      '?url=' + this.data.url +
      '&text=' + encodeURIComponent(this._format('title') + '\r\n@GrowthFountain\r\n');
  }

  linkedin() {
    return {
      content: {
        'title': this.data.title,
        'description': this.data.description,
        'submitted-url': this.data.url,
        'submitted-image-url': this.data.picture,
      },
      'visibility': {
        'code': 'anyone'
      }
    };
  }

  email() {
    return this._buildMailToLink({
      subject: 'I thought you\'d be interested in GrowthFountain\'s Heartland Tour',
      body: 'Hi! I think you should check out GrowthFountain\'s Heartland Tour. ' +
        'They\'re traveling across country on a quest for exciting companies that need to raise money to grow; ' +
        'from tech startups to the restaurants, bars and bricks %26 mortar locations across America.' +
        SPECIAL_SYMBOLS.NEW_LINE + SPECIAL_SYMBOLS.NEW_LINE +
        'I thought you might be interested in raising money or attending one of their live events in September. ' +
        'They\'re currently finalizing their schedule, but all events will take place in September in:' +
        SPECIAL_SYMBOLS.NEW_LINE +
        this.placesList +
        SPECIAL_SYMBOLS.NEW_LINE +
        SPECIAL_SYMBOLS.NEW_LINE +
        'Come take a look: ' + window.location.protocol + '//' + window.location.host + '/pg/heartland-tour',
    });
  }

  nominateYourBusinessEmail() {
    return this._buildMailToLink({
      to: 'info@growthfountain.com',
      subject: 'I\'d like to nominate my favorite business for The Heartland Tour',
      body: 'Here is the contact information for the business I\'d like to nominate! ' +
        'I understand that if I\'m the first to introduce this business and they list on GrowthFountain, I\'ll receive $500!' +
        SPECIAL_SYMBOLS.NEW_LINE + SPECIAL_SYMBOLS.NEW_LINE +
        'Come take a look: ' + window.location.protocol + '//' + window.location.host + '/pg/heartland-tour',
    });
  }

  rsvpToAttendInPersonEmail(place) {
    return this._buildMailToLink({
      to: 'info@growthfountain.com',
      subject: 'I\'m interested in attending one of your events!',
      body: 'Please send me details as you finalize the schedule for the Heartland Tour!' +
        SPECIAL_SYMBOLS.NEW_LINE + SPECIAL_SYMBOLS.NEW_LINE +
        'I am primarily interested in the event in ' + place + '. ' +
        SPECIAL_SYMBOLS.NEW_LINE + SPECIAL_SYMBOLS.NEW_LINE +
        'All events will take place in September in: ' + SPECIAL_SYMBOLS.NEW_LINE +
        this.placesList + SPECIAL_SYMBOLS.NEW_LINE + SPECIAL_SYMBOLS.NEW_LINE +
        'GrowthFountain\'s Heartland Tour: ' + window.location.protocol + '//' + window.location.host + '/pg/heartland-tour',
    });
  }

  confirmationMessage(network) {
    return this._format('confirmationMessage', {
      network,
    });
  }
}

module.exports = HeartlandInfoProvider;
