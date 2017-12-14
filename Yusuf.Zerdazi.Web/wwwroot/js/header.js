var yoff = 0.0;        // 2nd dimension of perlin noise
var isOverCircle;
var Y_AXIS = 1;
var X_AXIS = 2;
var leftColour = [255, 255, 255];
var rightColour = [255, 255, 255];
var bgColour = [255, 255, 255];
var imgUrl = window.location.origin + "/images/tile_centre_small.png";
var mainUrl = window.location.origin + "/images/tile_main_small.png";
var joinUrl = window.location.origin + "/images/tile_join_small.png";

if (window.location.href.includes("everydays")) {
    bgColour = (0, 0);
}

function setup() {
    canvas = createCanvas($('body').innerWidth(), 150);

    img = loadImage(imgUrl);
    mainImg = loadImage(mainUrl);
    joinImg = loadImage(joinUrl);
    canvas.parent('header_wave');

    img_map = {
        0: mainImg,
        1: joinImg,
    }
}

function magnitude(x) {
    var half = width / 2;
    return (x - half) * (x - half)/400000;
}



var width_map = {
    0: 150,
    1: 23.33
}

function drawTiledImage() {
    var x = width / 2 - 75;
    var img_enum = 0;
    image(img, x, 0, 150, 150);
    x += width_map[img_enum] - 1;
    while (x < width) {
        image(img_map[img_enum], x, 0, width_map[img_enum], 150);
        x += width_map[img_enum] - 1;
        img_enum = (img_enum + 1) % 2
    }

    var x = width / 2 - 224;
    var img_enum = 0;
    while (x + width_map[img_enum] > -width) {
        image(img_map[img_enum], x, 0, width_map[img_enum], 150);
        x -= width_map[(img_enum+1) % 2] - 1;
        img_enum = (img_enum + 1) % 2
    }
}

function draw() {
    clear();
    background(0,0);
    

    //drawTiledImage();
    //setGradient(0, 0, width / 2, height, color(0, 255), color(0, 0), X_AXIS);
    //setGradient(width / 2, 0, width / 2, height, color(0, 0), color(0, 255), X_AXIS);

    fill(bgColour);
    noStroke();
    beginShape();

    var xoff = 0;

    for (var x = 0; x < width + 10; x += 10) {
        var y = map(0.75 * magnitude(x) * (noise(xoff, yoff) - 1), 0, 1, 200, 300) - 50;
        vertex(x, y);
        xoff += 0.05;
    }
    vertex(width, 150);
    vertex(0, 150);
    endShape(CLOSE);

    yoff += 0.01;
    
    

    // get distance between mouse and circle
    var distance = dist(mouseX, mouseY, width / 2, 75);

    // if the distance is less than the circle's radius
    if (distance < 75) {
        isOverCircle = true;
    } else {
        isOverCircle = false;
    }
    // draw a circle
    fill(0, 0, 0, 1);
    if (isOverCircle == true) {
        cursor(HAND);
    } else {
        cursor(ARROW);
    }
}

function mousePressed() {
    if (isOverCircle == true) {
        window.open(window.location.origin, "_self")
    }
}

function setGradient(x, y, w, h, c1, c2, axis) {

    noFill();

    if (axis == Y_AXIS) {  // Top to bottom gradient
        for (var i = y; i <= y + h; i++) {
            var inter = map(i, y, y + h, 0, 1);
            var c = lerpColor(c1, c2, inter);
            stroke(c);
            line(x, i, x + w, i);
        }
    }
    else if (axis == X_AXIS) {  // Left to right gradient
        for (var i = x; i <= x + w; i++) {
            var inter = map(i, x, x + w, 0, 1);
            var c = lerpColor(c1, c2, inter);
            stroke(c);
            line(i, y, i, y + h);
        }
    }
}

$(window).resize(function () {
    canvas.size($('body').innerWidth(), 150);
});
