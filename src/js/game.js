var Game = function () {
    console.log('[game.js] constructing game');

    // begin with no state
    this.state = null;

    // global game clock
    this.clock = new THREE.Clock();

    // start lagscale at 1, assuming no lag
    this.lagScale = 1;

    // create empty 3d scene (also renderer & camera)
    this.createScene();

    // somewhere to store 3D fonts
    this.fonts = {};

    // create some fake controls that do nothing, real controls are created by each state
    this.noopControls = { update: _.noop };
    this.controls = this.noopControls;

    // start update loop
    requestAnimationFrame(this.update.bind(this));
};

Game.prototype.update = function () {
    // continue update loop
    requestAnimationFrame(this.update.bind(this));

    // update the clock delta and lag scale
    this.clockDelta = this.clock.getDelta();
    this.lagScale = lerp(this.lagScale, this.clockDelta / .01666666666, 0.9);

    // update the control system
    this.controls.update( this.clockDelta );

    // run the update function for whatever state is active
    this.state.update(this);

    // render the frame
    this.renderer.render(this.scene, this.camera);
};

Game.prototype.states = {};
Game.prototype.setState = function (stateName) {
    // if we're already in a state, destroy it
    if (this.state) {
        this.state.destroy(game);
    }

    // switch to new state!
    console.log('[game.js] setting state to ' + stateName);
    this.state = new this.states[stateName](this);
};

Game.prototype.createScene = function () {
    console.log('[game.js] creating scene');

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 400;

    this.container = document.querySelector('.game-container');
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({
        antialias: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(THREE.ColorKeywords.whitesmoke);

    // add canvas to DOM
    document.body.appendChild(this.renderer.domElement);

    // set renderer size
    this.updateViewportSize();
    window.addEventListener('resize', this.updateViewportSize.bind(this));
};

Game.prototype.updateViewportSize = function () {
    // update renderer size
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // update camera aspect
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
};

Game.prototype.removeMesh = function (mesh) {
    this.scene.remove(mesh);
    if (mesh.geometry) {
        mesh.geometry.dispose();
    }
    if (mesh.material) {
        if (mesh.material.uniforms && mesh.material.uniforms.texture) {
            mesh.material.uniforms.texture.value.dispose();
        }
        mesh.material.dispose();
    }

};

Game.prototype.registerFont = function (name, font) {
    this.fonts[name] = font;
};
