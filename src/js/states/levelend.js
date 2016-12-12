Game.prototype.states.levelend = function (game, params) {
    this.name = 'levelend';
    this.params = params;
    console.log('[levelend.js] creating levelend state');

    game.ui.set('congrats', game.ui.get('congratsMessages')[params.playState.params.levelNum]);
};

Game.prototype.states.levelend.prototype.update = function (game) {
    // update the coins
    this.params.playState.updateCoins();
    // update the particles
    this.params.playState.particleGroup.tick( game.clockDelta );
};

Game.prototype.states.levelend.prototype.destroy = function (game) {
    console.log('[levelend.js] destroying levelend state');

    game.scene.remove(this.params.playState.light);

    this.params.playState.meshes.forEach(game.removeMesh.bind(game));
};

Game.prototype.states.levelend.prototype.loadNextLevel = function playLoadNextLevel() {
    var levelNum = this.params.playState.params.levelNum + 1;

    var nextLevelKey = 'level' + levelNum;
    if (game.modelPoints[nextLevelKey]) {
        game.setState('play', { model: nextLevelKey, levelNum: levelNum });
    }
    else {
        game.setState('end');
    }
};
