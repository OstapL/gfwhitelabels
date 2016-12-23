module.exports = require('consts/usaStates.json');

Object.defineProperties(module.exports, {

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