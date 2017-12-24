var yoff = 0.0;        // 2nd dimension of perlin noise
var isOverCircle;
var Y_AXIS = 1;
var X_AXIS = 2;
var leftColour = [255, 255, 255];
var rightColour = [255, 255, 255];
var bgColour = [255, 255, 255];

if (window.location.href.includes("everydays")) {
    bgColour = (0, 0);
}

function setup() {
    createCanvas($('body').innerWidth(), 150).parent('header_wave');
}

function magnitude(x) {
    var half = width / 2;
    return (x - half) * (x - half)/400000;
}

function draw() {
    clear();
    background(0,0);

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

function windowResized() {
    console.log(windowWidth);
    resizeCanvas(windowWidth, 150);
}