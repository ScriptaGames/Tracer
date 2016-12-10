Game.prototype.Trail = function (game) {
    this.game = game;
    this.origin = new THREE.Vector3(1);

    // Create the line material
    this.material = new THREE.MeshLineMaterial( {
        color: new THREE.Color( "rgb(255, 2, 2)" ),
        opacity: 1,
        resolution: new THREE.Vector2( window.innerWidth, window.innerHeight ),
        sizeAttenuation: 1,
        lineWidth: 0.3,
        near: game.camera.near,
        far: game.camera.far,
        depthTest: true,
        blending: THREE.AdditiveBlending,
        transparent: false,
        side: THREE.DoubleSide,
        visibility: 1,
    });

    // Create the line geometry used for storing verticies
    this.trail_geometry = new THREE.Geometry();
    for (var i = 0; i < 18000; i++) {
        // must initialize it to the number of positions it will keep or it will throw an error
        this.trail_geometry.vertices.push(this.origin.clone());
    }

    this.meshLine = new THREE.MeshLine();
    this.meshLine.setGeometry(this.trail_geometry, function (p) { return p; });
    this.mesh = new THREE.Mesh(this.meshLine.geometry, this.material);
};
