var xWings;
var sabers;
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
    //sabers = new SabersCollection();
    loadGraphics();
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
            this.updatePlayingFish();
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
console.log(this.frame);
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

       // topSaberSprite.draw(renderingContext, 10, 10);
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
}

document.addEventListener(inputEvent, onpress);

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

  topSaberSprite.draw(renderingContext, 10, 10);
    backgroundSprite.draw(renderingContext, 0, 0);

   xWings.draw(renderingContext);
}

//find onpress. Copy that over and modify it.

/**
 * Called on mouse or touch press. Update and change state depending on current game state.
 * @param  {MouseEvent/TouchEvent} evt - the onpress event
 */
function onpress(evt) {

    switch (currentState) {

        case states.Splash: // Start the game and update the fish velocity.
            currentState = states.Game;
            fish.jump();

            break;

        case states.Game: // The game is in progress. Update fish velocity.
            fish.jump();
            break;

      /*  case states.Score: // Change from score to splash state if event within okButton bounding box
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
            */
    }
}

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
}