/* =====================================================
   BRIDEFLIX
   SCRIPT.JS
=====================================================*/

// ----------------------------
// ELEMENTI
// ----------------------------

const modal = document.getElementById("videoModal");
const iframe = document.getElementById("trailerVideo");
const closeButton = document.querySelector(".close");
const homeButton = document.getElementById("goHome");
let lastScrollPosition = 0;



// ----------------------------
// APRE VIDEO
// ----------------------------

function openVideo(url){

    if(!url) return;

    // Salva la posizione della pagina
    lastScrollPosition = window.scrollY;

    iframe.src = url;

    modal.style.display = "block";

    document.body.style.overflow = "hidden";

}

// ----------------------------
// CHIUDE VIDEO
// ----------------------------

function closeVideo(){

    modal.style.display="none";

    iframe.src="";

    document.body.style.overflow="auto";

}

closeButton.addEventListener("click",closeVideo);

window.addEventListener("click",(e)=>{

    if(e.target===modal){

        closeVideo();

    }

});

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        closeVideo();

    }

});

// ----------------------------
// TORNA ALLA HOME
// ----------------------------

homeButton.addEventListener("click",()=>{

    closeVideo();

    window.scrollTo({

        top:lastScrollPosition,

        behavior:"smooth"

    });

});

// ----------------------------
// HEADER SCROLL
// ----------------------------

const header=document.querySelector("header");

window.addEventListener("scroll",()=>{

    if(window.scrollY>60){

        header.style.background="#000";

    }

    else{

        header.style.background="linear-gradient(to bottom,#000,transparent)";

    }

});

// ----------------------------
// CREAZIONE AUTOMATICA CARD
// ----------------------------

createCategory("party","partyCards");
createCategory("nautoscopio","nautoscopioCards");
createCategory("wedding","weddingCards");
createCategory("special","specialCards");

function createCategory(category,containerID){

    const container=document.getElementById(containerID);

    if(!container) return;

    const list=videos.filter(v=>v.category===category);

    list.forEach(video=>{

        const card=document.createElement("div");

        card.className="card";

        card.innerHTML=`

            <img src="${video.image}" alt="${video.title}">

            <h3>${video.title}</h3>

        `;

        if(video.youtube!=""){

            card.addEventListener("click",()=>{

                openVideo(video.youtube);

            });

        }

        container.appendChild(card);

    });

}

/* ======================================
   PWA
====================================== */

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("./service-worker.js")

            .then(() => {

                console.log("BrideFlix PWA attiva");

            })

            .catch(err => {

                console.log(err);

            });

    });

}

/* =====================================================
   BRIDEFLIX TV MODE - STEP 1
===================================================== */

let currentCard = null;
let cards = [];

function updateFocus(card = null) {

    cards = [...document.querySelectorAll(".card")];

    if (!cards.length) return;

    cards.forEach(c => c.classList.remove("tv-focus"));

    if (!currentCard) {

        currentCard = cards[0];

    }

    if (card) {

        currentCard = card;

    }

    currentCard.classList.add("tv-focus");

    currentCard.scrollIntoView({

        behavior: "smooth",
        block: "nearest",
        inline: "center"

    });

}

window.addEventListener("load", () => {

    setTimeout(() => {

        cards = [...document.querySelectorAll(".card")];

        if (cards.length) {

            updateFocus(cards[0]);

        }

    }, 500);

});

function findClosestCard(direction) {

    const currentRect = currentCard.getBoundingClientRect();

    let candidate = null;
    let bestDistance = Infinity;

    cards.forEach(card => {

        if (card === currentCard) return;

        const rect = card.getBoundingClientRect();

        let valid = false;

        switch(direction){

            case "up":
                valid = rect.top < currentRect.top - 20;
                break;

            case "down":
                valid = rect.top > currentRect.top + 20;
                break;

        }

        if(!valid) return;

        const distance = Math.abs(rect.top-currentRect.top)
                       + Math.abs(rect.left-currentRect.left);

        if(distance < bestDistance){

            bestDistance = distance;
            candidate = card;

        }

    });

    return candidate;

}

document.addEventListener("keydown", e => {

    cards = [...document.querySelectorAll(".card")];

    if (!cards.length || !currentCard) return;

    let currentIndex = cards.indexOf(currentCard);

    switch (e.key) {

        case "ArrowRight":

            e.preventDefault();

            if (currentIndex < cards.length - 1) {

                updateFocus(cards[currentIndex + 1]);

            }

            break;

        case "ArrowLeft":

            e.preventDefault();

            if (currentIndex > 0) {

                updateFocus(cards[currentIndex - 1]);

            }

            break;

        case "Enter":

            e.preventDefault();

            currentCard.click();

            break;

        case "Escape":

            e.preventDefault();

            closeVideo();

            break;

    }

});