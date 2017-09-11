let e = require('consts/usaStates.json').USA_STATES_FULL;

Object.defineProperties(e, {

    getFullState: {
        enumerable: false,
        value: function (abbr) {
            for (let i = 0; i < this.length; i++) {
                if (this[i].abbreviation.toLowerCase() === abbr.toLowerCase()) {
                    return this[i].name;
                }
            }
            return null;
        }
    },

    getShortState: {
        enumerable: false,
        value: function (fullState) {
            for (let i = 0; i < this.length; i++) {
                if (this[i].name.toLowerCase() === fullState.toLowerCase()) {
                    return this[i].abbreviation;
                }
            }
            return null;
        }
    }

});

module.exports = e;
