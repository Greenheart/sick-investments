class Stock {
    constructor (game, config) {
        this.game = game
        this.id = config.id
        this.name = config.name
        this.price = config.price

        // The stock stability affect the rate of price changes.
        // Low stability -> rapid price changes. High stability -> slow price changes.
        // Integer between 1 and 10. Default value from stock config, but changing over time.
        this.stability = config.stability

        // The stock hype acts as a multiplier for the price changes (both good and bad).
        // Hype builds up over time, increasing when the stock is doing well and decreasing otherwise.
        // High hype -> big price changes. Low hype -> small price changes
        // Integer between 1 and 10, randomized at the start, but changing over time.
        this.hype = this.getHype()

        // The prospect
        this.prospect = this.getProspect()

        // IDEA: Keep track of how the stock has been doing, saving all daily results and price changes.
        this.results = {
            today: null,
            yesterday: null
        }

        // UI components
        this.viewComponent = this.createViewComponent()
        this.priceText = this.viewComponent.querySelector('.price')
        this.amountText = this.viewComponent.querySelector('.amount')
        this.totalInvestment = this.viewComponent.querySelector('.total-investment')
        this.sign = this.viewComponent.querySelector('.sign')
        this.profit = this.viewComponent.querySelector('.profit')
        this.buyButton = this.viewComponent.querySelector('[data-action="buy"]')
        this.buyMultiplier = this.buyButton.querySelector('.multiplier')
        this.sellButton = this.viewComponent.querySelector('[data-action="sell"]')
        this.sellMultiplier = this.sellButton.querySelector('.multiplier')
    }

    updatePrice () {
        const result = this.getDailyResult()
        const diff = (this.prospect - result) / this.stability
        const percent = Helpers.precisionRound(diff * 100, 1) + ' %'

        // TODO: Update price
        // See if the daily result was within the daily prospect
        // if so, price goes up
        // else, price goes down

        // A prospect of 0.7 means that the result has to be <= 0.7 if the day should be successful.
        if (result <= this.prospect) {
            console.log(this.id, '   -   SUCCESS    -   ', percent)
        } else {
            console.log(this.id, '   -   FAIL    -   ', percent)
        }

        const changeFactor = 1 + diff
        console.log(this.price, changeFactor)
        this.price = Helpers.precisionRound(this.price * changeFactor, 1)
        console.log(this.price)
        this.nextDay()
    }

    updateMultiplierText () {
        // TODO: Combine this with this.updateButtons() in some way.

        const multiplier = this.game.multiplier.value
        const buyTexts = {
            '1': '',
            '10': '10',
            '100': '100',
            'MAX': () => this.game.player.getMaxBuyAmount(this) || ''
        }

        const sellTexts = {
            '1': '',
            '10': '10',
            '100': '100',
            'MAX': 'All'
        }

        this.buyMultiplier.innerText = Helpers.getDynamicValue(buyTexts, multiplier)
        this.sellMultiplier.innerText = Helpers.getDynamicValue(sellTexts, multiplier)
    }

    update () {
        const shares = this.game.player.shares[this.id]
        if (shares) {
            this.game.player.updateProfit(shares, this)
        }
    }

    nextDay () {
        this.prospect = this.getProspect()
    }

    getDailyResult () {
        return Math.random()
    }

    getHype () {
        return Helpers.randomInt(1, 10)

        // TODO: Calculate the hype based on how well the stock is doing.
        // If the stock price increased despite bad `stock.prospect`, hype increase more.
        // If the stock price decreased despite good `stock.prospect`, hype decrease more.
        // if (this.hype) {
        //
        // } else {
        //     return Helpers.randomInt(1, 10)
        // }
    }

    getProspect () {
        // TODO: Calculate the chance of success
        return Math.random()
    }

    show () {
        // Ensure latest data is used.
        this.update()

        // TODO: Hide data by default when there's nothing to display.
        const shares = this.game.player.shares[this.id]
        this.priceText.innerText = this.price
        if (shares) {
            this.amountText.innerText = shares.amount
            this.totalInvestment.innerText = shares.totalInvestment
            this.profit.innerText = shares.profit
            // TODO: Update `profit` and `sign` later.
            // const currentValue = shares.amount * this.price
            // this.profit.innerText = shares.transactions.length ? currentValue - shares.totalInvestment : ''
        }

        this.updateMultiplierText()
        this.updateButtons(shares)
    }

    updateButtons (shares) {
        // Check that the player can buy the amount set by the current multiplier.
        const buyMultiplier = this.game.player.getBuyMultiplier(this)
        const sellMultiplier = this.game.player.getSellMultiplier(this)

        // TODO: disable if any multiplier === 0
        if (buyMultiplier && this.game.player.balance >= this.price * buyMultiplier) {
            Helpers.enable(this.buyButton)
        } else {
            Helpers.disable(this.buyButton)
        }

        if (shares && shares.amount >= sellMultiplier) {
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

        // Append before changing attribute data since `container` is  DocumentFragment and not a DOMElement
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
