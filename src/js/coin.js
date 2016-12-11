Game.prototype.Coin = function (game) {
    this.game = game;

    // Create the line material
    this.material = new THREE.MeshNormalMaterial();

    // Create the geometry
    this.geometry = new THREE.CylinderGeometry( 20, 20, 5, 32 );

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.handleCollision = function coinHandleCollision(playerPosition) {

    };
};
