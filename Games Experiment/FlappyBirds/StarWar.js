var xWings;
var corals;
var currentState;
var renderingContext;
var myScore = 0;
var foregroundPosition = 0;
var frames = 0;
var okButton;

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


    this.reset = function () {
        this._corals = [];
    };


    this.add = function () {
        this._corals.push(new Coral());
    };


    this.update = function () {
        if (frames % 100 === 0) {
            this.add();
        }

        for (var i = 0, len = this._corals.length; i < len; i++) {
            var coral = this._corals[i];

            if (i === 0) {
                coral.detectCollision();
                coral.score();
            }

            coral.x -= 2;
            if (coral.x < -coral.width) {
                this._corals.splice(i, 1);
                i--;
                len--;
            }
        }
    };

    this.draw = function () {
        for (var i = 0, len = this._corals.length; i < len; i++) {
            var coral = this._corals[i];
            coral.draw();
        }
    };
}

function Coral() {
    this.x = 500;
    this.y = height - (bottomCoralSprite.height  + 120 + 200 * Math.random());
    this.width = bottomCoralSprite.width;
    this.height = bottomCoralSprite.height;
    this.scored = false;

    this.detectCollision = function () {
        var cx = Math.min(Math.max(xWings.x, this.x), this.x + this.width);
        var cy1 = Math.min(Math.max(xWings.y, this.y), this.y + this.height);
        var cy2 = Math.min(Math.max(xWings.y, this.y + this.height + 110), this.y + 2 * this.height + 80);
        var dx = xWings.x - cx;
        var dy1 = xWings.y - cy1;
        var dy2 = xWings.y - cy2;
        var d1 = dx * dx + dy1 * dy1;
        var d2 = dx * dx + dy2 * dy2;
        var r = xWings.radius * xWings.radius;
        if (r > d1 || r > d2) {
            currentState = states.Score;
        }
    };

    this.score = function () {
        if(this.x + this.width < xWings.x && !this.scored){
            updatescore();
            this.scored = true;
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
    this.scored = false;



        this.jump = function () {
            this.velocity = -this._jump;
        };


    this.update = function () {
        var n = currentState === states.Splash ? 10 : 5;

        this.frame += frames % n === 0 ? 1 : 0;
        this.frame %= this.animation.length;

        if (currentState === states.Splash) {
             this.updateIdleFish();
        } else {
            this.updatePlayingFish();
        }
    };

    this.updateIdleFish = function () {
        this.y = height - 280 + 5 * Math.cos(frames / 10);
        this.rotation = 0;
    };

    this.updatePlayingFish = function () {
        this.velocity += this.gravity;
        this.y += this.velocity;

        if (this.y >= height - foregroundSprite.height - 10) {
            this.y = height - foregroundSprite.height - 10;

            if (currentState === states.Game) {
                currentState = states.Score;
            }

            this.velocity = this._jump;
        }

        if (this.y <= 2) {
            currentState = states.Score;
        }

        if (this.velocity >= this._jump) {
            this.frame = 1;
            this.rotation = Math.min(Math.PI / 2, this.rotation + 0.3);
        } else {
            this.rotation = -0.3;
        }
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

    okButton = {
        x: (width - okButtonSprite.width) / 2,
        y: height - 200,
        width: okButtonSprite.width,
        height: okButtonSprite.height
    };

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

    if (currentState !== states.Score){
        foregroundPosition = (foregroundPosition - 2) % 425;
    }

    if (currentState === states.Game){
        corals.update();
    }

    xWings.update();
}

//draws everything
function render() {
   renderingContext.fillRect(0, 0, width, height);

    corals.draw(renderingContext);
    backgroundSprite.draw(renderingContext, 0, 0);
    foregroundSprite.draw(renderingContext, 250, 250);

   xWings.draw(renderingContext);
}

function onpress(evt) {

    switch (currentState) {

        case states.Splash:
            currentState = states.Game;
            xWings.jump();

            break;

        case states.Game:
            xWings.jump();
            break;

        case states.Score:
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
                if(localStorage.highscore === null || myScore > localStorage.highscore){
                    localStorage.setItem("highscore", myScore);
                }
                myScore = 0;
                document.getElementById("thehighscore").innerHTML = localStorage.highscore;
                document.getElementById("displayScore").innerHTML = myScore;
            }
            
    }
}

function render() {
    // Draw background color
    renderingContext.fillRect(0, 0, width, height);

    // Draw background sprites
    backgroundSprite.draw(renderingContext, 0, height - backgroundSprite.height);
    backgroundSprite.draw(renderingContext, backgroundSprite.width, height - backgroundSprite.height);

    corals.draw(renderingContext);
    xWings.draw(renderingContext);

    if (currentState === states.Score || currentState === states.Splash) {
        okButtonSprite.draw(renderingContext, okButton.x, okButton.y);
    }


    // Draw foreground sprites
    foregroundSprite.draw(renderingContext, foregroundPosition, height - foregroundSprite.height);
    foregroundSprite.draw(renderingContext, foregroundPosition + foregroundSprite.width, height - foregroundSprite.height);
}

function updatescore(){
    myScore++;
    document.getElementById("displayScore").innerHTML = myScore;
    return;
}