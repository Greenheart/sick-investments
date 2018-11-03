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
    /**
     * Enable pointer events to trigger rapid fire for a target element.
     *
     * @param {HTMLElement} target - The element used to control rapid fire.
     * @param {function} rapidCallback - The function to call rapidly.
     * @param {number} delay - The delay (in ms) before rapid fire begins.
     * @param {number} interval - The time (in ms) between each call to rapidCallback.
     * @param {function} triggerCallback - Executed when the initial pointer event triggers rapid fire.
     */
    pointerRapidFire (target, rapidCallback, delay = 0, interval = 100, triggerCallback = null) {
        // The timeout that starts rapid fire. Used when aborting rapid fire before it's even started.
        let rapidFireTimeout = null
        // The interval that triggers rapid fire. Used to abort rapid fire.
        let rapidFire = null

        function startRapidFire () {
            // Only start one rapid fire interval at a time.
            if (!rapidFire) {
                rapidFire = window.setInterval(rapidCallback, interval)
            }
        }

        function stopRapidFire () {
            // Stop rapid fire before it's even started.
            if (rapidFireTimeout) {
                window.clearTimeout(rapidFireTimeout)
            }

            // Stop the active rapid fire interval.
            if (rapidFire) {
                window.clearInterval(rapidFire)
                rapidFire = null
            }
        }

        target.addEventListener('pointerdown', event => {
            if (triggerCallback) triggerCallback()
            rapidFireTimeout = window.setTimeout(startRapidFire, delay)
        })
        target.addEventListener('click', stopRapidFire)
        target.addEventListener('pointerout', stopRapidFire)
    },
    /**
     * Enable keydown events to trigger rapid fire for a callback.
     *
     * @param {string} key - The key used to control rapid fire. Expects a `KeyboardEvent.key` value.
     * @param {function} rapidCallback - The function to call rapidly.
     * @param {number} delay - The delay (in ms) before rapid fire begins.
     * @param {number} interval - The time (in ms) between each call to rapidCallback.
     * @param {function} triggerCallback - Executed when the initial event triggers rapid fire.
     * @param {EventTarget} target - The target element where rapid fire should be possible.
     */
    keydownRapidFire (key, rapidCallback, delay = 0, interval = 100, triggerCallback = null, target = window) {
        // The timeout that starts rapid fire. Used when aborting rapid fire before it's even started.
        let rapidFireTimeout = null
        // The interval that triggers rapid fire. Used to abort rapid fire.
        let rapidFire = null

        function startRapidFire () {
            // Only start one rapid fire interval at a time.
            if (!rapidFire) {
                rapidFire = window.setInterval(rapidCallback, interval)
            }
        }

        function stopRapidFire () {
            // Stop rapid fire before it's even started.
            if (rapidFireTimeout) {
                window.clearTimeout(rapidFireTimeout)
                rapidFireTimeout = null
            }

            // Stop the active rapid fire interval.
            if (rapidFire) {
                window.clearInterval(rapidFire)
                rapidFire = null
            }
        }

        target.addEventListener('keydown', event => {
            if (event.key === key) {
                if (!rapidFireTimeout) {
                    if (triggerCallback) triggerCallback(event)
                    rapidFireTimeout = window.setTimeout(startRapidFire, delay)
                }

                // Prevent spacebar from scrolling the page when held down.
                if (key === ' ') {
                    event.preventDefault()
                    return false
                }
            }
        })
        target.addEventListener('keyup', stopRapidFire)
    }
}
