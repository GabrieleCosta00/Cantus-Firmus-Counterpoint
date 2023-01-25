const pianoKeys = document.querySelectorAll('.key')
const noteTexts = document.querySelectorAll('.noteText')
const CFScore = document.getElementById('scoreCF')
const CTPScore = document.getElementById('scoreCTP')
var notePlaying = null;
var indexCF = 0;
var indexCTP = 0;
var whichScore = "CF";
const noteNames = [ 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
    'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5'];

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

// When you click on the keyboard...
pianoKeys.forEach((pianoKey, i) => {
    const number = i < 9 ? '0' + (i + 1) : (i + 1)
    const newUrl = 'Samples/Piano_sample_' + number + '.mp3'
    pianoKey.addEventListener("mousedown", () => playSoundAndWrite(newUrl, number))
    pianoKey.addEventListener("mouseup", () => newPossibilities(i))
    pianoKey.addEventListener("mousedown", () => clearPossibilities())
    pianoKey.addEventListener("mouseup", () => stopSound())

})

// It plays the sound you chosen on the keyboard and write it in the CF/CTP, based on which you have chosen
function playSoundAndWrite(newUrl, number) {
    if (whichScore === "CF") {
        if (indexCF >= 8) {indexCF = 0;}
        writeNote(noteNames[Number(number)-1], indexCF);
        indexCF = indexCF + 1;
    }
    else {
        if (indexCTP >= 8) {indexCTP = 0}
        writeNote(noteNames[Number(number)-1], indexCTP+8);
        indexCTP = indexCTP + 1;
    }
    let currentAudio = new Audio(newUrl)
    notePlaying = currentAudio;
    currentAudio.play();
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