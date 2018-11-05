class Player {
    constructor (game) {
        this.game = game
        this.balance = 100
        this.shares = {}
    }

    buy (stock) {
        if (!this.shares[stock.id]) {
            // IDEA: Maybe refactor as a `Share` class and keep an instance instead of a loose object.
            // This could also allow custom logic to be broken out of the player class.
            this.shares[stock.id] = {
                stockId: stock.id,
                amount: 0,
                transactions: [],
                totalInvestment: 0,
                profit: 0
            }
        }
        const shares = this.shares[stock.id]
        // IDEA: Allow custom amounts other than 1.
        // Or use `player.pendingTransactions` to store temporary transactions until the day is over.
        // Then call player.finalizeTransactions() when the day is over to store actual transactions in `player.shares`
        const buyMultiplier = this.getBuyMultiplier(stock)

        shares.amount += buyMultiplier
        shares.transactions.push(
            new Transaction(Transaction.BUY, stock.price, buyMultiplier, this.game.day)
        )
        this.balance = Helpers.precisionRound(this.balance - stock.price * buyMultiplier, 1)
        shares.totalInvestment = Helpers.precisionRound(shares.totalInvestment + stock.price * buyMultiplier, 1)
        console.log('BUY: ', shares)
    }

    sell (stock) {
        const shares = this.shares[stock.id]
        if (shares && shares.amount) {
            const sellMultiplier = this.getSellMultiplier(stock)

            shares.amount -= sellMultiplier
            shares.transactions.push(
                new Transaction(Transaction.SELL, stock.price, sellMultiplier, this.game.day)
            )
            this.balance = Helpers.precisionRound(this.balance + stock.price * sellMultiplier, 1)
            // TODO: Avoid investment from going below 0.
            shares.totalInvestment = Helpers.precisionRound(shares.totalInvestment - stock.price * sellMultiplier, 1)
            console.log('SELL: ', shares)
        }
    }

    getMaxBuyAmount (stock) {
        return Math.floor(this.balance / stock.price)
    }

    getMaxSellAmount (stock) {
        const shares = this.shares[stock.id]
        return shares ? shares.amount : 0
    }

    getBuyMultiplier (stock) {
        const x = this.game.multiplier.value
        return (x === 'MAX') ? this.getMaxBuyAmount(stock) : x
    }

    getSellMultiplier (stock) {
        const x = this.game.multiplier.value
        return (x === 'MAX') ? this.getMaxSellAmount(stock) : x
    }

    updateProfit (shares, stock) {
        const profit = this.getTotalShareValue(shares, stock) - shares.totalInvestment
        this.shares[stock.id].profit = Helpers.precisionRound(profit, 1)
    }

    getTotalShareValue (shares, stock) {
        return Helpers.precisionRound(shares.amount * stock.price, 1)
    }
}
