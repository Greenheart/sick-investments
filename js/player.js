class Player {
    constructor (game) {
        this.game = game
        this.day = 1
        this.money = 100
        this.shares = {}
    }

    buy (stock) {
        if (!this.shares[stock.id]) {
            this.shares[stock.id] = {
                id: stock.id,
                amount: 0
            }
        }
        this.shares[stock.id].amount++
        console.log('BUY: ', this.shares[stock.id])
    }

    sell (stock) {
        if (this.shares[stock.id] && this.shares[stock.id].amount) {
            this.shares[stock.id].amount--
            console.log('SELL: ', this.shares[stock.id])
        }
    }
}
