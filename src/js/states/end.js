Game.prototype.states.title = function title(game) {
    this.name = 'title';
    console.log('[title.js] creating title state');

    this.geometry = new THREE.CylinderGeometry(200, 200, 20, 128);
    this.material = new THREE.MeshNormalMaterial();
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    game.scene.add(this.mesh);

    this.fakeTimer = 0;
};

Game.prototype.states.title.prototype.update = function titleUpdate(game) {
    this.mesh.rotation.z += 0.005;
    this.mesh.rotation.y += 0.01;

    this.fakeTimer++;
    if (this.fakeTimer > 600) {
        game.setState('end');
    }
};

Game.prototype.states.title.prototype.destroy = function destroy(game) {
    console.log('[title.js] destroying title state');
};
