Game.prototype.states.play = function (game, params) {
    this.name = 'play';
    this.game = game;
    console.log('[play.js] creating play state');

    this.meshes = [];

    this.params = params;

    this.playerPosition = new THREE.Object3D();
    this.playerPosition.position.z -= 600;
    this.playerVelocity = new THREE.Vector3();

    // init trail
    this.trail = new game.Trail(game, null, this.playerPosition.position);
    this.meshes.push(this.trail.mesh);
    game.scene.add(this.trail.mesh);

    // init player sphere

    var sphereGeo = new THREE.SphereGeometry(1.0, 10, 10);
    var sphereMat = new THREE.MeshBasicMaterial({
        color: '#8DD1FF',
    });
    this.sphere = new THREE.Mesh(sphereGeo, sphereMat);
    game.scene.add(this.sphere);
    this.meshes.push(this.sphere);

    // init coins
    this.placeCoins(game, game.modelPoints[params.model]);

    // Opacity gradiant starting with the first coin being solid
    if (this.coins[0]) {
        this.advanceCoin(this.coins[0]);
    }

    // init player's light source

    this.light = game.light;
    game.scene.add(this.light);

    game.resetCamera();

    game.createControls(this.playerPosition.position);

    // face center
    game.camera.position.copy( this.playerPosition.position.clone().multiplyScalar(1.2) );

    this.initParticles();

    // init sounds
    this.burstSound = new Howl({
        src: ['sounds/level_up.ogg'],
        volume: 0.2,
    });
};

Game.prototype.states.play.prototype.update = function (game) {
    if (!game.controls.actions.holdPosition) {
        // update player position based on controls
        this.playerVelocity.add(game.controls.steering.velocityRequest.clone().multiplyScalar(1));
        this.playerPosition.position.add(this.playerVelocity);

        // move light
        this.light.position.copy(game.camera.position);

        // move sphere
        this.sphere.position.copy(this.playerPosition.position);

        // advance trail to player position
        this.trail.meshLine.advance(this.playerPosition.position);

        this.playerVelocity.set(0, 0, 0);
    }

    // check for coin collisions
    this.checkCoinCollisions();

    // update the coins
    this.updateCoins();

    this.particleGroup.tick( game.clockDelta );
};

Game.prototype.states.play.prototype.updateCoins = function playUpdateCoins() {
    for (var i = 0, l = this.coins.length; i < l; i++) {
        this.coins[i].update();
    }
};

Game.prototype.states.play.prototype.destroy = function (game) {
    console.log('[play.js] destroying play state');
    game.removeControls();
};

Game.prototype.states.play.prototype.checkCoinCollisions = function checkCoinCollisions() {
    var originPoint = this.playerPosition.position.clone();
    var vertices = this.sphere.geometry.vertices;

    // check three rays from sphere
    this.checkRay( originPoint, vertices[0] );
    this.checkRay( originPoint, vertices[Math.floor(vertices.length / 2)] );
    this.checkRay( originPoint, vertices[vertices.length - 1] );
};

Game.prototype.states.play.prototype.checkRay = function playCheckRay(originPoint, vertex) {
    var localVertex = vertex.clone();
    var globalVertex = localVertex.applyMatrix4( this.sphere.matrix );
    var directionVector = globalVertex.sub( this.sphere.position );

    var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize(), 0, 100 );
    var collisionResults = ray.intersectObjects( this.coinMeshes );
    if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
        var cmesh = collisionResults[0].object;

        if (cmesh.capturable && !cmesh.captured) {
            cmesh.captured = true;
            var position = cmesh.position.clone();

            this.burstSound.play();

            if (cmesh.coin.next) {
                // Advance the capture state and opacity to the next coins
                this.advanceCoin(cmesh.coin.next);
            }
            else {
                this.endLevel();
            }

            // trigger particle explosion
            this.particleBurst( position );
            console.log("[play.js] coin hit")
        }
    }
};

Game.prototype.states.play.prototype.endLevel = function () {
    this.game.setState('levelend', { playState: this });
};

Game.prototype.states.play.prototype.placeCoins = function (game, modelPoints) {

    // Find the angle between three points
    function angle(A, B, C) {
        var AB = B.clone().sub(A);
        var BC = C.clone().sub(B);
        return Math.acos( AB.dot(BC) / (AB.length() * BC.length()));
    }

    this.coins = [];
    this.coinMeshes = [];
    this.coinBalance = 0;
    this.coinBudget = 0.6;

    var posOne, coinOne;

    if (modelPoints.length > 3) {

        posOne = new THREE.Vector3( modelPoints[0], modelPoints[1], modelPoints[2] );
        var posTwo = new THREE.Vector3( modelPoints[3], modelPoints[4], modelPoints[5] );

        coinOne = this.addCoin(game, posOne, null);
        var coinTwo = this.addCoin(game, posTwo, coinOne);
        coinOne.mesh.lookAt(coinTwo.mesh.position);
        coinOne.mesh.rotateX(Math.PI/2);

        coinOne.next = coinTwo;

        for (var i = 6; i < modelPoints.length; i += 3) {
            var point         = new THREE.Vector3( modelPoints[i]   , modelPoints[i+1]   , modelPoints[i+2] );
            var prevPoint     = new THREE.Vector3( modelPoints[i-3] , modelPoints[i+1-3] , modelPoints[i+2-3] );
            var prevPrevPoint = new THREE.Vector3( modelPoints[i-6] , modelPoints[i+1-6] , modelPoints[i+2-6] );

            var prevCoin = this.coins[this.coins.length - 1];

            // if there are three points added so far, check
            this.coinBalance += Math.max(angle(point, prevPoint, prevPrevPoint), 0.1);
            if (this.coinBalance > this.coinBudget) {
                prevCoin.next = this.addCoin(game, point, prevCoin);
                console.log('[play.js] adding a coin');
                this.coinBalance = 0;
            }
        }
    }
    else if (modelPoints.length === 3) {
        // just add one coin
        posOne = new THREE.Vector3( modelPoints[0], modelPoints[1], modelPoints[2] );
        coinOne = this.addCoin(game, posOne, null);
        coinOne.mesh.rotateX(Math.PI/2);
    }
};

Game.prototype.states.play.prototype.addCoin = function (game, point, prevCoin) {
    var coin = new game.Coin(game);
    coin.mesh.position.copy(point);
    this.meshes.push(coin.mesh);
    game.scene.add(coin.mesh);

    if (prevCoin) {
        coin.mesh.lookAt(prevCoin.mesh.position);
        coin.mesh.rotateX(Math.PI/2);
    }

    this.coins.push(coin);
    this.coinMeshes.push(coin.mesh);

    return coin;
};

Game.prototype.states.play.prototype.initParticles = function playInitParticles() {

    // Initialize the particles for coin capture
    this.emitterSettings = {
        type: SPE.distributions.SPHERE,
        position: {
            spread: new THREE.Vector3(10),
            radius: 10,
        },
        velocity: {
            value: new THREE.Vector3(75)
        },
        size: {
            value: [10, 0]
        },
        opacity: {
            value: [1, 0]
        },
        color: {
            value: [new THREE.Color('purple'), new THREE.Color('white')],
            spread: new THREE.Vector3(20)
        },
        particleCount: 50,
        alive: true,
        duration: 0.07,
        maxAge: {
            value: 0.6
        }
    };

    this.particleGroup = new SPE.Group({
        maxParticleCount: 500,
        texture: {
            value: new THREE.TextureLoader().load('textures/smokeparticle.png')
        },
        blending: THREE.AdditiveBlending
    });

    this.particleGroup.addPool( 5, this.emitterSettings, false );

    this.particleGroup.mesh.frustumCulled = false;
    this.particleGroup.mesh.renderOrder = -1;

    // Add particle group to scene.
    game.scene.add( this.particleGroup.mesh );
};

Game.prototype.states.play.prototype.particleBurst = function playParticleBurst(position) {
    this.particleGroup.triggerPoolEmitter( 1, position );
};

Game.prototype.states.play.prototype.advanceCoin = function playAdvanceCoin(startCoin) {
    startCoin.material.opacity = 1;
    startCoin.mesh.capturable = true;

    var nextCoin = startCoin.next;

    if (nextCoin) {
        for (var i = 4; i < 10; i++) {
            nextCoin.material.opacity = 1 - ( i * 0.1 );

            if (nextCoin.next) {
                nextCoin = nextCoin.next;
            }
            else {
                break;
            }
        }
    }
};
