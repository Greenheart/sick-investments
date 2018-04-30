class Game {
    constructor (stocks) {
        this.player = new Player(this)
        this.ui = this.getDOMReferences()
        this.stocks = Stock.loadAll(this, stocks)
        this.bindUI()
    }

    start () {
        this.showAllStocks()
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
