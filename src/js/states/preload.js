Game.prototype.states.preload = function (game) {
    this.name = 'preload';
    this.game = game;
    console.log('[preload.js] creating preload state');

    this.pending = 0;

    this.fontLoader = new THREE.FontLoader();

    this.preloadFont('fonts/helvetiker_regular.typeface.json', 'titleFont');

    this.checkPending();
};

Game.prototype.states.preload.prototype.update = function (game) {
};

Game.prototype.states.preload.prototype.destroy = function (game) {
    console.log('[preload.js] destroying preload state');
};

// custom preloading functions

Game.prototype.states.preload.prototype.preloadFont = function (fontFile, fontName) {
    this.addPending();
    this.fontLoader.load('fonts/helvetiker_regular.typeface.json', function (font) {
        this.game.registerFont(fontName, font);
        this.resolvePending();
    }.bind(this));
};

Game.prototype.states.preload.prototype.addPending = function () {
    this.pending++;
};

Game.prototype.states.preload.prototype.resolvePending = function () {
    this.pending--;
    this.checkPending();
};

Game.prototype.states.preload.prototype.checkPending = function () {
    if (this.pending === 0) {
        console.log('[preload.js] preload complete, switching state');
        this.game.setState('title');
    }
};
