Game.prototype.states.title = function (game) {
    this.name = 'title';
    console.log('[title.js] creating title state');

    this.geometry = new THREE.TextGeometry(
        'Tracer',
        {
            size: 40,
            height: 9,
            curveSegments : 1,
            font : game.fonts.titleFont,
            bevelEnabled : true,
            bevelThickness : 2,
            bevelSize : 1.5
        }
    );
    this.geometry.center();
    this.material = new THREE.MeshNormalMaterial();
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    game.scene.add(this.mesh);

    this.btn = document.createElement('button');
    this.btn.innerHTML = 'Play';
    this.btn.classList.add('play');
    this.btn.addEventListener('click', function () {
        game.setState('play');
    });
    document.body.appendChild(this.btn);
};

Game.prototype.states.title.prototype.update = function (game) {
    // this.mesh.rotation.y += 0.005;
};

Game.prototype.states.title.prototype.destroy = function (game) {
    console.log('[title.js] destroying title state');

    game.removeMesh(this.mesh);


    document.body.removeChild(this.btn);
};
