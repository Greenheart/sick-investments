class Stock {
    constructor (game, config) {
        this.game = game
        this.id = config.id
        this.name = config.name
        this.price = config.price

        // UI components
        this.viewComponent = this.createViewComponent()
        this.priceText = this.viewComponent.querySelector('.price')
        this.amountText = this.viewComponent.querySelector('.amount')
        this.totalCost = this.viewComponent.querySelector('.total-cost')
        this.sign = this.viewComponent.querySelector('.sign')
        this.valueChange = this.viewComponent.querySelector('.value-change')
        this.buyButton = this.viewComponent.querySelector('[data-action="buy"]')
        this.sellButton = this.viewComponent.querySelector('[data-action="sell"]')
    }

    update () {
        // TODO: Update price
    }

    show () {
        // TODO: Hide data by default when there's nothing to display.
        const shares = this.game.player.shares[this.id]
        this.priceText.innerText = this.price
        if (shares) {
            this.amountText.innerText = shares.amount
            this.totalCost.innerText = shares.totalCost
            // TODO: Update `valueChange` and `sign` later.
            // const currentValue = shares.amount * this.price
            // this.valueChange.innerText = shares.transactions.length ? currentValue - shares.totalCost : ''
        }

        this.updateButtons(shares)
    }

    updateButtons (shares) {
        if (this.game.player.balance >= this.price) {
            Helpers.enable(this.buyButton)
        } else {
            Helpers.disable(this.buyButton)
        }

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

        // Cache stock instances to easily iterate over them.
        // This property `stocks.all` is not enumerable, meaning it won't show up in loops or Object.keys().
        // Since these are references to the actual stock instances, they automatically stay updated.
        Object.defineProperty(stocks, 'all', { value: Object.values(stocks) })

        return stocks
    }
}
