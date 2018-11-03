class Game {
    constructor (stocks) {
        this.day = 1
        this.player = new Player(this)
        this.ui = this.getDOMReferences()
        this.stocks = Stock.loadAll(this, stocks)
        this.bindUI()
    }

    start () {
        this.updateUI()
    }

    nextDay () {
        this.day++
        this.stocks.all.forEach(s => s.updatePrice())
        this.updateUI()
    }

    showStats () {
        const values = {
            'day': this.day,
            'balance': this.player.balance
        }

        for (const stat of this.ui.stats.children) {
            stat.querySelector('.value').innerText = values[stat.dataset.value]
        }
    }

    showAllStocks () {
        this.stocks.all.forEach(s => s.show())
    }

    updateUI () {
        this.showAllStocks()
        this.showStats()
    }

    bindUI () {
        // Handle interactions with stock action buttons in a generic way.
        // This way, a single event listener is used.
        this.ui.stocks.addEventListener('click', event => {
            if (event.target.dataset.action) {
                const stockId = event.target.parentElement.parentElement.dataset.stockId
                // Trigger the correct handler for this action.
                this.player[event.target.dataset.action](this.stocks[stockId])
                this.updateUI()
            }
        })

        this.initializeRapidFire()
    }



// isStarting = false
// interval = null
// shouldStart = true


// on pointerdown
    // if not already running an interval && if not already starting interval
    // !interval running && shouldStart
        // queue new interval
        // isStarting = true

// when starting new interval
    // interval = new Interval()
    // isStarting = false

// on pointerup
    // if interval running
        // stop interval
        // shouldStart = true
    // if isStarting
        // shouldStart = false

// on pointerout
    // if interval running
        // stop interval
        // shouldStart = true
    // if isStarting
        // shouldStart = false

// Potentially, also add the following to allow rapidFire to reset state and work for multiple uses:

// on pointerenter (or similar to mouseenter)
    // if !interval running && !isStarting
        // shouldStart = true













    initializeRapidFire () {
        // The timeout that starts rapid fire. Used when aborting rapid fire before it's even started.
        let rapidFireTimeout = null
        // The interval that triggers rapid fire. Used to abort rapid fire.
        let rapidFire = null

        // Timings (ms)
        const delay = 500
        // 143 ms between each fire to give ~7 executions per second.
        const interval = 143

        const rapidFireCallback = () => this.nextDay()

        function startRapidFire () {
            if (!rapidFire) {
                rapidFire = window.setInterval(rapidFireCallback, interval)
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

        this.ui.nextDay.addEventListener('pointerdown', event => {
            this.nextDay()
            rapidFireTimeout = window.setTimeout(startRapidFire, delay)
        })
        this.ui.nextDay.addEventListener('click', stopRapidFire)
        this.ui.nextDay.addEventListener('pointerout', stopRapidFire)
    }

    getDOMReferences () {
        const find = document.querySelector.bind(document)
        return {
            templates: {
                stock: find('#stock-template')
            },
            stats: find('#stats'),
            stocks: find('#stocks'),
            nextDay: find('#next-day')
        }
    }
}
