Game.prototype.states.play = function (game) {
    this.name = 'play';
    console.log('[play.js] creating play state');

    this.meshes = [];

    this.playerPosition = new THREE.Object3D();
    this.playerVelocity = new THREE.Vector3();

    // init trail

    this.trail = new game.Trail(game);
    this.meshes.push(this.trail.mesh);
    game.scene.add(this.trail.mesh);

    // init player sphere

    var sphereGeo = new THREE.SphereGeometry(1.0, 10, 10);
    var sphereMat = new THREE.MeshBasicMaterial({
        color: '#00cdfc',
    });
    this.sphere = new THREE.Mesh(sphereGeo, sphereMat);
    game.scene.add(this.sphere);
    this.meshes.push(this.sphere);

    // init coins

    this.placeCoins(game);

    // init player's light source

    this.light = new THREE.PointLight(new THREE.Color(THREE.ColorKeywords.white), 1, 2000);
    game.scene.add(this.light);

    //

    game.createControls(this.playerPosition.position);

};

Game.prototype.states.play.prototype.update = function (game) {
    if (!game.controls.actions.holdPosition) {
        // update player position based on controls
        this.playerVelocity.add(game.controls.steering.velocityRequest.clone().multiplyScalar(1));
        this.playerPosition.position.add(this.playerVelocity);

        // move light
        this.light.position.copy(this.playerPosition.position);

        // move sphere
        this.sphere.position.copy(this.playerPosition.position);

        // advance trail to player position
        this.trail.meshLine.advance(this.playerPosition.position);

        // check for coin collisions
        this.checkCoinCollisions();

        this.playerVelocity.set(0, 0, 0);
    }
};

Game.prototype.states.play.prototype.destroy = function (game) {
    console.log('[play.js] destroying play state');

    game.scene.remove(this.light);

    this.meshes.forEach(game.removeMesh.bind(game));

    game.removeControls();
};

Game.prototype.states.play.prototype.checkCoinCollisions = function checkCoinCollisions() {
    var originPoint = this.playerPosition.position.clone();

    for (var vertexIndex = 0; vertexIndex < this.sphere.geometry.vertices.length; vertexIndex++)
    {
        var localVertex = this.sphere.geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4( this.sphere.matrix );
        var directionVector = globalVertex.sub( this.sphere.position );

        var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize(), 0, 100 );
        var collisionResults = ray.intersectObjects( this.coinMeshes );
        if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
            console.log(" Hit ");
    }
};

Game.prototype.states.play.prototype.placeCoins = function (game) {
    this.coins = [];
    this.coinMeshes = [];
    for (var i = 1; i < 100; i++) {
        var coin = new game.Coin(game);
        coin.mesh.position.x = _.random(-500, 500);
        coin.mesh.position.y = _.random(-500, 500);
        coin.mesh.position.z = _.random(-500, 500);
        this.meshes.push(coin.mesh);
        game.scene.add(coin.mesh);

        if (this.meshes[i-1]) {
            coin.mesh.lookAt(this.meshes[i-1].position);
        }

        this.coins.push(coin);
        this.coinMeshes.push(coin.mesh);
    }
};
