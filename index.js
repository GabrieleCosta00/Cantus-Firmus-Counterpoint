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
const playRate = 1000; // ms between the notes when playing
let CFNotes = [0, 0, 0, 0, 0, 0, 0, 0]; // 0 -> no note; number!=0 -> a valid note
let CTPNotes = [0, 0, 0, 0, 0, 0, 0, 0]; // 0 -> no note; number!=0 -> a valid note
const noteNames = [ 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
    'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
    'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5', 'C6'];

// The peace of code that places the black keys in the keyboard
let nthBlackKey = 0;
document.querySelectorAll('.black-key').forEach(displayBlackKeys);
function displayBlackKeys(e, index) {
    if (index === 2 || index === 5 || index === 7 || index === 10 || index === 12) {nthBlackKey++;}
    e.setAttribute("style", "left: " + (37 + (nthBlackKey * 51)) + "px");
    nthBlackKey++;
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
    pianoKey.addEventListener("mousedown", () => playSoundAndWrite(newUrl, number))
    pianoKey.addEventListener("mouseup", () => newPossibilities(i))
    pianoKey.addEventListener("mousedown", () => clearPossibilities())
    pianoKey.addEventListener("mouseup", () => stopSound())
})

// When you press a key on the computer keyboard...
document.addEventListener("keydown", convertPlayWriteClearPoss)
document.addEventListener("keyup", stopSound)
document.addEventListener("keyup", newPossibilitiesKey)

function newPossibilitiesKey(e) {
    let i = (Number(converter(e)) - 1);
    newPossibilities(i);
}

// The function that does the same operations of the "pianoKeys.forEach..." of the previous lines,
// after converting the character to the corresponding piano key
function convertPlayWriteClearPoss(character) {
    if (!keyIsPressed) {
        keyIsPressed = true;
        let number = converter(character)
        if (number !== '0') {
            const newUrl = 'Samples/Piano_sample_' + number + '.mp3'
            playSoundAndWrite(newUrl, number)
            clearPossibilities()
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
        case '+': {num = '37'; break;}
    }
    return num;
}

// It plays the sound you chosen on the keyboard and write it in the CF/CTP (in both the box and the vector of notes), based on which you have chosen
function playSoundAndWrite(newUrl, number) {
    if (whichScore === "CF") {
        if (indexCF >= 8) {indexCF = 0;}
        writeNote(noteNames[Number(number)-1], indexCF);
        CFNotes[indexCF] = Number(number);
        indexCF = indexCF + 1;
        let currentAudio = new Audio(newUrl)
        notePlayingCF = currentAudio;
        currentAudio.play();
    }
    else {
        if (indexCTP >= 8) {indexCTP = 0}
        writeNote(noteNames[Number(number)-1], indexCTP+8);
        CTPNotes[indexCTP] = Number(number);
        indexCTP = indexCTP + 1;
        let currentAudio = new Audio(newUrl)
        notePlayingCTP = currentAudio;
        currentAudio.play();
    }
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
        pianoKey.classList.remove("possible")
    })
    console.log("cleared")
}

// Here goes the rules for the choise of the next note (it add a colour)
function newPossibilities(offset) {
    pianoKeys.forEach((pianoKey, i) => {
        if (Math.abs(Number(offset)-i) < 4) {
            pianoKey.classList.add("possible")
        }
    })
}

// It writes the note you played in the CF/CTP tabs
function writeNote(note, index) {
    noteTexts.forEach((text, i) => {
        if (i === index) {text.innerHTML = note;}
    })
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