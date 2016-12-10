Game.prototype.createControls = function () {
    console.log('[controls.js] creating controls');
    this.controls = new THREE.TrackballControls(this.camera, this.renderer.domElement);

    this.controls.staticMoving = true;
    this.controls.noZoom = false;
    this.controls.noPan = true;
    this.controls.dynamicDampingFactor = 0.0;
    this.controls.rotateSpeed = 0.3;
    // this.controls.target = player.view.mainSphere.position;
};

Game.prototype.removeControls = function () {
    console.log('[controls.js] removing controls');
    this.controls.dispose();
    this.controls = this.noopControls;
};
