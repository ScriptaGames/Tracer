Game.prototype.createControls = function (target) {
    console.log('[controls.js] creating controls');

    // init steering

    this.controls.steering = new THREE.TrackballControls(this.camera, this.renderer.domElement);

    this.controls.steering.maxDistance = 100;
    this.controls.steering.minDistance = 100;
    this.controls.steering.staticMoving = false;
    this.controls.steering.noZoom = false;
    this.controls.steering.noPan = true;
    this.controls.steering.dynamicDampingFactor = 0.0;
    this.controls.steering.rotateSpeed = 0.3;
    this.controls.steering.target = target;

    // whether certain actions are active or not, based on controls

    this.controls.actions = {
        holdPosition: false,
    };

    // init keyboard listeners

    this.controls.keyListener = new keypress.Listener();
    this.controls.keyListener.register_many([
        {
            keys: 's',
            prevent_default: true,
            prevent_repeat: true,
            on_keydown: function () {
                console.log('holdPosition start');
                this.controls.actions.holdPosition = true;
            }.bind(this),
            on_keyup: function () {
                console.log('holdPosition end');
                this.controls.actions.holdPosition = false;
            }.bind(this),
        },
    ]);

    // init mouse listeners

    this.controls.mouseListener = {
        mousedown: function (ev) {
            // right mouse
            if (ev.button === 2) {
                this.controls.actions.holdPosition = true;
            }
        }.bind(this),
        mouseup: function (ev) {
            // right mouse
            if (ev.button === 2) {
                this.controls.actions.holdPosition = false;
            }
        }.bind(this),
    };
    _.each(this.controls.mouseListener, _.ary(_.flip(document.addEventListener.bind(document)), 2));
    document.addEventListener('contextmenu', function () { return false; });
};

Game.prototype.removeControls = function () {
    console.log('[controls.js] removing controls');
    this.controls.steering.dispose();
    this.controls.steering = this.controls.noopControls;
    this.controls.keyListener.reset();
};
