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
                if ((which === 0) && ((j % 12) === 1 || (j % 12) === 6)) {
                    tonalityMask[(j + i) % 36] = 0;
                }
                if ((which === 3) && ((j % 12) === 1 || (j % 12) === 6 || (j % 12) === 8)) {
                    tonalityMask[(j + i) % 36] = 0;
                }
                if ((which === 4) && ((j % 12) === 4 || (j % 12) === 6 || (j % 12) === 11)) {
                    tonalityMask[(j + i) % 36] = 0;
                }
                if ((which === 8) && ((j % 12) === 1 || (j % 12) === 3 || (j % 12) === 8)) {
                    tonalityMask[(j + i) % 36] = 0;
                }
                if ((which === 9) && ((j % 12) === 1 || (j % 12) === 6 || (j % 12) === 11)) {
                    tonalityMask[(j + i) % 36] = 0;
                }
                if ((which === 10) && ((j % 12) === 1 || (j % 12) === 6 || (j % 12) === 11)) {
                    tonalityMask[(j + i) % 36] = 0;
                }
                if ((which === 11) && ((j % 12) === 4 || (j % 12) === 9 || (j % 12) === 11)) {
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
    /*pianoKeys.forEach((pianokey) => {
        if (!pianokey.classList.contains("notPossibleCF"))
            pianokey.classList.remove("notPossible")
        else if (!pianokey.classList.contains("notPossible"))
            pianokey.classList.add("notPossible")
    })*/
    newPossibilities(CFNotes[CFNotes.length] - 1)
})
CTPScore.addEventListener("click", () => {
    if (CFScore.classList.contains('selectedScore')) {CFScore.classList.remove('selectedScore')}
    whichScore = "CTP";
    if (!CTPScore.classList.contains('selectedScore')) {CTPScore.classList.add('selectedScore')}
    //TODO: aggiungere questo per rendere di nuovo tutto libero
    /*pianoKeys.forEach(pianokey => {
        if (!pianokey.classList.contains("notPossibleCTP"))
            pianokey.classList.remove("notPossible")
        else if (!pianokey.classList.contains("notPossible"))
            pianokey.classList.add("notPossible")
    })*/
    newPossibilities(CTPNotes[CTPNotes.length] - 1)
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
            if (((((Number(number) - CFNotes[0]) % 12) === 8) || (((CFNotes[0] - Number(number)) % 12) === 4)) && (tonalityMask[(CFNotes[0] + 7) % 36] !== 0)) {
                setTonalityMask(Number(number) - 1, 8); // Means ("this note index", "is the minor 6th") so it's a minor scale
            }
            if (((((Number(number) - CFNotes[0]) % 12) === 9) || (((CFNotes[0] - Number(number)) % 12) === 3)) && (tonalityMask[(CFNotes[0] + 8) % 36] !== 0)) {
                setTonalityMask(Number(number) - 1, 9); // Means ("this note index", "is the major 6th") so it's a major scale
            }
            if (((((Number(number) - CFNotes[0]) % 12) === 10) || (((CFNotes[0] - Number(number)) % 12) === 2)) && (tonalityMask[(CFNotes[0] + 9) % 36] !== 0)) {
                setTonalityMask(Number(number) - 1, 10); // Means ("this note index", "is the minor 7th") so it's a minor scale
            }
            if (((((Number(number) - CFNotes[0]) % 12) === 11) || (((CFNotes[0] - Number(number)) % 12) === 1)) && (tonalityMask[(CFNotes[0] + 10) % 36] !== 0)) {
                setTonalityMask(Number(number) - 1, 11); // Means ("this note index", "is the major 7th") so it's a major scale
            }
            writeNote(number, noteNames[Number(number) - 1], indexCF, (whichScore !== "CF"));
            CFNotes[indexCF] = Number(number);
            indexCF = indexCF + 1;
            let currentAudio = new Audio(newUrl)
            notePlayingCF = currentAudio;
            currentAudio.play();
        } else {
            if (indexCTP >= 8) {
                indexCTP = 0
            }
            if (indexCTP === 0) {
                clearScore();
            }
            writeNote(number, noteNames[Number(number) - 1], indexCTP + 8, (whichScore !== "CF"));
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
    if (indexCF === 8) {
        clearTonalityMask();
        clearPossibilities();
    }
    else {
        clearPossibilities()
        pianoKeys.forEach((pianoKey, i) => {
            pianoKey.classList.remove("notPossibleCF")
            pianoKey.classList.remove("notPossibleCTP")
            // TODO: here goes the conditions for NOT good notes
            // TODO: finire tutti i salti minori e maggiori/minori
            // TODO: Regolamentare il climax (almeno sulla terza nota suonata)
            // TODO: Implementare le regole dei salti
            // TODO: Regolamentare il contrappunto
            if (whichScore === "CF") {  // Here the CF's conditions
                if (indexCF === 6) {
                    if ((i !== (CFNotes[0] + 1)) && (i !== ((CFNotes[0] + 13) % 36)) && (i !== ((CFNotes[0] + 25) % 36))) {
                        pianoKey.classList.add("notPossible")
                        pianoKey.classList.add("notPossibleCF")
                    } // La penultima nota può essere solo il secondo grado
                    if (i === 0 || i === 1) {pianoKey.classList.add("notPossible")} // Non posso concludere scendendo se sono già a fondo tastiera
                }
                else {
                    if (indexCF === 7) {
                        if (i !== (CFNotes[6] - 3)) {
                            pianoKey.classList.add("notPossible")
                            pianoKey.classList.add("notPossibleCF")
                        } // L'ultima nota può essere solo la tonica
                    } else {
                        if (Math.abs(Number(offset) - i) > 12 ||  // Salti non più larghi di un'ottava
                            Math.abs(Number(offset) - i) === 9 || // Salti di 9 semitoni
                            Math.abs(Number(offset) - i) === 10 || // Salti di 10 semitoni
                            Math.abs(Number(offset) - i) === 11 || // Salti di 11 semitoni
                            // Rispetto alla nota più alta o più bassa suonata non può essere più lontano di 16 ST
                            (Math.max(...CFNotes) - i) > 15 || // Considero 2 in meno (15 invece di 17) perché dovrò concludere con 2 -> 1
                            (i - Math.min(...(CFNotes.filter(a => a !== 0)))) > 15 || // Tolgo gli 0.
                            Math.abs(Number(offset) - i) === 0 || // Non si possono ripetere le stesse note
                            pianoKey.classList.contains("outOfTonality")) {
                            pianoKey.classList.add("notPossible")
                            pianoKey.classList.add("notPossibleCF")
                        }
                        else {
                            // Tutti i vari salti
                            if (tonalityMask[3] === 0) {     // Sono maggiore
                                if ((Number(offset) - i) === 8) {
                                    pianoKey.classList.add("notPossible")
                                    pianoKey.classList.add("notPossibleCF")
                                }
                                if (((Number(offset) - (CFNotes[0] - 1)) !== 5) && (Number(offset) - i) === 6) {
                                    pianoKey.classList.add("notPossible")
                                    pianoKey.classList.add("notPossibleCF")
                                }
                                if (((Number(offset) - (CFNotes[0] - 1)) === 5) && (Number(offset) - i) === 7) {
                                    pianoKey.classList.add("notPossible")
                                    pianoKey.classList.add("notPossibleCF")
                                }
                                if (((Number(offset) - (CFNotes[0] - 1)) === 4 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 9 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 11) && (Number(offset) - i) === 3) {
                                    pianoKey.classList.add("notPossible")
                                    pianoKey.classList.add("notPossibleCF")
                                }
                                if (((Number(offset) - (CFNotes[0] - 1)) === 0 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 2 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 5 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 7) && (Number(offset) - i) === 4) {
                                    pianoKey.classList.add("notPossible")
                                    pianoKey.classList.add("notPossibleCF")
                                }
                                if (((Number(offset) - (CFNotes[0] - 1)) === 0 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 2 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 5) && (Number(offset) - i) === 2) {
                                    pianoKey.classList.add("notPossible")
                                    pianoKey.classList.add("notPossibleCF")
                                }
                                if (((Number(offset) - (CFNotes[0] - 1)) === 4 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 7 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 9 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 11) && (Number(offset) - i) === 1) {
                                    pianoKey.classList.add("notPossible")
                                    pianoKey.classList.add("notPossibleCF")
                                }
                                if (((Number(offset) - (CFNotes[0] - 1)) === 4 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 11) && (i - Number(offset)) === 2) {
                                    pianoKey.classList.add("notPossible")
                                    pianoKey.classList.add("notPossibleCF")
                                }
                                if (((Number(offset) - (CFNotes[0] - 1)) === 0 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 2 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 5 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 7 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 9) && (i - Number(offset)) === 1) {
                                    pianoKey.classList.add("notPossible")
                                    pianoKey.classList.add("notPossibleCF")
                                }
                                if (((Number(offset) - (CFNotes[0] - 1)) === 0 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 5 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 7) && (i - Number(offset)) === 3) {
                                    pianoKey.classList.add("notPossible")
                                    pianoKey.classList.add("notPossibleCF")
                                }
                                if (((Number(offset) - (CFNotes[0] - 1)) === 2 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 4 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 9 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 11) && (i - Number(offset)) === 4) {
                                    pianoKey.classList.add("notPossible")
                                    pianoKey.classList.add("notPossibleCF")
                                }
                                if (((Number(offset) - (CFNotes[0] - 1)) === 5 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 11) && (i - Number(offset)) === 7) {
                                    pianoKey.classList.add("notPossible")
                                    pianoKey.classList.add("notPossibleCF")
                                }
                                if (((Number(offset) - (CFNotes[0] - 1)) === 0 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 2 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 4 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 7 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 9) && (i - Number(offset)) === 6) {
                                    pianoKey.classList.add("notPossible")
                                    pianoKey.classList.add("notPossibleCF")
                                }
                                if (((Number(offset) - (CFNotes[0] - 1)) === 0 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 2 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 5 ||
                                    (Number(offset) - (CFNotes[0] - 1)) === 7) && (i - Number(offset)) === 8) {
                                    pianoKey.classList.add("notPossible")
                                    pianoKey.classList.add("notPossibleCF")
                                }
                            }
                            else {
                                if (tonalityMask[4] === 0) {     // Sono minore

                                }
                                else {      // Non sono ancora né maggiore né minore

                                }
                            }
                        }
                    }
                }
            }
            else {  // Here the CTP's conditions
                // Per fare riferimento alla nota del CF corrispondente utilizzare (CFNotes[<indice>] - 1), con <indice> che va da 0 a 7
                if (indexCTP === 0) {
                    if (((CFNotes[0] - 1) !== i) && ((CFNotes[0] + 6) !== i) &&
                        ((CFNotes[0] - 13) !== i) && ((CFNotes[0] - 18) !== i) &&
                        ((CFNotes[0] - 25) !== i) && ((CFNotes[0] + 11) !== i) &&
                        ((CFNotes[0] + 18) !== i) && ((CFNotes[0] + 23) !== i) &&
                        ((CFNotes[0] - 6) !== i) && ((CFNotes[0] + 35) !== i) &&
                        ((CFNotes[0] + 30) !== i) && ((CFNotes[0] - 30) !== i)) {
                        if (!pianoKey.classList.contains("notPossible")) {
                            pianoKey.classList.add("notPossible")
                            pianoKey.classList.add("notPossibleCTP")
                        }
                    } else {
                        if (pianoKey.classList.contains("notPossible")) {
                            pianoKey.classList.remove("notPossible")
                            pianoKey.classList.remove("notPossibleCTP")
                        }
                    }
                }
            }
        })
    }
}

// It writes the note you played in the CF/CTP tabs + pentagramma
function writeNote(number, note, index, ctp) {
    noteTexts.forEach((text, i) => {
        if (i === index) {text.innerHTML = note;}
    })
    // chiama la funzione che scrive sul pentagramma.
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

// SCRITTURA SU PENTAGRAMMA
const canvas = document.getElementById("canvas_score");
const ctx = canvas.getContext("2d");
const yHighestLine = 30
const noteGap = 7

function drawStaves() {
    for (let i=0; i<5; i++)
        ctx.fillRect(0, yHighestLine + (i*(noteGap*2)), 920, 1)
    for (let i=0; i<5; i++)
        ctx.fillRect(0, yHighestLine + 100 + (i*(noteGap*2)), 920, 1)
}

drawStaves()

const alteredNotes = [1, 3, 6, 8, 10, 13, 15, 18, 20, 22]
let yCoordinatesHigherStave = []
let yCoordinatesLowerStave = []

function initializeStaves() {
    let i = 10
    while (i >= -4) {
        if (alteredNotes.includes(yCoordinatesHigherStave.length))
            yCoordinatesHigherStave.push(0)
        else {
            yCoordinatesHigherStave.push(yHighestLine + (noteGap * i))
            i = i - 1
        }
    }
    i = 5
    while (i >= -1) {
        if (alteredNotes.includes(yCoordinatesLowerStave.length))
            yCoordinatesLowerStave.push(0)
        else {
            yCoordinatesLowerStave.push(yHighestLine + 100 + (noteGap * i))
            i = i - 1
        }
    }
}

initializeStaves()

function drawNote(number, index, ctp) {
    ctx.fillStyle = "rgb(0, 0, 0)"
    if (index === 0) {
        ctx.clearRect(0, 0, 1015, 200)
        drawStaves()
        if (ctp)
            for (let i=0; i<CFNotes.length; i++)
                drawNote(CFNotes[i], i,false)
    }
    let x = 150 + 100 * index
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
            ctx.fillStyle = "rgb(0,0,0)"
        if (number < 2)
            ctx.fillRect(x-(noteGap*3/2), y, noteGap*3, noteGap/6)
        if (number >= 21 && number <= 22)
            ctx.fillRect(x-(noteGap*3/2), y, noteGap*3, noteGap/6)
        if (number > 22) {
            ctx.fillRect(x-(noteGap*3/2), y+noteGap, noteGap*3, noteGap/6)
            if (number > 23)
                ctx.fillRect(x-(noteGap*3/2), y, noteGap*3, noteGap/6)
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
        ctx.strokeStyle = "rgb(0,0,0)"
    ctx.beginPath()
    ctx.arc(x, y, noteGap, 0, 2 * Math.PI)
    ctx.lineWidth = 1.5;
    ctx.stroke()
}

function drawSharp(x, y, ctp) {
    x = x - 20
    y = y - 6
    if (ctp)
        ctx.fillStyle = "rgb(255, 255, 255)"
    else
        ctx.fillStyle = "rgb(0,0,0)"
    ctx.fillRect(x, y, 1, 15)
    ctx.fillRect(x+5, y-2, 1, 15)
    ctx.fillRect(x-3, y+3, 11, 1)
    ctx.fillRect(x-3, y+8, 11, 1)
}