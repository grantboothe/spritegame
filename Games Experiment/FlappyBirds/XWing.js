var VaderSprite;
var topCoralSprite;
var backgroundSprite;
var foregroundPosition;
var foregroundSprite;
var bottomCoralSprite;
var okButtonSprite;


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

    topCoralSprite = new Sprite(img, 534, 377, 8, 130);
    bottomCoralSprite = new Sprite(img, 534, 520, 8, 134);
    backgroundSprite = new Sprite(img, 530, 0, 500, 300);
    foregroundSprite = new Sprite(img, 536, 316, 464, 39);
    okButtonSprite = new Sprite(img, 0, 53, 156, 131);
}
