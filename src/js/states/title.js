Game.prototype.states.title = function (game) {
    this.name = 'title';
    console.log('[title.js] creating title state');

    // widen fov to see the full room
    game.camera.fov = 85;
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
};

Game.prototype.states.title.prototype.update = function (game) {
    // game.setState('play');
};

Game.prototype.states.title.prototype.destroy = function (game) {
    console.log('[title.js] destroying title state');

    game.scene.remove(this.light);

    // widen fov to see the full room
    game.camera.fov = 50;
    game.camera.updateProjectionMatrix();
};
