Game.prototype.states.title = function (game) {
    this.name = 'title';
    console.log('[title.js] creating title state');

    // widen fov to see the full room
    game.camera.fov = 100;
    game.camera.updateProjectionMatrix();

    // Add the room cube
    var textureLoader = new THREE.TextureLoader();

    // tile wall texture
    game.textures.wallTexture.wrapS = game.textures.wallTexture.wrapT = THREE.MirroredRepeatWrapping;
    game.textures.wallTexture.repeat.set(12, 12);

    // tile floor texture
    game.textures.floorTexture.wrapS = game.textures.floorTexture.wrapT = THREE.MirroredRepeatWrapping;
    game.textures.floorTexture.repeat.set(12, 12);

    var wallMaterial = new THREE.MeshPhongMaterial({
        map: game.textures.wallTexture,
        side: THREE.DoubleSide,
        shininess: 11,
    });
    var materials = [
        wallMaterial,
        wallMaterial,
        new THREE.MeshPhongMaterial( { map: game.textures.ceilingTexture, side: THREE.DoubleSide } ),
        new THREE.MeshPhongMaterial( { map: game.textures.floorTexture, side: THREE.DoubleSide } ),
        wallMaterial,
        wallMaterial,
    ];
    var faceMaterial = new THREE.MeshFaceMaterial( materials );

    var geometry = new THREE.BoxGeometry( 1600, 1600, 1600 );
    var boxMesh = new THREE.Mesh( geometry, faceMaterial );

    game.scene.add(boxMesh);

    // add ambient light

    var ambientLight = new THREE.AmbientLight(0x404040);
    game.scene.add(ambientLight);
    this.light = game.light;
    game.scene.add(this.light);

    // trace name of game
    // copy the name's typed array and set all points to first point
    this.titleTextFake = new game.Trail(game, game.modelPoints.tracer2, new THREE.Vector3());
    this.titleTextFake.mesh.geometry.center();

    this.titleTextIndex = 0;
    this.titleTextNextPoint = new THREE.Vector3();

    var textStartPoint = new THREE.Vector3(game.modelPoints.tracer2[0], game.modelPoints.tracer2[1], game.modelPoints.tracer2[2]);
    this.titleText = new game.Trail(game, undefined, textStartPoint, 1);
    this.titleText.mesh.position.y = 580;
    this.titleText.mesh.position.z = -200;
    this.titleText.mesh.position.x = -800;
    this.titleText.mesh.rotateX(Math.PI);
    this.titleText.mesh.rotateY(Math.PI/14);
    game.scene.add(this.titleText.mesh);
};

Game.prototype.states.title.prototype.update = function (game) {
    for (var i = 0; i < 16; i++) {
        this.updateTitle();
    }
};

Game.prototype.states.title.prototype.updateTitle = function () {
    this.titleTextIndex += 3;
    if (this.titleTextFake.meshLine.positions[this.titleTextIndex]) {
        this.titleTextNextPoint.set(this.titleTextFake.meshLine.positions[this.titleTextIndex], this.titleTextFake.meshLine.positions[this.titleTextIndex+1], this.titleTextFake.meshLine.positions[this.titleTextIndex+2] );
        this.titleText.meshLine.advance(this.titleTextNextPoint);
    }
};

Game.prototype.states.title.prototype.destroy = function (game) {
    console.log('[title.js] destroying title state');

    game.scene.remove(this.light);
    game.removeMesh(this.titleText.mesh);

    // widen fov to see the full room
    game.camera.fov = 50;
    game.camera.updateProjectionMatrix();
};
