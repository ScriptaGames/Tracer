Game.prototype.states.title = function (game) {
    this.name = 'title';
    console.log('[title.js] creating title state');

    this.geometry = new THREE.TextGeometry(
        'Tracer',
        {
            size: 40,
            height: 9,
            curveSegments : 1,
            font : game.fonts.titleFont,
            bevelEnabled : true,
            bevelThickness : 2,
            bevelSize : 1.5
        }
    );
    this.geometry.center();
    this.material = new THREE.MeshNormalMaterial();
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    game.scene.add(this.mesh);

    // Add the room cube
    var textureLoader = new THREE.TextureLoader();

    var wallTexture = textureLoader.load( '../textures/wall.jpg' );
    var ceilingTexture = textureLoader.load( '../textures/ceiling.png' );
    var floorTexture = textureLoader.load( '../textures/floor.jpg' );

    wallTexture.wrapS = wallTexture.wrapT = THREE.MirroredRepeatWrapping;
    wallTexture.repeat.set(6, 6);

    var wallMaterial = new THREE.MeshPhongMaterial({
        map: wallTexture,
        side: THREE.DoubleSide,
        shininess: 11,
    });
    var materials = [
        wallMaterial,
        wallMaterial,
        wallMaterial,
        wallMaterial,
        new THREE.MeshPhongMaterial( { map: ceilingTexture, side: THREE.DoubleSide } ),
        new THREE.MeshPhongMaterial( { map: floorTexture, side: THREE.DoubleSide } )
    ];
    var faceMaterial = new THREE.MeshFaceMaterial( materials );

    var geometry = new THREE.BoxGeometry( 1600, 1600, 1600 );
    var boxMesh = new THREE.Mesh( geometry, faceMaterial );

    game.scene.add(boxMesh);

    // add ambient light

    var ambientLight = new THREE.AmbientLight(0x404040);
    game.scene.add(ambientLight);

    //

    this.btn = document.createElement('button');
    this.btn.innerHTML = 'Play';
    this.btn.classList.add('play');
    this.btn.addEventListener('click', function () {
        game.setState('play');
    });
    document.body.appendChild(this.btn);
};

Game.prototype.states.title.prototype.update = function (game) {
    // this.mesh.rotation.y += 0.005;
};

Game.prototype.states.title.prototype.destroy = function (game) {
    console.log('[title.js] destroying title state');

    game.removeMesh(this.mesh);

    document.body.removeChild(this.btn);
};
