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
                id: stock.id,
                amount: 0,
                transactions: [],
                totalInvestment: 0
            }
        }
        // IDEA: Allow custom amounts other than 1.
        // Or use `player.pendingTransactions` to store temporary transactions until the day is over.
        // Then call player.finalizeTransactions() when the day is over to store actual transactions in `player.shares`
        const amount = 1

        this.shares[stock.id].amount += amount
        this.shares[stock.id].transactions.push(
            new Transaction(Transaction.BUY, stock.price, amount, this.game.day)
        )
        this.balance -= stock.price
        this.shares[stock.id].totalInvestment += stock.price
        console.log('BUY: ', this.shares[stock.id])
    }

    sell (stock) {
        if (this.shares[stock.id] && this.shares[stock.id].amount) {
            const amount = 1
            this.shares[stock.id].amount -= amount
            this.shares[stock.id].transactions.push(
                new Transaction(Transaction.SELL, stock.price, amount, this.game.day)
            )
            this.balance += stock.price
            this.shares[stock.id].totalInvestment -= stock.price
            console.log('SELL: ', this.shares[stock.id])
        }
    }
}
