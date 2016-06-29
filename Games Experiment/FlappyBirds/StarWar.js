var xWings;
var corals;
var currentState;
var renderingContext;
var frames = 0;

var width;
var height;

var states = {
    Splash: 0,
    Game: 1,
    Score: 2
};

function main() {
    windowSetUp();
    canvasSetUp();
    currentState = states.Splash;
    document.body.appendChild(canvas);
    xWings = new XWings();
    corals = new CoralCollection();
    loadGraphics();
}





function CoralCollection() {
    this._corals = [];

    /**
     * Empty corals array
     */
    this.reset = function () {
        this._corals = [];
    };

    /**
     * Creates and adds a new Coral to the game.
     */
    this.add = function () {
        this._corals.push(new Coral()); // Create and push coral to array
    };

    /**
     * Update the position of existing corals and add new corals when necessary.
     */
    this.update = function () {
        if (frames % 100 === 0) { // Add a new coral to the game every 100 frames.
            this.add();
        }

        for (var i = 0, len = this._corals.length; i < len; i++) { // Iterate through the array of corals and update each.
            var coral = this._corals[i]; // The current coral.

            if (i === 0) { // If this is the leftmost coral, it is the only coral that the fish can collide with . . .
                coral.detectCollision(); // . . . so, determine if the fish has collided with this leftmost coral.
            }

            coral.x -= 2; // Each frame, move each coral two pixels to the left. Higher/lower values change the movement speed.
            if (coral.x < -coral.width) { // If the coral has moved off screen . . .
                this._corals.splice(i, 1); // . . . remove it.
                i--;
                len--;
            }
        }
    };

    /**
     * Draw all corals to canvas context.
     */
    this.draw = function () {
        for (var i = 0, len = this._corals.length; i < len; i++) {
            var coral = this._corals[i];
            coral.draw();
        }
    };
}

/**
 * The Coral class. Creates instances of Coral.
 */
function Coral() {
    this.x = 500;
    this.y = height - (bottomCoralSprite.height  + 120 + 200 * Math.random());
    this.width = bottomCoralSprite.width;
    this.height = bottomCoralSprite.height;

    /**
     * Determines if the fish has collided with the Coral.
     * Calculates x/y difference and use normal vector length calculation to determine
     */
    this.detectCollision = function () {
        // intersection
        var cx = Math.min(Math.max(xWings.x, this.x), this.x + this.width);
        var cy1 = Math.min(Math.max(xWings.y, this.y), this.y + this.height);
        var cy2 = Math.min(Math.max(xWings.y, this.y + this.height + 110), this.y + 2 * this.height + 80);
        // Closest difference
        var dx = xWings.x - cx;
        var dy1 = xWings.y - cy1;
        var dy2 = xWings.y - cy2;
        // Vector length
        var d1 = dx * dx + dy1 * dy1;
        var d2 = dx * dx + dy2 * dy2;
        var r = xWings.radius * xWings.radius;
        // Determine intersection
        if (r > d1 || r > d2) {
            currentState = states.Score;
        }
    };

    this.draw = function () {
        bottomCoralSprite.draw(renderingContext, this.x, this.y);
        topCoralSprite.draw(renderingContext, this.x, this.y + 110 + this.height);
    }
}



























function XWings() {
    this.x = 140;
    this.y = 100;

    this.frame = 0;
    this.velocity = 0;
    this.animation = [0,1, 0];

    this.rotation = 0;
    this.radius = 12;

    this.gravity = 0.25;
    this._jump = 4.6;

    this.jump = function () {
        this.animation = [0, 1, 2, 1];
    };

    this.update = function () {
        var n = currentState === states.Splash ? 10 : 5;

        this.frame += frames % n === 0 ? 1 : 0;
        this.frame %= this.animation.length;

        if (currentState === states.Splash) {
             this.updateIdleFish();
        } else { // Game state
          //  this.updatePlayingFish();
        }
    };

    this.updateIdleFish = function () {
        this.y = height - 280 + 5 * Math.cos(frames / 10);
        this.rotation = 0;
    };

    this.draw = function (renderingContext) {
        renderingContext.save();

        renderingContext.translate(this.x, this.y);
        renderingContext.rotate(this.rotation);

        var n = this.animation[this.frame];

        VaderSprite[n].draw(renderingContext, -VaderSprite[n].width, -VaderSprite[n].height);
        renderingContext.restore();

    };
};

function loadGraphics() {
    var img = new Image();
    img.src = "vader.png";
    img.onload = function () {
        initSprites(this);
       renderingContext.fillStyle = backgroundSprite.color;
       renderingContext.fillRect(0, 0, width, height);

       // topSaberSprite.draw(renderingContext);
        //backgroundSprite.draw(renderingContext, backgroundSprite.width, height - backgroundSprite.height);
        //fishSprite[0].draw(renderingContext, 5, 5, 142, 50);

    /*okButton = {
        x: (width - okButtonSprite.width) / 2,
        y: height - 200,
        width: okButtonSprite.width,
        height: okButtonSprite.height
    };*/

        gameLoop();
    };
};

function windowSetUp() {
    width = window.innerWidth;
    height = window.innerHeight;
    var inputEvent = "touchstart";
    if (width >= 500){
        width = 900;
        height = 600;
        inputEvent = "mousedown";
    }
    document.addEventListener(inputEvent, onpress);
}



function canvasSetUp() {
    canvas = document.createElement("canvas");
    canvas.style.border = "15px solid #382b1d";
    canvas.width = width;
    canvas.height = height;
    renderingContext = canvas.getContext("2d");
}

function gameLoop(){
    update();
    render();
    window.requestAnimationFrame(gameLoop);
}

function update() {
    frames++;

    /*if (currentState !== states.Score){
        foregroundPosition = (foregroundPosition - 2) % 14;
    }

    if (currentState === states.Game){
        corals.update();
    }*/

    xWings.update();
}

//draws everything
function render() {
   renderingContext.fillRect(0, 0, width, height);

    corals.draw(renderingContext);
    backgroundSprite.draw(renderingContext, 0, 0);

   xWings.draw(renderingContext);
}

//find onpress. Copy that over and modify it.

/**
 * Called on mouse or touch press. Update and change state depending on current game state.
 * @param  {MouseEvent/TouchEvent} evt - the onpress event
 */
/*function onpress(evt) {

    switch (currentState) {

        case states.Splash: // Start the game and update the fish velocity.
            currentState = states.Game;
            fish.jump();

            break;

        case states.Game: // The game is in progress. Update fish velocity.
            fish.jump();
            break;

        case states.Score: // Change from score to splash state if event within okButton bounding box
            // Get event position
            var mouseX = evt.offsetX, mouseY = evt.offsetY;

            if (mouseX == null || mouseY == null) {
                mouseX = evt.touches[0].clientX;
                mouseY = evt.touches[0].clientY;
            }

            // Check if within the okButton
            if (okButton.x < mouseX && mouseX < okButton.x + okButton.width &&
                okButton.y < mouseY && mouseY < okButton.y + okButton.height
            ) {
                //console.log('click');
                corals.reset();
                currentState = states.Splash;
                score = 0;
            }
            break;
            
    }
}*/

var inputEvent = "touchstart";
if (width >= 700) {
    width = 500;
    height = 640;
    inputEvent = "mousedown";
}

// Background Graphics
var img = new Image();
img.src

function onpress(evt) {
    switch (currentState) {

        case states.Splash: // Start the game and update the fish velocity.
            currentState = states.Game;
            xWings.jump();
            break;

        case states.Game: // The game is in progress. Update fish velocity.
            xWings.jump();
            break;

        case states.Score: // Change from score to splash state if event within okButton bounding box
            // Get event position
            var mouseX = evt.offsetX, mouseY = evt.offsetY;

            if (mouseX == null || mouseY == null) {
                mouseX = evt.touches[0].clientX;
                mouseY = evt.touches[0].clientY;
            }

            // Check if within the okButton
            if (okButton.x < mouseX && mouseX < okButton.x + okButton.width &&
                okButton.y < mouseY && mouseY < okButton.y + okButton.height
            ) {
                //console.log('click');
                corals.reset();
                currentState = states.Splash;
                score = 0;
            }
            break;
    }
}

