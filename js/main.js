document.addEventListener('DOMContentLoaded', event => {
    const game = new Game(window.stocks)

    window.DEBUG = true
    if (window.DEBUG) {
        // Expose game instance to aid debugging.
        window._game = game
    }

    game.start()
})
