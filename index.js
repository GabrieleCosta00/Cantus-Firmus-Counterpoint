var space = 90;
var numOfWhiteKeys = 10;
var numOfKeys = 17;
var envo = [];
var osc = [];
var rSide = [];
var black = [];
var mid = [];
var lSide = [];

var rKee = ['A', null, null, 'F', null, null, null, 'K', null, null];
var blKee = ['W', 'E', null, 'T', 'Y', 'U', null, 'O', 'P', null, null];
var midKee = [null, 'S', null, null, 'G', 'H', null, null, 'L', null];
var lKee = [null, null, 'D', null, null, null, "J", null, null, ';'];

function RSideKey(start, space, kee) {
    this.x = start * space;
    this.keyWidth = space;
    this.col = color(255);
    this.kee = kee;
    this.size = space/3;

    this.display = function() {
        fill(this.col);
        beginShape();
        vertex(this.x, 0);
        vertex(this.x, height);
        vertex(this.x + this.keyWidth, height);
        vertex(this.x + this.keyWidth, height * 0.6)
        vertex(this.x + (this.keyWidth * 0.667), height * 0.6)
        vertex(this.x + (this.keyWidth * 0.667), 0);
        endShape();

        fill(0, 0, 230);
        textSize(this.size);
        text(this.kee, this.x + (this.keyWidth *0.4), height - this.size);
    }

    this.red = function() {
        this.col = color(255, 0, 0);
    }

    this.white = function() {
        this.col = color(255);
    }
}

function BlackKey(start, space, kee) {
    this.x = start * space;
    this.keyWidth = space;
    this.col = color(0);
    this.kee = kee;
    this.size = space/3;

    this.display = function() {
        fill(this.col);
        rect(this.x, 0, (this.keyWidth * 0.667), height * 0.6);
        fill(255, 0, 230);
        textSize(this.size);
        text(this.kee, this.x + (this.keyWidth * 0.2), (height * 0.6) - this.size);
    }

    this.red = function() {
        this.col = color(255, 0, 0);
    }

    this.white = function() {
        this.col = color(0);
    }
}

function MidKey(start, space, kee) {
    this.x = start * space;
    this.keyWidth = space;
    this.col = color(255);
    this.kee = kee;
    this.size = space/3;

    this.display = function() {
        fill(this.col);
        beginShape();
        vertex(this.x + (this.keyWidth * 0.333), 0);
        vertex(this.x + (this.keyWidth * 0.333), height * 0.6);
        vertex(this.x, height * 0.6);
        vertex(this.x, height);
        vertex(this.x + this.keyWidth, height);
        vertex(this.x + this.keyWidth, height * 0.6);
        vertex(this.x + (this.keyWidth * 0.667), height * 0.6);
        vertex(this.x + (this.keyWidth * 0.667), 0);
        endShape();

        fill(0, 0, 230);
        textSize(this.size);
        text(this.kee, this.x + (this.keyWidth *0.4), height - this.size);
    }

    this.red = function() {
        this.col = color(255, 0, 0);
    }

    this.white = function() {
        this.col = color(255);
    }
}

function LSideKey(start, space, kee) {
    this.x = start * space;
    this.keyWidth = space;
    this.col = color(255);
    this.kee = kee;
    this.size = space/3;

    this.display = function() {
        fill(this.col);
        beginShape();
        vertex(this.x + (this.keyWidth * 0.333), 0);
        vertex(this.x + (this.keyWidth * 0.333), height * 0.6);
        vertex(this.x, height * 0.6);
        vertex(this.x, height);
        vertex(this.x + this.keyWidth, height);
        vertex(this.x + this.keyWidth, 0);
        endShape();

        fill(0, 0, 230);
        textSize(this.size);
        text(this.kee, this.x + (this.keyWidth *0.4), height - this.size);
    }

    this.red = function() {
        this.col = color(255, 0, 0);
    }

    this.white = function() {
        this.col = color(255);
    }
}


function setup() {
    createCanvas(space * numOfWhiteKeys, 500);

    for (var j = 0; j < numOfKeys; j++) {
        envo.push(new p5.Env());
        envo[j].setADSR(0.01, 0.05, 1, 0.1);
        envo[j].setRange(1, 0);
        osc.push(new p5.Oscillator());
        osc[j].amp(envo[j]);
    }

    for (var i = 0; i < numOfWhiteKeys; i++) {
        rSide.push(new RSideKey(i, space, rKee[i]));
        black.push(new BlackKey(i + 0.667, space, blKee[i]));
        mid.push(new MidKey(i, space, midKee[i]));
        lSide.push(new LSideKey(i, space, lKee[i]));
    }
}

function draw() {
    background(255);
    for (var i = 0; i < rSide.length; i++) {
        if (i%7 === 0 || i%7 === 3) {
            rSide[i].display();
        }
        if ((i%7 !== 2) && (i%7 !== 6)) {
            black[i].display();
        }
        if (i%7 === 1 || i%7 === 4 || i%7 === 5) {
            mid[i].display();
        }
        if (i%7 === 2 || i%7 === 6) {
            lSide[i].display();
        }
    }
}


function keyPressed() {
    var root = 60; // Middle C
    if (keyCode === 65) {
        rSide[0].red();
        osc[0].start();
        osc[0].freq(midiToFreq(root));
        envo[0].play();
    } else if (keyCode === 87) {
        black[0].red();
        osc[1].start();
        osc[1].freq(midiToFreq(root + 1));
        envo[1].play();
    } else if (keyCode === 83) {
        mid[1].red();
        osc[2].start();
        osc[2].freq(midiToFreq(root + 2));
        envo[2].play();
    } else if (keyCode === 69) {
        black[1].red();
        osc[3].start();
        osc[3].freq(midiToFreq(root + 3));
        envo[3].play();
    } else if (keyCode === 68) {
        lSide[2].red();
        osc[4].start();
        osc[4].freq(midiToFreq(root + 4));
        envo[4].play();
    } else if (keyCode === 70) {
        rSide[3].red();
        osc[5].start();
        osc[5].freq(midiToFreq(root + 5));
        envo[5].play();
    } else if (keyCode === 84) {
        black[3].red();
        osc[6].start();
        osc[6].freq(midiToFreq(root + 6));
        envo[6].play();
    } else if (keyCode === 71) {
        mid[4].red();
        osc[7].start();
        osc[7].freq(midiToFreq(root + 7));
        envo[7].play();
    } else if (keyCode === 89) {
        black[4].red();
        osc[8].start();
        osc[8].freq(midiToFreq(root + 8));
        envo[8].play();
    } else if (keyCode === 72) {
        mid[5].red();
        osc[9].start();
        osc[9].freq(midiToFreq(root + 9));
        envo[9].play();
    } else if (keyCode === 85) {
        black[5].red();
        osc[10].start();
        osc[10].freq(midiToFreq(root + 10));
        envo[10].play();
    } else if (keyCode === 74) {
        lSide[6].red();
        osc[11].start();
        osc[11].freq(midiToFreq(root + 11));
        envo[11].play();
    } else if (keyCode === 75) {
        rSide[7].red();
        osc[12].start();
        osc[12].freq(midiToFreq(root + 12));
        envo[12].play();
    } else if (keyCode === 79) {
        black[7].red();
        osc[13].start();
        osc[13].freq(midiToFreq(root + 13));
        envo[13].play();
    } else if (keyCode === 76) {
        mid[8].red();
        osc[14].start();
        osc[14].freq(midiToFreq(root + 14));
        envo[14].play();
    } else if (keyCode === 80) {
        black[8].red();
        osc[15].start();
        osc[15].freq(midiToFreq(root + 15));
        envo[15].play();
    } else if (keyCode === 186) {
        lSide[9].red();
        osc[16].start();
        osc[16].freq(midiToFreq(root + 16));
        envo[16].play();
    }
}

function keyReleased() {
    for (var i = 0; i < numOfWhiteKeys; i++) {
        rSide[i].white();
        black[i].white();
        mid[i].white();
        lSide[i].white();
    }
}