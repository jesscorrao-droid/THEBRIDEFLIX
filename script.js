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
const trailerButton = document.getElementById("watchTrailer");
const homeButton = document.getElementById("goHome");
let lastScrollPosition = 0;

// ----------------------------
// TRAILER PRINCIPALE
// ----------------------------

const trailerURL="https://www.youtube.com/embed/iRvdNalM-To?autoplay=1";

if(trailerButton){

    trailerButton.addEventListener("click",()=>{

        openVideo(trailerURL);

    });

}

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