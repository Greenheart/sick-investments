class Game {
    constructor (stocks) {
        this.player = new Player(this)
        this.ui = this.getDOMReferences()
        this.stocks = Stock.loadAll(this, stocks)
    }

    start () {

    }

    bindUI () {
        // TODO: Bind UI to handle events.
        // Add generic event handlers to handle stock interactions.
        // This way, individual stocks don't need their own listeners.
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
