Game.prototype.Trail = function (game, points, origin, width) {
    this.game = game;
    this.origin = origin ? origin.clone() : new THREE.Vector3(1);
    this.length = points ? points.length/3 : 18000;

    // Create the line material
    this.material = new THREE.MeshLineMaterial( {
        // color: new THREE.Color( "#00cdfc" ),
        opacity: 1.0,
        // useMap: false,
        useMap: true,
        map: game.textures.trailStroke,
        // resolution: new THREE.Vector2( window.innerWidth, window.innerHeight ),
        resolution: new THREE.Vector2(0.2, 1),
        sizeAttenuation: 1,
        lineWidth: width || 0.5,
        near: game.camera.near,
        far: game.camera.far,
        depthTest: true,
        depthWrite: true,
        blending: THREE.AdditiveBlending,
        transparent: false,
        side: THREE.FrontSide,
        visibility: 1,
    });

    // Create the line geometry used for storing verticies
    this.trail_geometry = new THREE.Geometry();
    if (points) {
        // apply points to geometry
        for (var i = 0; i < points.length; i += 3) {
            this.trail_geometry.vertices.push(new THREE.Vector3(
                points[i],
                points[i+1],
                points[i+2]
            ));
        }
    }
    else {
        // generate a certain number of points
        for (var i = 0; i < this.length; i++) {
            // must initialize it to the number of positions it will keep or it will throw an error
            this.trail_geometry.vertices.push(this.origin.clone());
        }
    }

    this.meshLine = new THREE.MeshLine();
    this.meshLine.setGeometry(this.trail_geometry, function lineWidth(p) { return 1; });
    this.mesh = new THREE.Mesh(this.meshLine.geometry, this.material);
    this.mesh.frustumCulled = false;
};
