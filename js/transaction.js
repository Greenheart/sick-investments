class Transaction {
    constructor (type, price, amount, day) {
        this.type = type
        this.amount = amount
        this.price = price
        this.totalValue = price * amount
        this.day = day
    }
}

// Transaction types
Transaction.BUY = 'BUY'
Transaction.SELL = 'SELL'
