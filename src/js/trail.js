Game.prototype.Trail = function (game) {
    this.game = game;
    this.origin = new THREE.Vector3();
    this.material = new THREE.MeshLineMaterial( {
        useMap: 0,
        color: THREE.ColorKeywords.blue,
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
    var geometry = new THREE.Geometry();
    geometry.vertices.push(this.origin);
    geometry.vertices.push(this.origin);
    geometry.vertices.push(this.origin);
    geometry.vertices.push(this.origin);
    geometry.vertices.push(this.origin);
    geometry.vertices.push(this.origin);
    geometry.vertices.push(this.origin);
    geometry.vertices.push(this.origin);
    geometry.vertices.push(this.origin);
    geometry.vertices.push(this.origin);
    geometry.vertices.push(this.origin);
    geometry.vertices.push(this.origin);
    geometry.vertices.push(this.origin);
    this.meshLine = new THREE.MeshLine();
    this.meshLine.setGeometry(geometry, function (p) { return p; });
    this.mesh = new THREE.Mesh(this.meshLine.geometry, this.material);
};
