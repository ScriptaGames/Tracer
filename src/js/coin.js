Game.prototype.Coin = function (game) {
    this.game = game;

    // state
    this.frontHit = false;
    this.backHit = false;

    // Create the line material
    this.material = new THREE.MeshNormalMaterial();

    // Create the geometry
    this.combinedGeometry = new THREE.Geometry();
    this.frontGeometry = new THREE.CylinderGeometry( 20, 20, 5, 32 );
    this.frontMesh = new THREE.Mesh( this.frontGeometry );

    this.backGeometry = new THREE.CylinderGeometry( 20, 20, 5, 32 );
    this.backMesh = new THREE.Mesh( this.backGeometry );
    this.backMesh.position.y += 5;

    THREE.GeometryUtils.merge(this.combinedGeometry, this.frontMesh);
    THREE.GeometryUtils.merge(this.combinedGeometry, this.backMesh);

    this.mesh = new THREE.Mesh(this.combinedGeometry, this.material);

};
