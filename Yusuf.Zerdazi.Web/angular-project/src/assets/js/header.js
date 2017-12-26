// Create an invisible iframe
var iframe = document.createElement('iframe');
iframe.id = "hacky-scrollbar-resize-listener";
iframe.style.cssText = 'height: 0; background-color: transparent; margin: 0; padding: 0; overflow: hidden; border-width: 0; position: absolute; width: 100%;';

// Register our event when the iframe loads
iframe.onload = function() {
    // The trick here is that because this iframe has 100% width 
    // it should fire a window resize event when anything causes it to 
    // resize (even scrollbars on the outer document)
    iframe.contentWindow.addEventListener('resize', function() {
        try {
            var evt = new UIEvent('resize');
            window.dispatchEvent(evt);
        }   catch(e) {}
    });
};

// Stick the iframe somewhere out of the way
document.body.appendChild(iframe);

var yoff = 0.0;

function setup() {
    can = createCanvas(document.body.clientWidth, 150).parent('header_wave');

    window.addEventListener('resize', function() {
        resizeCanvas(document.body.clientWidth, 150);
    });
}

function magnitude(x) {
    var half = width / 2;
    return (x - half) * (x - half)/400000;
}

function draw() {
    fill(255);
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

    clear();
    endShape(CLOSE);

    yoff += 0.01;
}