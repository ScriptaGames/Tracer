Game.prototype.states.play = function (game) {
    this.name = 'play';
    console.log('[play.js] creating play state');

    this.meshes = [];

    game.createControls();
};

Game.prototype.states.play.prototype.update = function (game) {
};

Game.prototype.states.play.prototype.destroy = function (game) {
    console.log('[play.js] destroying play state');

    this.meshes.forEach(game.removeMesh.bind(game));

    game.removeControls();
};
