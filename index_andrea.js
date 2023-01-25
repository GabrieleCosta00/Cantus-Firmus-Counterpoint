const pianoKeys = document.querySelectorAll('.key')
const noteTexts = document.querySelectorAll('.noteText')
var notePlaying = null;
var currentIndex = 0;
const noteNames = [ 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
    'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5'];

// When you click on the keyboard...

pianoKeys.forEach((pianoKey, i) => {
    const number = i < 9 ? '0' + (i + 1) : (i + 1)
    const newUrl = 'Samples/Piano_sample_' + number + '.mp3'
    pianoKey.addEventListener("mousedown", () => playSoundAndWrite(newUrl, number))
    pianoKey.addEventListener("mouseup", () => newPossibilities(i))
    pianoKey.addEventListener("mousedown", () => clearPossibilities())
    pianoKey.addEventListener("mouseup", () => stopSound())
})

// It plays the sound you chosen on the keyboard and write it in the CF/CTP

function playSoundAndWrite(newUrl, number) {
    if (currentIndex === 16) {currentIndex = 0;}
    let currentAudio = new Audio(newUrl)
    notePlaying = currentAudio;
    currentAudio.play();
    writeNote(noteNames[Number(number)-1], currentIndex);
    currentIndex = currentIndex + 1;
}

// It plays the sound corresponding to the name of the note, and colours the corresponding key

function playSoundAndColourKey(noteName) {
    const i = noteNames.indexOf(noteName)
    pianoKeys.forEach((pianoKey, j) => {
        if (i === j) {
            pianoKey.classList.add("writtenOnScore")
        }
    })
    const number = i < 9 ? '0' + (i + 1) : (i + 1)
    const newUrl = 'Samples/Piano_sample_' + number + '.mp3'
    let currentAudio = new Audio(newUrl)
    notePlaying = currentAudio;
    currentAudio.play();
}

// It stops all the sound gradually (decreasing the volume) and clear the colour of the keyboard

function stopSound() {
    if(notePlaying !== null) {
        decreaseVolume(notePlaying);
        notePlaying = null;
    }
    pianoKeys.forEach((pianoKey) => {
        if (pianoKey.classList.contains("writtenOnScore")) {
            pianoKey.classList.remove("writtenOnScore")
        }
    })
}

// "decreaseVolume" fade out the volume recursively by subtracting 0.1 each 50 ms

function decreaseVolume(note) {
    if (note.volume > 0.1) {
        note.volume = note.volume - 0.1;
        setTimeout(() => decreaseVolume(note), 50);
    }
}

// When you release the mouse, it clears all the keys

function clearPossibilities() {
    pianoKeys.forEach(pianoKey => {
        pianoKey.classList.remove("possible")
    })
}

// Here goes the rules for the choise of the next note (it add a colour)

function newPossibilities(offset) {
    pianoKeys.forEach((pianoKey, i) => {
        if (Math.abs(offset-i) < 4) {
            pianoKey.classList.add("possible")
        }
    })
}

// It writes the note you played in the CF/CTP tabs

function writeNote(note, index) {
    noteTexts.forEach((text, i) => {
        if (i === index) {
            text.innerHTML = note;
        }
    })
}

// When you want you listen the notes of the CF, you can click them...

document.querySelectorAll('.noteText').forEach((note) => {
    note.addEventListener("mousedown", () => playSoundAndColourKey(note.innerHTML))
    note.addEventListener("mouseup", () => stopSound())
})


//Andrea sperimenta

var canvas = document.getElementById("canvas_score");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#000000";

ctx.fillText("CANTUS FIRMUS:", 20, 20)

ctx.fillRect(20, 30, 1000, 1);
ctx.fillRect(20, 45, 1000, 1);
ctx.fillRect(20, 60, 1000, 1);
ctx.fillRect(20, 75, 1000, 1);
ctx.fillRect(20, 90, 1000, 1);

ctx.fillText("COUNTERPOINT:", 20, 130)

ctx.fillRect(20, 140, 1000, 1);
ctx.fillRect(20, 155, 1000, 1);
ctx.fillRect(20, 170, 1000, 1);
ctx.fillRect(20, 185, 1000, 1);
ctx.fillRect(20, 200, 1000, 1);

ctx.beginPath();
for(let i=5; i>0; i=i-0.1) {
    ctx.arc(50, 60, i, 0, 2 * Math.PI);
}
ctx.stroke();

ctx.beginPath();
ctx.arc(100, 53.33, 5, 0, 2 * Math.PI);
ctx.stroke();

ctx.beginPath();
for(let i=8; i>0; i=i-0.1) {
    ctx.arc(500, 193, i, 0, 2 * Math.PI);
}
ctx.stroke();

ctx.fillRect(485, 192, 30, 4);

ctx.beginPath();
ctx.arc(300, 177, 8, 0, 2 * Math.PI);
ctx.stroke();

ctx.fillRect(285, 177, 30, 2);