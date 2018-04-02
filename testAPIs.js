MyGame.main = (function (input, graphics, particleSystem) {
    let previousTime = performance.now();

    let mouse = input.Mouse();
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
        functionList: [
            function(){console.log('Clicked New Game')}, 
            function(){console.log('Clicked Key Bindings')}, 
            function(){console.log('Clicked High Scores')}, 
            function(){console.log('Clicked Join Game')}, 
            function(){console.log('Clicked h')},
            function(){console.log('Clicked a')},
            function(){console.log('Clicked \'\'')}
        ],
        //gap: 100
    }

    let menu = MyGame.menu(menuSpec);

    mouse.registerMouseReleasedHandler(menu.menuSelection);

    let particleSpec = {
        drawUsing: graphics.Texture,
        x: 0,
        y: 0,
        xMax: 1600,
        yMax: 0,
        particlesPerSec: 10,
        // fill: color.red,
        // lineWidth: 1,
        // stroke: color.black,
        imageSrc: 'assets/snow.png',
        rotationMax: 1,
        lifetime: {mean: 10000, std: 100},
        speed: {mean: 100, std: 0},
        size: {mean: 20, std: 5},
        gravity: 0,
        limitY: 1,
        limitX: 0,
        // duration: 200,
    }

    particleSystem.ParticleEffect(particleSpec);

    let particleSpec2 = {
        drawUsing: graphics.Rectangle,
        x: 600,
        y: 100,
        // xMax: 850,
        // yMax: 550,
        particlesPerSec: 50,
        fill: color.white,
        lineWidth: 1,
        stroke: color.green,
        // imageSrc: 'flame.png',
        rotationMax: 2,
        lifetime: {mean: 1000, std: 100},
        speed: {mean: 100, std: 50},
        size: {mean: 50, std: 1},
        gravity: 1,
        // duration: 100,
        disappear: true
    }

    particleSystem.ParticleEffect(particleSpec2);
 
    let particleSpec3 = {
        drawUsing: graphics.Rectangle,
        x: 625,
        y: 100,
        // xMax: 850,
        // yMax: 550,
        particlesPerSec: 20,
        fill: color.green,
        lineWidth: 1,
        // stroke: color.green,
        // imageSrc: 'bubble1b.png',
        rotationMax: 1,
        lifetime: {mean: 500, std: 100},
        speed: {mean: 200, std: 10},
        size: {mean: 50, std: 1},
        gravity: 1,
        // onTop: true,
        disappear: true,
        // duration: 10000,
    }

    particleSystem.ParticleEffect(particleSpec3);

    //-----------------------------------------------------
    //
    //                  Actual Game Loop
    //
    //-----------------------------------------------------

    function update(elapsedTime) {
        particleSystem.update(elapsedTime);

    }

    function processInput(elapsedTime) {
    }

    function render() {
        graphics.clear();
        // particleSystem.draw();
        menu.draw();
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

})(MyGame.input, MyGame.graphics, MyGame.particleSystem);
