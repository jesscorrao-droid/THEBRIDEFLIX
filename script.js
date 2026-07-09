/* =====================================================
   BRIDEFLIX
   SCRIPT.JS
=====================================================*/

// ----------------------------
// ELEMENTI
// ----------------------------

const trailerButton = document.getElementById("watchTrailer");
const modal = document.getElementById("videoModal");
const closeButton = document.querySelector(".close");
const iframe = document.getElementById("trailerVideo");

const trailerURL =
"https://www.youtube.com/embed/iRvdNalM-To?autoplay=1";

// ----------------------------
// APERTURA TRAILER
// ----------------------------

if (trailerButton) {

    trailerButton.addEventListener("click", () => {

        iframe.src = trailerURL;

        modal.style.display = "block";

        document.body.style.overflow = "hidden";

    });

}

// ----------------------------
// CHIUSURA POPUP
// ----------------------------

function closeVideo(){

    modal.style.display = "none";

    iframe.src = "";

    document.body.style.overflow = "auto";

}

if(closeButton){

    closeButton.addEventListener("click",closeVideo);

}

// ----------------------------
// CLICK FUORI DAL VIDEO
// ----------------------------

window.addEventListener("click",(event)=>{

    if(event.target===modal){

        closeVideo();

    }

});

// ----------------------------
// TASTO ESC
// ----------------------------

document.addEventListener("keydown",(event)=>{

    if(event.key==="Escape"){

        closeVideo();

    }

});

// ----------------------------
// NAVBAR SCURA DURANTE LO SCROLL
// ----------------------------

const header = document.querySelector("header");

window.addEventListener("scroll",()=>{

    if(window.scrollY>80){

        header.style.background="#000";

    }

    else{

        header.style.background="linear-gradient(to bottom,#000,transparent)";

    }

});

// ----------------------------
// ANIMAZIONE CARD
// ----------------------------

const cards=document.querySelectorAll(".card");

cards.forEach(card=>{

    card.addEventListener("mouseenter",()=>{

        card.style.transform="scale(1.06)";

    });

    card.addEventListener("mouseleave",()=>{

        card.style.transform="scale(1)";

    });

});

// ----------------------------
// MESSAGGIO PROVVISORIO
// ----------------------------

cards.forEach(card=>{

    card.addEventListener("click",()=>{

        alert("Qui apriremo il video selezionato.");

    });

});
