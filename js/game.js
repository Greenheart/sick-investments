class Game {
    constructor (stocks) {
        this.day = 1
        this.multipliers = [
            { text: 'x 1', value: 1 },
            { text: 'x 10', value: 10 },
            { text: 'x 100', value: 100 },
            { text: 'MAX' }
        ]
        this.multiplier = this.multipliers[0]
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

        this.ui.multiplier.innerText = this.multiplier.text
        this.ui.multiplier.addEventListener('click', () => this.toggleMultiplier())

        this.initializeRapidFire()
    }

    toggleMultiplier () {
        // Select the next multiplier by index, and start over from the beginning when necessary.
        const next = this.multipliers.findIndex(m => m.text === this.multiplier.text) + 1
        this.multiplier = this.multipliers[ next === this.multipliers.length ? 0 : next]

        this.updateMultiplierUI()
    }

    updateMultiplierUI () {
        this.ui.multiplier.innerText = this.multiplier.text
        this.stocks.all.forEach(s => s.updateMultiplier())
    }

    initializeRapidFire () {
        // Use arrow functions to bind the context of `this`.
        const rapidCallback = () => this.nextDay()
        const stopCallback = () => this.ui.nextDay.classList.remove('rapid-fire')
        const delay = 500
        const interval = 143 // 143 ms between each fire gives ~7 executions per second.

        RapidFire.onPointerEvent({
            target: this.ui.nextDay,
            rapidCallback,
            delay,
            interval,
            triggerCallback: () => this.nextDay()
        })
        RapidFire.onKeydown({
            key: ' ',
            rapidCallback,
            delay,
            interval,
            triggerCallback: () => {
                this.nextDay()
                this.ui.nextDay.classList.add('rapid-fire')
            },
            stopCallback
        })
    }

    getDOMReferences () {
        const find = document.querySelector.bind(document)
        return {
            templates: {
                stock: find('#stock-template')
            },
            stats: find('#stats'),
            stocks: find('#stocks'),
            nextDay: find('#next-day'),
            multiplier: find('#multiplier')
        }
    }
}
