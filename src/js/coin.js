Game.prototype.Coin = function (game) {
    this.game = game;

    // Create the line material
    this.material = new THREE.MeshNormalMaterial();

    // Create the geometry
    this.geometry = new THREE.CylinderGeometry( 20, 20, 5, 32 );

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.captured = false;

    this.update = function coinUpdate() {
        if (this.mesh.captured) {
            // the coin has been captured start animating the shrinkage
            var curScale = this.mesh.scale.x;
            if (curScale > 0.01) {
                var newScale = curScale - 0.1;
                if (newScale <= 0) {
                    newScale = 0.01;
                }
                this.mesh.scale.set(newScale, newScale, newScale);
            }
        }
    }
};
