class Stock {
    constructor (game, config) {
        this.game = game
        this.id = config.id
        this.price = config.price
    }

    static loadAll (game, configs) {
        const stocks = {}
        for (const stock of configs) {
            stocks[stock.id] = new Stock(game, stock)
        }
        return stocks
    }
}
