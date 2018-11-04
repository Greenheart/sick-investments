const Helpers = {
    enable (element) {
        element.removeAttribute('disabled')
    },
    disable (element) {
        element.setAttribute('disabled', 'disabled')
    },
    randomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    },
    precisionRound (number, precision) {
        // Round a floating point number to a given precision
        // If precision < 0, the number of significant digits will decrease by `precision`.
        // If precision > 0, `precision` defines the number of decimals to be kept.

        // This method uses scaling to avoid issues with floating point numbers in JS.
        // Credit: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round#A_better_solution
        return Helpers.shift(Math.round(Helpers.shift(number, precision, false)), precision, true)
    },
    shift (number, precision, reverseShift) {
        if (reverseShift) precision = -precision
        const numArray = ('' + number).split('e')
        return +(numArray[0] + 'e' + (numArray[1] ? (+numArray[1] + precision) : precision))
    },
    /** Get a value for a key in an object, even if it's returned dynamically from a function.
     *
     * This allows dictionaries with mixed static and dynamic values.
     *
     * @param {object} o - The object that either contains static values or functions to generate dynamic values.
     * @param {string} key - The key where to find the value.
     */
    getDynamicValue (o, key) {
        if (typeof o[key] === 'function') {
            return o[key]()
        }

        return o[key]
    }
}
