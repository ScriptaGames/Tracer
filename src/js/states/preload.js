Game.prototype.states.preload = function (game) {
    this.name = 'preload';
    this.game = game;
    console.log('[preload.js] creating preload state');

    this.pending = 0;

    this.fontLoader = new THREE.FontLoader();
    this.textureLoader = new THREE.TextureLoader();
    this.jsonLoader = new THREE.JSONLoader();

    // this.preloadModelPoints('models/monkey.json'        , 'level6'    , 5);
    this.preloadModelPoints('models/LeePerrySmith.json' , 'level4'    , 5);
    this.preloadModelPoints('models/football.json'      , 'level3'    , 5);
    // this.preloadModelPoints('models/cube.json'          , 'level3'    , 6);
    this.preloadModelPoints('models/cone.json'          , 'level2'    , 6);
    this.preloadModelPoints('models/line.json'          , 'level1'    , 9);
    this.preloadModelPoints('models/onepoint.json'      , 'level0'    , 1);
    this.preloadModelPoints('models/empty.json'         , 'empty'     , 1);

    this.preloadModelPoints('models/tracer1.json'       , 'tracer1'   , 0.7);
    this.preloadModelPoints('models/tracer2.json'       , 'tracer2'   , 1.0);
    this.preloadModelPoints('models/happyface.json'     , 'happyface' , 1);

    this.preloadTexture('textures/stroke.png', 'trailStroke');
    this.preloadTexture('textures/wall.jpg', 'wallTexture');
    this.preloadTexture('textures/ceiling.png', 'ceilingTexture');
    this.preloadTexture('textures/floor.jpg', 'floorTexture');
    this.preloadTexture('textures/coin.png', 'coinTexture');

    this.preloadTemplate('templates/main.html', 'main');

    this.preloadFont('fonts/helvetiker_regular.typeface.json', 'titleFont');

    this.checkPending();
};

Game.prototype.states.preload.prototype.update = function (game) {
};

Game.prototype.states.preload.prototype.destroy = function (game) {
    // when preload is done, init the UI
    game.initUI();
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

Game.prototype.states.preload.prototype.preloadTemplate = function (templateFile, templateName, scale) {
    this.addPending();
    fetch(templateFile).then(function (res) { return res.text(); }).then(function (template) {
        this.game.registerTemplate(templateName, template);
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
