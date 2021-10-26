const readline = require("readline");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

const startingTime = new Date().getTime();
let rawSentance = "",
    sentence = "",
    text = "",
    currentLine = 1,
    mistakes = 0,
    totalLetters = 0;
const letters = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "_",
    "+",
    "-",
    "=",
    "[",
    "{",
    "]",
    "}",
    '"',
    "'",
    ";",
    ":",
    ",",
    ".",
    "/",
    "<",
    ">",
    "?",
    " ",
    "`",
];

readline.emitKeypressEvents(process.stdin);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const question = (querry) => {
    return new Promise((resolve) => {
        rl.question(querry, (ans) => {
            resolve(ans);
        });
    });
};

if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}

async function main() {
    const fileSrc = await question("Src? (or enter for default text) ");

    if (fileSrc) {
        const p = path.join(process.cwd(), fileSrc);
        if (!p.includes(".txt"))
            return console.log(chalk.red("Only support txt file"));
        rawSentance = fs.readFileSync(p).toString().trim();
    } else {
        rawSentance = `Lorem ipsum,
dolor sit amet consectetur adipisicing elit. Voluptate, provident?
Animi voluptate neque sequi autem accusamus veritatis dolorem totam quasi error
esse labore, dolore soluta? Sit adipisci eos voluptates non eius quae similique
excepturi suscipit voluptate quia praesentium tenetur sed hic porro vel
repudiandae, laudantium possimus omnis. Adipisci animi aliquid ab? Laborum
cupiditate ea beatae distinctio amet perferendis blanditiis veritatis voluptatum
consequuntur, modi voluptatem velit temporibus quaerat accusamus. Dolorem
impedit repudiandae assumenda eius ullam harum, aliquid facere tenetur excepturi
neque totam saepe voluptatem provident. Est quaerat rem quasi placeat nesciunt,
ratione maxime eligendi consequatur provident modi aspernatur? Sequi, tempore
neque.`;
    }
    sentence = rawSentance.split(/\n/g)[0];
    process.stdin.on("keypress", (str, key) => {
        typing(key);
        if (key.ctrl && key.name === "c") {
            process.exit();
        }
    });
    print(chalk.gray(sentence));
}

main();

function typing(key) {
    if (key.sequence === "\b") {
        text = text.slice(0, text.length - 1);
    } else if (letters.includes(key.sequence)) {
        if (key.sequence === sentence[text.length]) {
            text = text.concat(key.sequence);
            totalLetters += 1;
            const writtenText = chalk.white(text);
            const yetToBeWritten = chalk.gray(
                sentence.slice(text.length, sentence.length)
            );
            print(`${writtenText}${yetToBeWritten}`);
        } else {
            const writtenText = chalk.bgRed(chalk.white(text));
            const yetToBeWritten = chalk.gray(
                sentence.slice(text.length, sentence.length)
            );
            mistakes += 1;
            print(`${writtenText}${yetToBeWritten}`);
        }
    } else if (key.sequence === "\r") {
        currentLine += 1;
        if (rawSentance.split(/\n/g).length >= currentLine) {
            sentence = rawSentance.split(/\n/g)[currentLine - 1];
            text = "";
            print(chalk.gray(sentence));
        } else {
            const exitingTime = new Date().getTime();
            const totalTime = (exitingTime - startingTime) / 1000;
            const grossSpeed = Math.floor(totalLetters / 5 / (totalTime / 60));
            const totalSpeed = Math.floor(
                (totalLetters - mistakes) / 5 / (totalTime / 60)
            );
            console.clear();
            console.log(`
    Total time:     ${totalTime}s
    Total mistakes: ${
        mistakes === 0 ? mistakes + " 😀😎" : mistakes + " 😣🤦‍♀️🤦‍♂️"
    }
    Total letters:  ${totalLetters}
    Gross Speed:    ${grossSpeed} wpm or ${(totalLetters / totalTime)
                .toString()
                .slice(0, 5)} lps
    Total Speed:    ${totalSpeed} wpm or ${(
                (totalLetters - mistakes) /
                totalTime
            )
                .toString()
                .slice(0, 5)} lps
            `);
            process.exit();
        }
    }
}

function print(text) {
    console.clear();
    console.log(text);
    console.log("");
    console.log("");
    console.log("");
    console.log("Mistakes: " + mistakes);
    console.log("click Ctrl + C to quit");
}
