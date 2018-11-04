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
            nextDay: find('#next-day')
        }
    }
}
