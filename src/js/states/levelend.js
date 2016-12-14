Game.prototype.states.levelend = function (game, params) {
    this.name = 'levelend';
    this.params = params;
    console.log('[levelend.js] creating levelend state');

    game.camera.fov = 50;

    this.zoomout_complete = false;

    this.rotation = 0;

    this.lerpPct = 0.04;
    this.zoomOutVector = new THREE.Vector3(0, 100, 500);

    params.playState.light.position.set(1, 1, 1);

    game.ui.set('congrats', game.ui.get('congratsMessages')[params.playState.params.levelNum]);
};

Game.prototype.states.levelend.prototype.update = function (game) {
    // update the coins
    this.params.playState.updateCoins();
    // update the particles
    this.params.playState.particleGroup.tick( game.clockDelta );

    game.camera.up.set( lerp(game.camera.up.x, 0, this.lerpPct), lerp(game.camera.up.y, 1, this.lerpPct), lerp(game.camera.up.z, 0, this.lerpPct));

    if (!this.zoomout_complete && (Math.round(game.camera.position.y) != this.zoomOutVector.y || Math.round(game.camera.position.z) != this.zoomOutVector.z)) {
        game.camera.position.set( lerp(game.camera.position.x, this.zoomOutVector.x, this.lerpPct), lerp(game.camera.position.y, this.zoomOutVector.y, this.lerpPct), lerp(game.camera.position.z, this.zoomOutVector.z, this.lerpPct) );
    }
    else {
        if (!this.zoomout_complete) {
            this.zoomout_complete = true;
            this.distanceCenter = game.camera.position.distanceTo(new THREE.Vector3(1,1,1));
        }

        this.rotation += 0.008;
        game.camera.position.x = Math.sin( this.rotation ) * this.distanceCenter;
        game.camera.position.z = Math.cos( this.rotation ) * this.distanceCenter;

    }

    game.camera.lookAt(new THREE.Vector3(1,1,1));

    game.camera.updateProjectionMatrix();
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
