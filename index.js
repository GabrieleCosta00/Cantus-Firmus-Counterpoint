const pianoKeys = document.querySelectorAll('.key')
const noteTexts = document.querySelectorAll(".noteText")
var notePlaying = null;
var keyIsPressed = false;
var currentIndex = 0;
const noteNames = [ 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
    'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5'];

pianoKeys.forEach((pianoKey, i) => {
    const number = i < 9 ? '0' + (i + 1) : (i + 1)
    const newUrl = 'Samples/Piano_sample_' + number + '.mp3'
    pianoKey.addEventListener("mousedown", () => playSound(newUrl, number))
    pianoKey.addEventListener("mouseup", () => newPossibilities(i))
    pianoKey.addEventListener("mousedown", () => clearPossibilities())
    pianoKey.addEventListener("mouseup", () => stopSound())
})

function playSound(newUrl, number) {
    if (currentIndex === 16) {currentIndex = 0;}
    let currentAudio = new Audio(newUrl)
    notePlaying = currentAudio;
    keyIsPressed = true;
    currentAudio.play();
    writeNote(noteNames[Number(number)-1], currentIndex);
    currentIndex = currentIndex + 1;
}

function stopSound() {
    if(notePlaying !== null) {
        decreaseVolume(notePlaying);
        notePlaying = null;
        keyIsPressed = false;
    }
}

// "decreaseVolume" fade out the volume recursively by subtracting 0.1 each 50 ms

function decreaseVolume(note) {
    if (note.volume > 0) {
        note.volume = note.volume - 0.1;
        setTimeout(() => decreaseVolume(note), 50);
    }
}

function clearPossibilities() {
    pianoKeys.forEach(pianoKey => {
        pianoKey.classList.remove("possible")
    })
}

// Here goes the rules for the choise of the next note

function newPossibilities(offset) {
    console.log("offset = " + offset)
    pianoKeys.forEach((pianoKey, i) => {
        if (Math.abs(offset-i) < 4) {
            console.log("offset - i = " + Math.abs(offset-i))
            pianoKey.classList.add("possible")
        }
    })
}

function writeNote(note, index) {
    noteTexts.forEach((text, i) => {
        if (i === index) {
            text.innerHTML = note;
        }
    })
}