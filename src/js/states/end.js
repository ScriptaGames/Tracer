Game.prototype.states.end = function end(game) {
    this.name = 'end';
    console.log('[end.js] creating end state');
};

Game.prototype.states.end.prototype.update = function titleUpdate(game) {

};

Game.prototype.states.end.prototype.destroy = function destroy(game) {
    console.log('[end.js] destroying end state');
};
