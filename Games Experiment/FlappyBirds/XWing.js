var VaderSprite;
var topCoralSprite;
var bottomCoralSprite;
var backgroundSprite;

function Sprite(img, x, y, width, height) {
    this.img = img;
    this.x = x * 2;
    this.y = y * 2;
    this.width = width * 2;
    this.height = height * 2;
}

Sprite.prototype.draw = function (renderingContext, x, y) {
    renderingContext.drawImage(this.img, this.x, this.y, this.width, this.height,
    x, y, this.width, this.height);
};

function initSprites(img) {
    VaderSprite = [
        new Sprite(img, 289, 0, 22, 32),
        new Sprite(img, 309, 0, 22, 32),
        new Sprite(img, 329, 0, 22, 32),
        new Sprite(img, 349, 0, 22, 32),
    ];


    
    topCoralSprite = new Sprite(img, 289, 0, 22, 32);
    //topCoralSprite = new Sprite(img, 540, 493, 20, 269);
    //bottomCoralSprite = new Sprite(img, 540, 350, 20, 269);
    bottomCoralSprite = new Sprite(img, 289, 0, 22, 32);



    backgroundSprite = new Sprite(img, 530, 0, 500, 300);
}


