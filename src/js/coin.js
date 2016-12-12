Game.prototype.Coin = function (game) {
    this.game = game;

    // Create the line material
    this.material = new THREE.MeshPhongMaterial({
        transparent: true,
        opacity: 0.1,
        map: game.textures.coinTexture,
    });

    // Create the geometry
    this.geometry = new THREE.CylinderGeometry( 20, 20, 2, 32 );

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.captured = false;
    this.mesh.capturable = false;
    this.mesh.scale.set(0.5, 0.5, 0.5);

    this.update = function coinUpdate() {
        if (this.mesh.captured) {
            // the coin has been captured start animating the shrinkage
            var curScale = this.mesh.scale.x;
            if (curScale > 0.01) {
                var newScale = curScale - 0.1;
                if (newScale <= 0) {
                    newScale = 0.01;
                    this.mesh.visible = false;
                }
                this.mesh.scale.set(newScale, newScale, newScale);
            }
        }
    };

    this.mesh.coin = this; // reference to parent coin
};
