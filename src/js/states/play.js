Game.prototype.states.play = function (game) {
    this.name = 'play';
    console.log('[play.js] creating play state');

    this.meshes = [];

    this.trail = new game.Trail(game);
    this.meshes.push(this.trail.mesh);
    game.scene.add(this.trail.mesh);

    game.createControls();
};

Game.prototype.states.play.prototype.update = function (game) {
};

Game.prototype.states.play.prototype.destroy = function (game) {
    console.log('[play.js] destroying play state');

    this.meshes.forEach(game.removeMesh.bind(game));

    game.removeControls();
};
