Game.prototype.states.play = function (game) {
    this.name = 'play';
    console.log('[play.js] creating play state');

    this.meshes = [];

    this.playerPosition = new THREE.Object3D();
    this.playerVelocity = new THREE.Vector3();

    this.trail = new game.Trail(game);
    this.meshes.push(this.trail.mesh);
    game.scene.add(this.trail.mesh);

    // Add the coins
    for (var i = 1; i < 11; i++) {
        var coin = new game.Coin(game);
        coin.mesh.position.y += (i * 30);
        this.meshes.push(coin.mesh);
        game.scene.add(coin.mesh);
    }

    game.createControls(this.playerPosition.position);

};

Game.prototype.states.play.prototype.update = function (game) {
    // update player position based on controls
    this.playerVelocity.add(game.controls.velocityRequest.clone().multiplyScalar(1));

    this.playerPosition.position.add(this.playerVelocity);

    // advance trail to player position
    this.trail.meshLine.advance(this.playerPosition.position);

    this.playerVelocity.set(0, 0, 0);
};

Game.prototype.states.play.prototype.destroy = function (game) {
    console.log('[play.js] destroying play state');

    this.meshes.forEach(game.removeMesh.bind(game));

    game.removeControls();
};
