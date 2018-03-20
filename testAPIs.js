MyGame.main = (function (graphics, input, particles, persistence) {
    let previousTime = performance.now();

    let keyboard = input.Keyboard();

    let menuSpec = {
        background: '',
        button: {
            fill: color.addAlpha(color.red, .8),
            stroke: 'rgba(0, 150, 255, 1)',
            //width: 900,
            //height: 150,
        },
        text: {
            size: '4em',
            font: 'Courier',
            fillStyle: 'rgba(0, 200, 0, 1)',
            strokeStyle: 'rgba(0, 150, 0, 1)',
            lineWidth: 3
        },
        buttons: ['New Game', 'Key Bindings', 'High Scores', 'Join Game', 'h', 'a', ''],
        //gap: 100
    }

    let menuGraphic = graphics.Menu(menuSpec);

    let text = {
        text: 'hello',
        size: '2em',
        font: 'Courier',
        fillStyle: 'rgba(0, 100, 0, 1)',
        strokeStyle: 'rgba(0, 100, 0, 1)',
        align: 'center',
        baseline: 'bottom',
        lineWidth: 3,
        x: 100,
        y: 100
    }

    let letters = graphics.Letters(text);

    //-----------------------------------------------------
    //
    //                  Actual Game Loop
    //
    //-----------------------------------------------------

    function update(elapsedTime) {

}

function processInput(elapsedTime) {
    keyboard.processInput(elapsedTime);
}

function render() {
    graphics.clear();
    menuGraphic.draw();
}

function gameLoop(time) {
    let elapsedTime = time - previousTime;
    previousTime = time;

    processInput(elapsedTime);
    update(elapsedTime);
    render();
    requestAnimationFrame(gameLoop);
}

console.log('game initializing...');
requestAnimationFrame(gameLoop);

}) (MyGame.graphics, MyGame.input, MyGame.particles, MyGame.persistence);
