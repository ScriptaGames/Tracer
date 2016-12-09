var game;

if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
}
else {
    game = new Game();
    game.setState('preload');
}
