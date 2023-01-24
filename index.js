const pianoKeys = document.querySelectorAll('.key')

function playSound(newUrl) {
    new Audio(newUrl).play()
    // TODO: al momento i sample di pianoforte vengono fatti partire, ma mai interrotti. Sarebbe carino che il suono si interrompesse con un fade-out al rilascio del mouse.
}

pianoKeys.forEach((pianoKey, i) => {
    const number = i < 9 ? '0' + (i + 1) : (i + 1)
    const newUrl = 'Samples/Piano_sample_' + number + '.mp3'
    pianoKey.addEventListener("mousedown", () => playSound(newUrl))
    pianoKey.addEventListener("mouseup", () => newPossibilities(i))
    pianoKey.addEventListener("mousedown", () => clearPossibilities())
})

function clearPossibilities() {
    pianoKeys.forEach(pianoKey => {
        pianoKey.classList.remove("possible")
    })
}

function newPossibilities(offset) {
    console.log("offset = " + offset)
    pianoKeys.forEach((pianoKey, i) => {
        if (Math.abs(offset-i) < 4) {
            console.log("offset - i = " + Math.abs(offset-i))
            pianoKey.classList.add("possible")
        }
    })
}