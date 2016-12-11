Game.prototype.Trail = function (game) {
    this.game = game;
    this.origin = new THREE.Vector3(1);

    // Create the line material
    this.material = new THREE.MeshLineMaterial( {
        color: new THREE.Color( "#00cdfc" ),
        opacity: 1.0,
        useMap: false,
        // useMap: true,
        // map: game.textures.trailStroke,
        resolution: new THREE.Vector2( window.innerWidth, window.innerHeight ),
        sizeAttenuation: 1,
        lineWidth: 2.3,
        near: game.camera.near,
        far: game.camera.far,
        depthTest: true,
        depthWrite: true,
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
    this.meshLine.setGeometry(this.trail_geometry, function lineWidth(p) { return 1; });
    this.mesh = new THREE.Mesh(this.meshLine.geometry, this.material);
    this.mesh.frustumCulled = false;
};
