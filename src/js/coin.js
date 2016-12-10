Game.prototype.Coin = function (game) {
    this.game = game;

    // Create the line material
    this.material = new THREE.MeshNormalMaterial();

    // Create the geometry
    this.combinedGeometry = new THREE.Geometry();
    this.frontGeometry = new THREE.CylinderGeometry( 20, 20, 5, 32 );
    var frontMesh = new THREE.Mesh( this.frontGeometry );

    this.backGeometry = new THREE.CylinderGeometry( 20, 20, 5, 32 );
    var backMesh = new THREE.Mesh( this.backGeometry );
    backMesh.position.y += 5;

    THREE.GeometryUtils.merge(this.combinedGeometry, frontMesh);
    THREE.GeometryUtils.merge(this.combinedGeometry, backMesh);

    this.mesh = new THREE.Mesh(this.combinedGeometry, this.material);

};
