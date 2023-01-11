var keyWidth = 65;
var keyboardHeight = 200;
var numOfWhiteKeys = 17;
var numOfKeys = 29;
var envo = [];
var osc = [];
var rSide = [];
var black = [];
var mid = [];
var lSide = [];
let n;

var rKee = [  'A',  null, null, 'F',  null, null, null, 'K',  null, null, '1',  null, null, null, '8',  null,    null];
var blKee = [ 'W',  'E',  null, 'T',  'Y',  'U',  null, 'O',  'P',  null, '2',  '4',  '6',  null, '9',  '4n',  null];
var midKee = [null, 'S',  null, null, 'G',  'H',  null, null, 'L',  null, null, '3',  '5',  null, null, '0',     null];
var lKee = [  null, null, 'D',  null, null, null, "J",  null, null, '1n',  null, null, null, "7",  null, null,    '2n'];

function RSideKey(start, space, kee) {
    this.x = start * space;
    this.keyWidth = space;
    this.col = color(255);
    this.kee = kee;
    this.size = space/3;

    this.display = function() {
        fill(this.col);
        beginShape();
        vertex(this.x + (this.keyWidth * 0.667), 0);
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
        vertex(this.x + (this.keyWidth * 0.667), 0);
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
        vertex(this.x + this.keyWidth, 0);
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
    var cnv = createCanvas(keyWidth * numOfWhiteKeys, keyboardHeight);

    cnv.position((windowWidth / 2) - (keyWidth * numOfWhiteKeys / 2), (windowHeight - keyboardHeight - 5));

    for (var j = 0; j < numOfKeys; j++) {
        envo.push(new p5.Env());
        envo[j].setADSR(0.01, 0.05, 1, 0.1);
        envo[j].setRange(1, 0);
        osc.push(new p5.Oscillator());
        osc[j].amp(envo[j]);
    }

    for (var i = 0; i < numOfWhiteKeys; i++) {
        rSide.push(new RSideKey(i, keyWidth, rKee[i]));
        black.push(new BlackKey(i + 0.667, keyWidth, blKee[i]));
        mid.push(new MidKey(i, keyWidth, midKee[i]));
        lSide.push(new LSideKey(i, keyWidth, lKee[i]));
    }
}

function draw() {
    background(50);
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
    var root = 48; // An octave below middle C (60)
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
    } else if (keyCode === 97) {                // 1 NumPad -> Mi
        lSide[9].red();
        osc[16].start();
        osc[16].freq(midiToFreq(root + 16));
        envo[16].play();
    } else if (keyCode === 49) {                // 1 -> Fa
        rSide[10].red();
        osc[17].start();
        osc[17].freq(midiToFreq(root + 17));
        envo[17].play();
    } else if (keyCode === 50) {                // 2 -> Fa#
        black[10].red();
        osc[18].start();
        osc[18].freq(midiToFreq(root + 18));
        envo[18].play();
    } else if (keyCode === 51) {                // 3 -> Sol
        mid[11].red();
        osc[19].start();
        osc[19].freq(midiToFreq(root + 19));
        envo[19].play();
    } else if (keyCode === 52) {                // 4 -> Sol#
        black[11].red();
        osc[20].start();
        osc[20].freq(midiToFreq(root + 20));
        envo[20].play();
    } else if (keyCode === 53) {                // 5 -> La
        mid[12].red();
        osc[21].start();
        osc[21].freq(midiToFreq(root + 21));
        envo[21].play();
    } else if (keyCode === 54) {                // 6 -> La#
        black[12].red();
        osc[22].start();
        osc[22].freq(midiToFreq(root + 22));
        envo[22].play();
    } else if (keyCode === 55) {                // 7 -> Si
        lSide[13].red();
        osc[23].start();
        osc[23].freq(midiToFreq(root + 23));
        envo[23].play();
    } else if (keyCode === 56) {                // 8 -> Do
        rSide[14].red();
        osc[24].start();
        osc[24].freq(midiToFreq(root + 24));
        envo[24].play();
    } else if (keyCode === 57) {                // 9 -> Do#
        black[14].red();
        osc[25].start();
        osc[25].freq(midiToFreq(root + 25));
        envo[25].play();
    } else if (keyCode === 48) {                // 0 -> Re
        mid[15].red();
        osc[26].start();
        osc[26].freq(midiToFreq(root + 26));
        envo[26].play();
    } else if (keyCode === 100) {                // 4 NumPad -> Re#
        black[15].red();
        osc[27].start();
        osc[27].freq(midiToFreq(root + 27));
        envo[27].play();
    } else if (keyCode === 98) {                // 2 NumPad -> Mi
        lSide[16].red();
        osc[28].start();
        osc[28].freq(midiToFreq(root + 28));
        envo[28].play();
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

function mousePressed() { // Non funziona ancora... c'è qualcosa che non quadra nel centrare i tasti neri (solo bianchi funziona)... non capisco cosa però
    var root = 48;
    var positionWhiteKeys = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24, 26, 28];
    var positionBlackKeys = [1, 3, 6, 8, 10, 13, 15, 18, 20, 22, 25, 27];
    if (mouseX > 0 && mouseX < (keyWidth * numOfWhiteKeys)) {
        if ((mouseY > (0.6 * keyboardHeight)) && (mouseY < keyboardHeight))
        {
            // solo tasti bianchi
            n = Math.floor(mouseX / keyWidth);
            osc[positionWhiteKeys[n]].start();
            osc[positionWhiteKeys[n]].freq(midiToFreq(root + positionWhiteKeys[n]));
            envo[positionWhiteKeys[n]].play();
        }
        if ((mouseY <= (0.6 * keyboardHeight)) && (mouseY > 0))
        {
            // tasti neri e bianchi
            n = Math.floor((mouseX + (0.667 * keyWidth)) / keyWidth) - 1; // perché con -1 sembra che almeno l'if successivo funzioni?!
            if (n === 2 || n === 6 || n === 9 || n === 13 || n === 16) {
                // allora è un bianco
                // console.log(n)
                n = Math.floor(mouseX / keyWidth);
                osc[positionWhiteKeys[n]].start();
                osc[positionWhiteKeys[n]].freq(midiToFreq(root + positionWhiteKeys[n]));
                envo[positionWhiteKeys[n]].play();
            }
            else {
                // tasto nero o bianco
                if (((mouseX + (0.667 * keyWidth)) % keyWidth) < (0.667 * keyWidth)) {
                    // tasto nero
                    osc[positionBlackKeys[n]].start();
                    osc[positionBlackKeys[n]].freq(midiToFreq(root + positionBlackKeys[n]));
                    envo[positionBlackKeys[n]].play();
                }
                else {
                    // tasto bianco
                    n = Math.floor(mouseX / keyWidth);
                    osc[positionWhiteKeys[n]].start();
                    osc[positionWhiteKeys[n]].freq(midiToFreq(root + positionWhiteKeys[n]));
                    envo[positionWhiteKeys[n]].play();
                }
            }
        }
    }
}

function mouseReleased() {
    for (var i = 0; i < numOfWhiteKeys; i++) {
        rSide[i].white();
        black[i].white();
        mid[i].white();
        lSide[i].white();
    }
}