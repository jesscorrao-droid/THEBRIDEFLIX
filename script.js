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

// SUPABASE
const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


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

// ===========================
// DEDICHE
// ===========================

const dedicaModal=document.getElementById("dedicaModal");

const dedicaFoto=document.getElementById("dedicaFoto");

const dedicaNome=document.getElementById("dedicaNome");

const dedicaMessaggio=document.getElementById("dedicaMessaggio");

const closeDedica=document.getElementById("closeDedica");

function openDedica(d){

    dedicaFoto.src=d.foto;

    dedicaNome.innerText=d.nome;

    dedicaMessaggio.innerText=d.messaggio;

    dedicaModal.style.display="block";

    document.body.style.overflow="hidden";

}

function closeDedicaModal(){

    dedicaModal.style.display="none";

    document.body.style.overflow="auto";

}

closeDedica.addEventListener("click",closeDedicaModal);

window.addEventListener("click",(e)=>{

    if(e.target===dedicaModal){

        closeDedicaModal();

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

createCategory("party", "partyRow");
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

async function caricaDediche(){

    const { data, error } = await sb
        .from("dediche")
        .select("*")
        .order("id", { ascending:false });

    if(error){

        console.log(error);

        return;

    }

    const row = document.getElementById("dediche-row");

    row.innerHTML="";

   data.forEach(d => {

    const card = document.createElement("div");

    card.className = "card dedica-card";

    card.innerHTML = `
        <img src="${d.foto}" alt="${d.nome}">
        <h3>${d.nome}</h3>
    `;

    card.addEventListener("click", () => {
        openDedica(d);
    });

    row.appendChild(card);

});

}

async function caricaWeddingDedications() {

    const { data, error } = await sb
        .from("dediche")
        .select("*")
        .order("id", { ascending: false });

    if (error) {

        console.log(error);

        return;

    }

    const box = document.getElementById("dedicheHome");

    if (!box) return;

    const totale = data.length;

    const immagini = data.slice(0, 4);

    box.innerHTML = `

        <div class="dediche-home-card">

            <div class="dediche-collage">

                ${immagini.map(d=>`
                    <img src="${d.foto}">
                `).join("")}

            </div>

            <div class="dediche-info">

                <h3>❤️ ${totale} Wedding Memories</h3>

                <p>
                    Guarda tutte le fotografie e le dediche
                    lasciate dagli invitati.
                </p>

                <button class="playDediche">

                    ▶ APRI

                </button>

            </div>

        </div>

    `;

    box.querySelector(".playDediche").addEventListener("click",()=>{

        window.location="dediche.html";

    });

}

async function aggiornaContatoreDediche(){

    const { count, error } = await sb
        .from("dediche")
        .select("*",{
            count:"exact",
            head:true
        });

    if(error){

        console.log(error);
        return;

    }

    const counter = document.getElementById("dedicationCounter");

    if(counter){

        counter.innerHTML = `❤️ ${count} Wedding Memories`;

    }

}

aggiornaContatoreDediche();

document.getElementById("dedicationCard").onclick = () => {

    window.location = "ricordi.html";

};
