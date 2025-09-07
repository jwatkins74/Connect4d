import game from "./game";
import "./styles.css"
MainPage();



//Helper Functions
function createDiv() {
    const div1 = document.createElement("div");
    div1.classList.add("row")
    document.body.appendChild(div1);
    return div1;
}

function removeAllElements() {
    while (document.body.childElementCount > 0) {
        document.body.removeChild(document.body.firstChild);
    }
}

//Pages
function MainPage() {
    const title = document.createElement("h1");
    let titlediv = createDiv();
    titlediv.appendChild(title);
    title.innerText = "3D Connect 4"

    let subdiv = createDiv();
    const subtitle = document.createElement("h3");
    subdiv.appendChild(subtitle);
    subtitle.innerText = "Welcome to 3D Connect 4- Match 4 to win!"

    const settingsButton = document.createElement("button");

    let howDiv = createDiv();
    const howButton = document.createElement("button");
    howButton.innerText = "How to Play?"
    howDiv.appendChild(howButton);

    let startDiv = createDiv();
    const startButton = document.createElement("button");
    startButton.innerText = "Start Game"
    startDiv.appendChild(startButton);

    //Events - Home
    startButton.addEventListener("click", () => {
        removeAllElements();
        const divWinner = createDiv();
        divWinner.id = "winner";
        divWinner.classList.add("winner");
        const p = document.createElement("p");
        p.id="text";
        divWinner.appendChild(p);

        const restartButton = document.createElement("button");
        restartButton.id = "restart";
        restartButton.classList.add("restart");

        const homeButton = document.createElement("button");
        homeButton.id = "homebutton";
        restartButton.classList.add("home");

        homeButton.addEventListener("click", () => {
            removeAllElements();
            MainPage();
        })
        homeButton.textContent = "Home";
        restartButton.textContent = "Restart";
        const buttonDiv = createDiv();
        buttonDiv.appendChild(restartButton);
        buttonDiv.appendChild(homeButton);
        buttonDiv.id = "buttonDiv";

        game();
    })

    howButton.addEventListener("click", () => {
        removeAllElements();
        AboutPage();
    
    })
}

function AboutPage() {
    let backDiv = createDiv();
    const backButton = document.createElement("button");
    backButton.innerText = "Back"
    backDiv.appendChild(backButton);


    let textdiv = createDiv();
    const text = document.createElement("p");
    textdiv.appendChild(text);
    text.innerText = "3D Connect 4 is a two player game where each player tries to connect 4 squares of their color, in any direction, the first to do so wins the game." 

    const controls = ["Hold Left click/ drag to rotate camera", "Right click/ use two fingers to move camera", "Click/ touch to place a block (aim at the grid)"];
    const ul = document.createElement("ul");
    controls.forEach(element => {
        let li = document.createElement("li");
        li.textContent = element;
        ul.appendChild(li);
    });

    let listdiv = createDiv();
    listdiv.appendChild(ul);

    backButton.addEventListener("click", () => {
        removeAllElements();
        MainPage()
    })
}