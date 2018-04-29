class Game {
    constructor (stocks) {
        this.player = new Player(this)
        this.ui = this.getDOMReferences()
        this.stocks = Stock.loadAll(this, stocks)
    }

    start () {

    }

    getDOMReferences () {
        const find = document.querySelector.bind(document)
        return {
            stats: find('#stats'),
            stocks: find('#stocks')
        }
    }
}
