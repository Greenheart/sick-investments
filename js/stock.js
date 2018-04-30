class Stock {
    constructor (game, config) {
        this.game = game
        this.id = config.id
        this.name = config.name
        this.price = config.price

        // UI components
        this.viewComponent = this.createViewComponent()
        this.priceText = this.viewComponent.querySelector('.price')
        this.buyButton = this.viewComponent.querySelector('[data-action="buy"]')
        this.sellButton = this.viewComponent.querySelector('[data-action="sell"]')
    }

    show () {
        this.priceText.innerText = this.price

        if (this.game.player.money >= this.price) {
            Helpers.enable(this.buyButton)
        } else {
            Helpers.disable(this.buyButton)
        }

        const shares = this.game.player.shares[this.id]
        if (shares && shares.amount) {
            Helpers.enable(this.sellButton)
        } else {
            Helpers.disable(this.sellButton)
        }
    }

    createViewComponent () {
        const template = this.game.ui.templates.stock
        const container = document.importNode(template.content, true)
        container.querySelector('h3').innerText = this.name
        container.querySelector('.price').innerText = this.price
        this.game.ui.stocks.appendChild(container)

        // Append before changing attribute data since `continer` is  DocumentFragment and not a DOMElement
        const stock = this.game.ui.stocks.lastElementChild
        stock.setAttribute('data-stock-id', this.id)
        return stock
    }

    static loadAll (game, configs) {
        const stocks = {}
        for (const stock of configs) {
            stocks[stock.id] = new Stock(game, stock)
        }
        return stocks
    }
}
