/*
    Menu creates a menu from a menu object with...
     background
     button.fill
     button.stroke
     button.width (optional)
     button.height (optional)
     menu.text.color
         .text.size
         .text.font
         .text.fillStyle
         .text.strokeStyle
         menu.buttons - this is a list of text to go on each button
         functionList - this is a list of functions to be assigned to occur when each button is pressed
     gap (optional)
    */
MyGame.menu = function Menu(menu){
    let that = {};
    let canvas = document.getElementById('canvas-main');

    let b = MyGame.graphics.Background(menu.background);

    let buttonsXY = [];
    let bgList = [];
    let textgList = [];
    let numOfButtons = menu.buttons.length;

    if (!menu.hasOwnProperty('gap')){
        menu.gap = canvas.height/(4*numOfButtons);
    }
    if (!menu.button.hasOwnProperty('width')){
        menu.button.width = 0.6 * canvas.width;
    }
    if (!menu.button.hasOwnProperty('height')){
        menu.button.height = canvas.height/(2*numOfButtons-1);
    }

    menu.button.y = (canvas.height - ((numOfButtons-1)*menu.gap + numOfButtons*menu.button.height))/2;
    menu.button.x = (canvas.width/2 - (menu.button.width/2));

    for (let i=0; i < menu.buttons.length; ++i){
        bgList.push(MyGame.graphics.Rectangle({
            x: menu.button.x,
            y: menu.button.y,
            rotation: 0,
            width: menu.button.width,
            height: menu.button.height,
            fillStyle: menu.button.fill,
            strokeStyle: menu.button.stroke
        }));
        buttonsXY.push({x: menu.button.x, y: menu.button.y});

        let newSpec = {
            text: menu.buttons[i],
            font: '' + menu.text.size + ' ' + menu.text.font,
            x: canvas.width/2,
            y: menu.button.y + menu.button.height/2,
            lineWidth: menu.text.lineWidth,
            fillStyle: menu.text.fillStyle,
            strokeStyle: menu.text.strokeStyle,
            align: 'center',
            baseline: 'middle'
        }

        textgList.push(MyGame.graphics.Letters(newSpec));
        menu.button.y += menu.gap + menu.button.height;
    }

    that.draw = function(){
        b.draw();
        for (let i=0; i<bgList.length; ++i){
            bgList[i].draw();
            textgList[i].draw();
        }
    };

    //This returns nothing if not on a button, and returns 1,2, ... i, depending on which button the coordinate is on.
    function isCoordinateOnButton(screenCoordinate){
        screenCoordinate.x -= canvas.offsetLeft;
        screenCoordinate.y -= canvas.offsetTop;
        let canvasCoordinate = {
            x: screenCoordinate.x * canvas.width/canvas.scrollWidth, 
            y: screenCoordinate.y * canvas.height/canvas.scrollHeight
        };
        if (canvasCoordinate.x > buttonsXY[0].x && canvasCoordinate.x < buttonsXY[0].x + menu.button.width ){
            for (let i=0; i < buttonsXY.length; ++i){
                if (canvasCoordinate.y > buttonsXY[i].y && canvasCoordinate.y < buttonsXY[i].y + menu.button.height){
                    return i + 1;
                }
            }
        }
    }

    //To be used when a click is detected on the canvas.
    that.menuSelection = function(e){
        let x = 0;
        let y = 0;
        //The following if/else statement from 
        // https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element
        if (e.x || e.y) { 
            x = e.x;
            y = e.y;
        } else { 
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
        } 

        let buttonId = isCoordinateOnButton({x: x, y: y});
        if (buttonId){
            menu.functionList[buttonId - 1]();
        }
    }

    return that;
}