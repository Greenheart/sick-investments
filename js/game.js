class Game {
    constructor (stocks) {
        this.day = 1
        this.player = new Player(this)
        this.ui = this.getDOMReferences()
        this.stocks = Stock.loadAll(this, stocks)
        this.bindUI()
    }

    start () {
        this.showAllStocks()
        this.showStats()
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

    bindUI () {
        // Handle interactions with stock action buttons in a generic way.
        // This way, a single event listener is used.
        this.ui.stocks.addEventListener('click', event => {
            if (event.target.dataset.action) {
                const stockId = event.target.parentElement.parentElement.dataset.stockId
                // Trigger the correct handler for this action.
                this.player[event.target.dataset.action](this.stocks[stockId])
                this.showAllStocks()
                this.showStats()
            }
        })

        // Bind button#next-day to the space-key.
    }

    getDOMReferences () {
        const find = document.querySelector.bind(document)
        return {
            templates: {
                stock: find('#stock-template')
            },
            stats: find('#stats'),
            stocks: find('#stocks')
        }
    }
}
