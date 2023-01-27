const pianoKeys = document.querySelectorAll('.key')
const noteTexts = document.querySelectorAll('.noteText')
const CFScore = document.getElementById('scoreCF')
const CTPScore = document.getElementById('scoreCTP')
let notePlayingCF = null;
let notePlayingCTP = null;
let indexCF = 0;
let indexCTP = 0;
let whichScore = "CF";
let whichScorePt;
let currentTransport = 0;
let isPlaying = false;
let keyIsPressed = false;
let goodNote = 1; // 1 -> good note, 0 -> not a good note
const playRate = 1000; // ms between the notes when playing
let CFNotes = [0, 0, 0, 0, 0, 0, 0, 0]; // 0 -> no note; number!=0 -> a valid note
let CTPNotes = [0, 0, 0, 0, 0, 0, 0, 0]; // 0 -> no note; number!=0 -> a valid note
let tonalityMask = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const noteNames = [ 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
    'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
    'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5'];

// The peace of code that places the black keys in the keyboard
let nthBlackKey = 0;
document.querySelectorAll('.black-key').forEach(displayBlackKeys);
function displayBlackKeys(e, index) {
    if (index === 2 || index === 5 || index === 7 || index === 10 || index === 12) {nthBlackKey++;}
    e.setAttribute("style", "left: " + (37 + (nthBlackKey * 51)) + "px");
    nthBlackKey++;
}

// The function that clear the tonality
function clearTonalityMask() {
    for (let i = 0; i < tonalityMask.length; i++) {
        tonalityMask[i] = 1;
    }
}

// The function that sets the mask for the tonality (invoked on the first note of the CF),
// passing the note and a flag that tells if it's the root or the 3rd ("0" or "3" or "4")
function setTonalityMask(note, which) {
    for (let i = 0; i < noteNames.length; i++) {
        if (i === note) {
            for (let j = 0; j<noteNames.length; j++) {
                if ((which === 0) && ((j % 12) === 1 || (j % 12) === 6 || (j % 12) === 8 || (j % 12) === 10)) {
                    tonalityMask[(j + i) % 36] = 0;
                }
                if ((which === 3) && ((j % 12) === 1)) {
                    tonalityMask[(j + i) % 36] = 0;
                }
                if ((which === 4) && ((j % 12) === 11)) {
                    tonalityMask[(j + i) % 36] = 0;
                }
            }
            i = noteNames.length;
        }
    }
    pianoKeys.forEach((pianoKey, k) => {
        if (tonalityMask[k % 12] === 1) {
            pianoKey.classList.remove("outOfTonality")
        }
        else {
            pianoKey.classList.add("outOfTonality")
        }
    })
}

// The function that clear all the note written if you are playing the first one
function clearScore() {
    if (whichScore === "CF") {
        for (let i = 0; i < CFNotes.length; i++) {CFNotes[i] = 0; CTPNotes[i] = 0;}
        noteTexts.forEach((note) => {note.innerHTML = null;})
    }
    else {
        for (let i = 0; i < CTPNotes.length; i++) {CTPNotes[i] = 0;}
        noteTexts.forEach((note, k) => {
            if (k > 7) {note.innerHTML = null;}
        })
    }
}

// If you click on the CF box you will write this score. Same for the CTP
CFScore.addEventListener("click", () => {
    if (CTPScore.classList.contains('selectedScore')) {CTPScore.classList.remove('selectedScore')}
    whichScore = "CF";
    if (!CFScore.classList.contains('selectedScore')) {CFScore.classList.add('selectedScore')}
})
CTPScore.addEventListener("click", () => {
    if (CFScore.classList.contains('selectedScore')) {CFScore.classList.remove('selectedScore')}
    whichScore = "CTP";
    if (!CTPScore.classList.contains('selectedScore')) {CTPScore.classList.add('selectedScore')}
})

// If you are over the CF/CTP box the flag "whichScorePt" is set to "CF"/"CTP". Used for colour the key with the corresponding colour
CFScore.addEventListener("mouseover", () => {whichScorePt = "CF"})
CTPScore.addEventListener("mouseover", () => {whichScorePt = "CTP"})

// When you click on the keyboard...
pianoKeys.forEach((pianoKey, i) => {
    const number = i < 9 ? '0' + (i + 1) : (i + 1)
    const newUrl = 'Samples/Piano_sample_' + number + '.mp3'
    pianoKey.addEventListener("mousedown", () => playWriteClearPoss(newUrl, number))
    pianoKey.addEventListener("mouseup", () => newPossibilities(i))
    pianoKey.addEventListener("mouseup", () => stopSound())
})

// When you press a key on the computer keyboard...
document.addEventListener("keydown", convertPlayWriteClearPoss)
document.addEventListener("keyup", stopSound)
document.addEventListener("keyup", newPossibilitiesKey)

function newPossibilitiesKey(e) {
    let i = (Number(converter(e)) - 1);
    if (i !== -1 && goodNote === 1) {   // Prevent from when you select a wrong key or note
        newPossibilities(i);
    }
}

// The function that does the same operations of the "pianoKeys.forEach..." of the previous lines,
// after converting the character to the corresponding piano key
function convertPlayWriteClearPoss(character) {
    if (!keyIsPressed) { // Prevent from multiple firing when hold on the key
        keyIsPressed = true;
        let number = converter(character)
        if (number !== '0') {
            const newUrl = 'Samples/Piano_sample_' + number + '.mp3'
            playWriteClearPoss(newUrl, number)
        }
    }
}

// The function that convert the key on the computer keyboard to the corresponding piano key
function converter(ch) {
    let num = '0';
    switch (ch.key) {
        case 'z': {num = '01'; break;}
        case 's': {num = '02'; break;}
        case 'x': {num = '03'; break;}
        case 'd': {num = '04'; break;}
        case 'c': {num = '05'; break;}
        case 'v': {num = '06'; break;}
        case 'g': {num = '07'; break;}
        case 'b': {num = '08'; break;}
        case 'h': {num = '09'; break;}
        case 'n': {num = '10'; break;}
        case 'j': {num = '11'; break;}
        case 'm': {num = '12'; break;}
        case ',': {num = '13'; break;}
        case 'l': {num = '14'; break;}
        case '.': {num = '15'; break;}
        case 'ò': {num = '16'; break;}
        case '-': {num = '17'; break;}
        case 'q': {num = '18'; break;}
        case '2': {num = '19'; break;}
        case 'w': {num = '20'; break;}
        case '3': {num = '21'; break;}
        case 'e': {num = '22'; break;}
        case '4': {num = '23'; break;}
        case 'r': {num = '24'; break;}
        case 't': {num = '25'; break;}
        case '6': {num = '26'; break;}
        case 'y': {num = '27'; break;}
        case '7': {num = '28'; break;}
        case 'u': {num = '29'; break;}
        case 'i': {num = '30'; break;}
        case '9': {num = '31'; break;}
        case 'o': {num = '32'; break;}
        case '0': {num = '33'; break;}
        case 'p': {num = '34'; break;}
        case '\'': {num = '35'; break;}
        case 'è': {num = '36'; break;}
    }
    return num;
}

// It plays the sound you chosen on the keyboard and write it in the CF/CTP (in both the box and the vector of notes),
// based on which you have chosen. If you are playing the first note of the CF, it clears and sets the tonality
function playWriteClearPoss(newUrl, number) {

    // Check if the note is good...
    pianoKeys.forEach((note, k) => {
        if (k === (Number(number) - 1)) {
            if (note.classList.contains("notPossible")) {goodNote = 0;}
            else {goodNote = 1;}
        }
    })

    // ... and then...
    if (goodNote === 1) {
        let ctp = false
        if (whichScore === "CF") {
            if (indexCF >= 8) {
                indexCF = 0;
            }
            if (indexCF === 0) {
                clearScore();
                clearTonalityMask();
                setTonalityMask(Number(number) - 1, 0); // Means ("this note index", "is the root (= 0)")
            }
            if (((((Number(number) - CFNotes[0]) % 12) === 3) || (((CFNotes[0] - Number(number)) % 12) === 9)) && (tonalityMask[(CFNotes[0] + 2) % 36] !== 0)) {
                setTonalityMask(Number(number) - 1, 3); // Means ("this note index", "is the minor 3rd") so it's a minor scale
            }
            if (((((Number(number) - CFNotes[0]) % 12) === 4) || (((CFNotes[0] - Number(number)) % 12) === 8)) && (tonalityMask[(CFNotes[0] + 3) % 36] !== 0)) {
                setTonalityMask(Number(number) - 1, 4); // Means ("this note index", "is the major 3rd") so it's a major scale
            }
            writeNote(number, noteNames[Number(number) - 1], indexCF, ctp);
            CFNotes[indexCF] = Number(number);
            indexCF = indexCF + 1;
            let currentAudio = new Audio(newUrl)
            notePlayingCF = currentAudio;
            currentAudio.play();
        } else {
            ctp = true
            if (indexCTP >= 8) {
                indexCTP = 0
            }
            if (indexCTP === 0) {
                clearScore();
            }
            writeNote(number, noteNames[Number(number) - 1], indexCTP + 8, ctp);
            CTPNotes[indexCTP] = Number(number);
            indexCTP = indexCTP + 1;
            let currentAudio = new Audio(newUrl)
            notePlayingCTP = currentAudio;
            currentAudio.play();
        }
        clearPossibilities();
    }
    else {alert("Wrong note!")}
}

// It plays the sound corresponding to the name of the note, and colours the corresponding key
function playSoundAndColourKey(noteName) {
    const i = noteNames.indexOf(noteName)
    pianoKeys.forEach((pianoKey, j) => {
        if (i === j) {
            if (whichScorePt === "CF") {pianoKey.classList.add("writtenOnCFScore")}
            else {pianoKey.classList.add("writtenOnCTPScore")}
        }
    })
    const number = i < 9 ? '0' + (i + 1) : (i + 1)
    const newUrl = 'Samples/Piano_sample_' + number + '.mp3'
    let currentAudio = new Audio(newUrl)
    if (whichScorePt === "CF") {notePlayingCF = currentAudio;}
    else {notePlayingCTP = currentAudio;}
    currentAudio.play();
}

// It stops all the sound gradually (decreasing the volume) and clear the colour of the keyboard
function stopSound() {
    if (keyIsPressed) {keyIsPressed = false}
    if(notePlayingCF !== null) {
        decreaseVolume(notePlayingCF);
        notePlayingCF = null;
    }
    if(notePlayingCTP !== null) {
        decreaseVolume(notePlayingCTP);
        notePlayingCTP = null;
    }
    pianoKeys.forEach((pianoKey) => {
        if (pianoKey.classList.contains("writtenOnCFScore")) {
            pianoKey.classList.remove("writtenOnCFScore")
        }
        if (pianoKey.classList.contains("writtenOnCTPScore")) {
            pianoKey.classList.remove("writtenOnCTPScore")
        }
    })
}

// "decreaseVolume" fade out the volume recursively by subtracting 0.1 each 50 ms
function decreaseVolume(note) {
    if (note.volume > 0.1) {
        note.volume = note.volume - 0.1;
        setTimeout(() => decreaseVolume(note), 100);
    }
}

// When you release the mouse, it clears all the keys
function clearPossibilities() {
    pianoKeys.forEach(pianoKey => {
        pianoKey.classList.remove("notPossible")
    })
}

// Here goes the rules for the choise of the next note (it add a colour)
function newPossibilities(offset) {
    pianoKeys.forEach((pianoKey, i) => {
        // TODO: here goes the conditions for NOT good notes
        if (whichScore === "CF") {  // Here the CF's conditions
            if (Math.abs(Number(offset)-i) > 3 || pianoKey.classList.contains("outOfTonality")) {
                pianoKey.classList.add("notPossible")
            }
        }
        else {  // Here the CTP's conditions
            if (Math.abs(Number(offset)-i) > 3 || pianoKey.classList.contains("outOfTonality")) {
                pianoKey.classList.add("notPossible")
            }
        }
    })
}

// It writes the note you played in the CF/CTP tabs
function writeNote(number, note, index, ctp) {
    noteTexts.forEach((text, i) => {
        if (i === index) {text.innerHTML = note;}
    })
    drawNote(number, index % 8, ctp)
}

// When you want you listen the notes of the CF/CTP, you can click them...
noteTexts.forEach((note) => {
    note.addEventListener("mousedown", () => playSoundAndColourKey(note.innerHTML))
    note.addEventListener("mouseup", () => stopSound())
})

// When you click on the PLAY button it will start the execution
function transportPlay() {
    if (isPlaying === false) {
        isPlaying = true;
        myTimeout = setTimeout(() => playing(), playRate);
    }
}

function playing() {
    noteTexts.forEach((note, i) => {
        stopSound();
        if (i === currentTransport) {playSoundAndColourKey(note.innerHTML)}
    })
    noteTexts.forEach((note, i) => {
        stopSound();
        if (i === currentTransport + 8) {playSoundAndColourKey(note.innerHTML)}
    })
    currentTransport++;
    if (currentTransport === 8) {
        currentTransport = 0;
        transportStop();
    }
    else {
        isPlaying = false;
        transportPlay();
    }
}

// When you click on the STOP button it will stop the execution
function transportStop() {
    clearTimeout(myTimeout);
    stopSound();
    isPlaying = false;
    currentTransport = 0;
}

// Write on the pentagramma.
const canvas = document.getElementById("canvas_score");
const ctx = canvas.getContext("2d");

function drawStaves() {
    ctx.fillRect(20, 40, 920, 1);
    ctx.fillRect(20, 56, 920, 1);
    ctx.fillRect(20, 72, 920, 1);
    ctx.fillRect(20, 88, 920, 1);
    ctx.fillRect(20, 104, 920, 1);

    ctx.fillRect(20, 150, 920, 1);
    ctx.fillRect(20, 166, 920, 1);
    ctx.fillRect(20, 182, 920, 1);
    ctx.fillRect(20, 198, 920, 1);
    ctx.fillRect(20, 214, 920, 1);
}

const alteredNotes = [1, 3, 6, 8, 10, 13, 15, 18, 20, 22]
const yCoordinatesHigherStave = [120, 0, 112, 0, 104, 96, 0, 88, 0, 80, 0, 72, 64, 0,
    56, 0, 48, 40, 0, 32, 0, 24, 0, 16, 8]
const yCoordinatesLowerStave = [190, 0, 182, 0, 174, 166, 0, 158, 0, 150, 0, 142]

function drawNote(number, index, ctp) {
    ctx.fillStyle = "rgb(0, 0, 0)"
    if (index === 0) {
        ctx.clearRect(0, 0, 1015, 200)
        drawStaves()
        if (ctp)
            for (let i=0; i<CFNotes.length; i++)
                drawNote(CFNotes[i], i,false)
    }
    let x = 100 + 100 * index
    let y
    if (number > 12) {
        number = number - 13
        if (alteredNotes.includes(number)) {
            y = yCoordinatesHigherStave[number - 1]
            drawSharp(x, y, ctp)
        }
        else
            y = yCoordinatesHigherStave[number]
        if (ctp)
            ctx.fillStyle = "rgb(255, 255, 255)"
        else
            ctx.fillStyle = "rgb(0, 0, 0)"
        if (number < 2)
            ctx.fillRect(x-12, y, 24, 2)
        if (number >= 21 && number <= 22)
            ctx.fillRect(x-12, y, 24, 2)
        if (number > 22) {
            ctx.fillRect(x-12, y+10, 24, 2)
            if (number > 23)
                ctx.fillRect(x-12, y, 24, 2)
        }
    }
    else {
        number = number - 1
        if (alteredNotes.includes(number)) {
            y = yCoordinatesLowerStave[number - 1]
            drawSharp(x, y, ctp)
        }
        else
            y = yCoordinatesLowerStave[number]
    }
    if (ctp)
        ctx.strokeStyle = "rgb(255, 255, 255)"
    else
        ctx.strokeStyle = "rgb(0, 0, 0)"
    ctx.beginPath()
    ctx.arc(x, y, 8, 0, 2 * Math.PI)
    ctx.stroke()
}

function drawSharp(x, y, ctp) {
    x = x - 20
    y = y - 6
    if (ctp)
        ctx.fillStyle = "rgb(255, 255, 255)"
    else
        ctx.fillStyle = "rgb(0, 0, 0)"
    ctx.fillRect(x, y, 1, 15)
    ctx.fillRect(x+5, y-2, 1, 15)
    ctx.fillRect(x-3, y+3, 11, 1)
    ctx.fillRect(x-3, y+8, 11, 1)
}