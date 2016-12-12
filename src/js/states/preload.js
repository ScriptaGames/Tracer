Game.prototype.states.preload = function (game) {
    this.name = 'preload';
    this.game = game;
    console.log('[preload.js] creating preload state');

    this.pending = 0;

    this.fontLoader = new THREE.FontLoader();
    this.textureLoader = new THREE.TextureLoader();
    this.jsonLoader = new THREE.JSONLoader();

    this.preloadModelPoints('models/LeePerrySmith.json', 'LeePerrySmith', 5);
    this.preloadModelPoints('models/cone.json', 'cone', 6);
    this.preloadModelPoints('models/cube.json', 'cube', 6);
    this.preloadModelPoints('models/football.json', 'football', 5);
    this.preloadModelPoints('models/monkey.json', 'monkey', 1);

    this.preloadTexture('textures/stroke.png', 'trailStroke');
    this.preloadTexture('textures/wall.jpg', 'wallTexture');
    this.preloadTexture('textures/ceiling.png', 'ceilingTexture');
    this.preloadTexture('textures/floor.jpg', 'floorTexture');

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
    this.fontLoader.load(fontFile, function (font) {
        this.game.registerFont(fontName, font);
        this.resolvePending();
    }.bind(this));
};

Game.prototype.states.preload.prototype.preloadTexture = function (textureFile, textureName) {
    this.addPending();
    this.textureLoader.load(textureFile, function (texture) {
        this.game.registerTexture(textureName, texture);
        this.resolvePending();
    }.bind(this));
};

Game.prototype.states.preload.prototype.preloadModelPoints = function (modelPointsFile, modelPointsName, scale) {
    this.addPending();
    fetch(modelPointsFile).then(function (res) { return res.json(); }).then(function (modelPoints) {
        var typedArray = Float32Array.from(modelPoints);
        for (var i = 0; i < typedArray.length; ++i) {
            typedArray[i] *= scale;
        }
        this.game.registerModelPoints(modelPointsName, typedArray);
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
