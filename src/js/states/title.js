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

    var texture0 = textureLoader.load( '../textures/wall1.png' );
    var texture1 = textureLoader.load( '../textures/wall2.png' );
    var texture2 = textureLoader.load( '../textures/ceiling.png' );
    var texture3 = textureLoader.load( '../textures/floor.jpg' );
    var texture4 = textureLoader.load( '../textures/wall3.png' );
    var texture5 = textureLoader.load( '../textures/wall4.png' );

    var materials = [
        new THREE.MeshBasicMaterial( { map: texture0, side: THREE.DoubleSide } ),
        new THREE.MeshBasicMaterial( { map: texture1, side: THREE.DoubleSide } ),
        new THREE.MeshBasicMaterial( { map: texture2, side: THREE.DoubleSide } ),
        new THREE.MeshBasicMaterial( { map: texture3, side: THREE.DoubleSide } ),
        new THREE.MeshBasicMaterial( { map: texture4, side: THREE.DoubleSide } ),
        new THREE.MeshBasicMaterial( { map: texture5, side: THREE.DoubleSide } )
    ];
    var faceMaterial = new THREE.MeshFaceMaterial( materials );

    var geometry = new THREE.BoxGeometry( 1600, 1600, 1600 );
    var boxMesh = new THREE.Mesh( geometry, faceMaterial );

    game.scene.add(boxMesh);

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
