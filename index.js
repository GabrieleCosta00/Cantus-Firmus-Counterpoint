const pianoKeys = document.querySelectorAll('.key')
var notePlaying = null;
var keyIsPressed = false;

pianoKeys.forEach((pianoKey, i) => {
    const number = i < 9 ? '0' + (i + 1) : (i + 1)
    const newUrl = 'Samples/Piano_sample_' + number + '.mp3'
    pianoKey.addEventListener("mousedown", () => playSound(newUrl))
    pianoKey.addEventListener("mouseup", () => newPossibilities(i))
    pianoKey.addEventListener("mousedown", () => clearPossibilities())
    pianoKey.addEventListener("mouseup", () => stopSound())
})

function playSound(newUrl) {
    let currentAudio = new Audio(newUrl)
    notePlaying = currentAudio;
    keyIsPressed = true;
    currentAudio.play();
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