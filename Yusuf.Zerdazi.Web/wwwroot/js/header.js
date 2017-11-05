var yoff = 0.0;        // 2nd dimension of perlin noise
var isOverCircle;
var leftColour = [231, 66, 53];
var rightColour = [250, 187, 9];
var bgColour = 255;
var imgUrl = window.location.origin + "/images/colour.gif";

if (window.location.href.includes("everydays")) {
    var leftColour = [255, 255, 255];
    var rightColour = [255, 255, 255];
    var bgColour = 0;
    var imgUrl = window.location.origin + "/images/header.gif";
}

function setup() {
    canvas = createCanvas($('body').innerWidth(), 100);
    img = loadImage(imgUrl);
    canvas.parent('header_wave');
}

function magnitude(x) {
    var half = width / 2;
    if (x < half) {
        return max(0, (half - 110) - x) / half;
    } else {
        return max(0, x - half - 110) / half;
    }
}

function draw() {
    background(bgColour);
    fill(leftColour);
    noStroke();
    beginShape();
    var xoff = 0;

    for (var x = 0; x < width / 2; x += 10) {
        var y = map(1.5 * magnitude(x) * (noise(xoff, yoff) - 0.5), 0, 1, 200, 300) - 150;
        vertex(x, y);
        xoff += 0.05;
    }
    vertex(width / 2, 0);
    vertex(0, 0);
    endShape(CLOSE);

    fill(rightColour);
    beginShape();
    for (var x = width / 2; x < width + 10; x += 10) {
        if (x > width) {
            x = width;
        }
        var y = map(1.5 * magnitude(x) * (noise(xoff, yoff) - 0.5), 0, 1, 200, 300) - 150;
        vertex(x, y);
        xoff += 0.05;
    }
    vertex(width, 0);
    vertex(width / 2, 0);
    endShape(CLOSE);

    yoff += 0.01;
    image(img, width / 2 - 50, 0, 100, 100);


    // get distance between mouse and circle
    var distance = dist(mouseX, mouseY, width / 2, 50);

    // if the distance is less than the circle's radius
    if (distance < 50) {
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

$(window).resize(function () {
    canvas.size($('body').innerWidth(), 100);
});
