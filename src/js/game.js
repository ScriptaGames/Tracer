var Game = function () {
    console.log('[game.js] constructing game');

    // begin with no state
    this.state = null;

    // global game clock
    this.clock = new THREE.Clock();

    // point light for re-use
    this.light = new THREE.PointLight(new THREE.Color(THREE.ColorKeywords.white), 1, 2000);

    // start lagscale at 1, assuming no lag
    this.lagScale = 1;

    // create empty 3d scene (also renderer & camera)
    this.createScene();

    // some objects to store preloaded assets
    this.textures = {};
    this.fonts = {};
    this.modelPoints = {};
    this.templates = {};

    // create some fake controls that do nothing, real controls are created by each state
    this.controls = {
        noopSteering : { update: _.noop },
    };
    this.controls.steering = this.controls.noopSteering;

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
    this.controls.steering.update( this.clockDelta );

    // run the update function for whatever state is active
    this.state.update(this);

    // render the frame
    this.renderer.render(this.scene, this.camera);
};

Game.prototype.states = {};
Game.prototype.setState = function (stateName, params) {
    // if we're already in a state, destroy it
    if (this.state) {
        this.state.destroy(game);
    }

    // if the UI has been initialized, let it know what state we're in too
    if (this.ui) {
        this.ui.set('state', stateName);
        this.ui.set('stateParams', params);
    }

    // reset controlls
    this.controls.steering = this.controls.noopSteering;

    // switch to new state!
    console.log('[game.js] setting state to ' + stateName);
    this.state = new this.states[stateName](this, params);
};

Game.prototype.resetCamera = function () {
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 400;
};

Game.prototype.createScene = function () {
    console.log('[game.js] creating scene');

    this.resetCamera();

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

Game.prototype.registerTexture = function (name, texture) {
    this.textures[name] = texture;
};

Game.prototype.registerModelPoints = function (name, modelPoints) {
    this.modelPoints[name] = modelPoints;
};

Game.prototype.registerFont = function (name, font) {
    this.fonts[name] = font;
};

Game.prototype.registerTemplate = function (name, template) {
    this.templates[name] = template;
};

Game.prototype.initUI = function () {
    // init the UI overlay
    this.ui = new Ractive({
        el: '.ui-container',
        data: {
            gameName: 'tracer',
            congratsMessages: _.shuffle([
                'Masterfully traced.',
                'A gold star for you.',
                'Picasso would be proud.',
                'Hey, wanna go finger paint?',
                'Can I hang that in my gallery?',
            ]),
            congrats: '',
        },
        template: this.templates.main,
    });
    this.ui.on('play-challenge', function () {
        this.setState('play', { model: 'level0', levelNum: 0 });
    }.bind(this));
    this.ui.on('play-free-draw', function () {
        this.setState('play', { model: 'empty' });
    }.bind(this));
    this.ui.on('replay-level', function () {
        this.setState('play', this.state.params.playState.params);
    }.bind(this));
    this.ui.on('next-level', function () {
        this.state.loadNextLevel();
    }.bind(this));
};

