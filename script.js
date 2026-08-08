/* =====================================================
   BRIDEFLIX
   SCRIPT.JS
=====================================================*/

// =====================================================
// ELEMENTI VIDEO
// =====================================================

const modal = document.getElementById("videoModal");

const iframe = document.getElementById("trailerVideo");

const closeButton = document.querySelector(".close");

const homeButton = document.getElementById("goHome");

let lastScrollPosition = 0;


// =====================================================
// SUPABASE
// =====================================================

const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// =====================================================
// APRE VIDEO
// =====================================================

function openVideo(url){

    if(!url) return;

    // Salva la posizione della Home
    lastScrollPosition = window.scrollY;

    // Carica direttamente il link YouTube
    iframe.src = url;

    // Mostra il popup
    modal.style.display = "block";

    // Blocca lo scroll della Home
    document.body.style.overflow = "hidden";

}


// =====================================================
// CHIUDE VIDEO
// =====================================================

function closeVideo(){

    modal.style.display = "none";

    // Svuota l'iframe per fermare il video
    iframe.src = "";

    // Riattiva lo scroll
    document.body.style.overflow = "auto";

}


// =====================================================
// PULSANTE X
// =====================================================

if(closeButton){

    closeButton.addEventListener("click",closeVideo);

}


// =====================================================
// CLIC SULLO SFONDO DEL POPUP
// =====================================================

window.addEventListener("click",(e)=>{

    if(e.target === modal){

        closeVideo();

    }

});


// =====================================================
// ESC
// =====================================================

document.addEventListener("keydown",(e)=>{

    if(e.key === "Escape"){

        closeVideo();

    }

});


// =====================================================
// HEADER SCROLL
// =====================================================

const header = document.querySelector("header");

window.addEventListener("scroll",()=>{

    if(!header) return;

    if(window.scrollY > 60){

        header.style.background = "#000";

    }else{

        header.style.background =
            "linear-gradient(to bottom,#000,transparent)";

    }

});


// =====================================================
// TORNA ALLA HOME DAL PLAYER
// =====================================================

if(homeButton){

    homeButton.addEventListener("click",()=>{

        closeVideo();

        window.scrollTo({

            top:lastScrollPosition,

            behavior:"smooth"

        });

    });

}


// =====================================================
// CREAZIONE AUTOMATICA CARD
// =====================================================

createCategory("party","partyRow");

createCategory("wedding","weddingCards");

createCategory("special","specialCards");


// =====================================================
// CREA CATEGORIA
// =====================================================

function createCategory(category,containerID){

    const container =
        document.getElementById(containerID);

    if(!container) return;

    const list =
        videos.filter(video => video.category === category);

    list.forEach(video=>{

        const card =
            document.createElement("div");

        card.className = "card";

        card.innerHTML = `

            <img
                src="${video.image}"
                alt="${video.title}"
            >

            <h3>${video.title}</h3>

        `;


        // =================================================
        // VIDEO DISPONIBILE
        // =================================================

        if(video.youtube){

            card.addEventListener("click",()=>{

                openVideo(video.youtube);

            });

        }


        // =================================================
        // VIDEO NON ANCORA DISPONIBILE
        // =================================================

        else{

            card.classList.add("disabled");

        }


        container.appendChild(card);

    });

}

// =====================================================
// DEDICHE
// =====================================================

const dedicaModal =
    document.getElementById("dedicaModal");

const dedicaFoto =
    document.getElementById("dedicaFoto");

const dedicaNome =
    document.getElementById("dedicaNome");

const dedicaMessaggio =
    document.getElementById("dedicaMessaggio");

const closeDedica =
    document.getElementById("closeDedica");


// =====================================================
// APRE DEDICA
// =====================================================

function openDedica(d){

    if(!dedicaModal) return;

    if(dedicaFoto){

        dedicaFoto.src = d.foto;

    }

    if(dedicaNome){

        dedicaNome.textContent = d.nome;

    }

    if(dedicaMessaggio){

        dedicaMessaggio.textContent =
            d.messaggio;

    }

    dedicaModal.style.display = "block";

    document.body.style.overflow = "hidden";

}


// =====================================================
// CHIUDE DEDICA
// =====================================================

function closeDedicaModal(){

    if(!dedicaModal) return;

    dedicaModal.style.display = "none";

    document.body.style.overflow = "auto";

}


// =====================================================
// PULSANTE CHIUDI
// =====================================================

if(closeDedica){

    closeDedica.addEventListener(
        "click",
        closeDedicaModal
    );

}


// =====================================================
// CLICK SULLO SFONDO
// =====================================================

window.addEventListener("click",(e)=>{

    if(
        dedicaModal &&
        e.target === dedicaModal
    ){

        closeDedicaModal();

    }

});


// =====================================================
// ESC DEDICA
// =====================================================

document.addEventListener("keydown",(e)=>{

    if(
        e.key === "Escape" &&
        dedicaModal &&
        dedicaModal.style.display === "block"
    ){

        closeDedicaModal();

    }

});


// =====================================================
// CARICA DEDICHE
// =====================================================

async function caricaDediche(){

    const { data, error } = await sb

        .from("dediche")

        .select("*")

        .order("id", {
            ascending:false
        });


    if(error){

        console.log(
            "Errore caricamento dediche:",
            error
        );

        return;

    }


    const row =
        document.getElementById("dediche-row");

    if(!row) return;


    row.innerHTML = "";


    data.forEach(d=>{

        const card =
            document.createElement("div");

        card.className =
            "card dedica-card";


        card.innerHTML = `

            <img
                src="${d.foto}"
                alt="${d.nome}"
            >

            <h3>${d.nome}</h3>

        `;


        card.addEventListener("click",()=>{

            openDedica(d);

        });


        row.appendChild(card);

    });

}

// =====================================================
// PWA
// =====================================================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("./service-worker.js")

            .then(() => {

                console.log("BrideFlix PWA attiva");

            })

            .catch(error => {

                console.log(
                    "Errore Service Worker:",
                    error
                );

            });

    });

}


// =====================================================
// WEDDING MEMORIES
// =====================================================

async function caricaWeddingDedications() {

    const { data, error } = await sb

        .from("dediche")

        .select("*")

        .order("id", {
            ascending: false
        });


    if (error) {

        console.log(error);

        return;

    }


    const box =
        document.getElementById("dedicheHome");

    if (!box) return;


    const totale = data.length;

    const immagini = data.slice(0, 4);


    box.innerHTML = `

        <div class="dediche-home-card">

            <div class="dediche-collage">

                ${immagini.map(d => `

                    <img
                        src="${d.foto}"
                        alt="${d.nome}"
                    >

                `).join("")}

            </div>


            <div class="dediche-info">

                <h3>
                    ❤️ ${totale} Wedding Memories
                </h3>


                <p>

                    Guarda tutte le fotografie
                    e le dediche lasciate
                    dagli invitati.

                </p>


                <button class="playDediche">

                    ▶ APRI

                </button>

            </div>

        </div>

    `;


    const playButton =
        box.querySelector(".playDediche");


    if (playButton) {

        playButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "ricordi.html";

            }
        );

    }

}


// =====================================================
// CONTATORE WEDDING MEMORIES
// =====================================================

async function aggiornaContatoreDediche() {

    const { count, error } = await sb

        .from("dediche")

        .select("*", {

            count: "exact",

            head: true

        });


    if (error) {

        console.log(error);

        return;

    }


    const counter =
        document.getElementById(
            "dedicationCounter"
        );


    if (counter) {

        counter.innerHTML =
            `❤️ ${count} Wedding Memories`;

    }

}


// =====================================================
// CARD WEDDING MEMORIES
// =====================================================

const dedicationCard =
    document.getElementById(
        "dedicationCard"
    );


if (dedicationCard) {

    dedicationCard.addEventListener(
        "click",
        () => {

            window.location.href =
                "ricordi.html";

        }
    );

}


/* =====================================================
   BRIDEFLIX TV MODE
===================================================== */

let currentCard = null;
let cards = [];


/* =====================================================
   AGGIORNA LE CARD
===================================================== */

function refreshCards(){

    cards = [
        ...document.querySelectorAll(".card")
    ];

}


/* =====================================================
   AGGIORNA IL FOCUS
===================================================== */

function updateFocus(card = null){

    refreshCards();

    if(!cards.length) return;


    cards.forEach(c => {

        c.classList.remove("tv-focus");

    });


    if(card){

        currentCard = card;

    }


    if(!currentCard){

        currentCard = cards[0];

    }


    currentCard.classList.add("tv-focus");


    currentCard.scrollIntoView({

        behavior:"smooth",

        block:"nearest",

        inline:"center"

    });

}


/* =====================================================
   FOCUS INIZIALE
===================================================== */

window.addEventListener("load",()=>{

    setTimeout(()=>{

        refreshCards();

        if(cards.length){

            updateFocus(cards[0]);

        }

    },500);

});


/* =====================================================
   NAVIGAZIONE TELECOMANDO
===================================================== */

document.addEventListener("keydown",(e)=>{

    refreshCards();

    if(!cards.length || !currentCard){

        return;

    }


    const currentIndex =
        cards.indexOf(currentCard);


    switch(e.key){


        /* -----------------------------
           DESTRA
        ----------------------------- */

        case "ArrowRight":

            e.preventDefault();

            if(currentIndex < cards.length - 1){

                updateFocus(
                    cards[currentIndex + 1]
                );

            }

            break;


        /* -----------------------------
           SINISTRA
        ----------------------------- */

        case "ArrowLeft":

            e.preventDefault();

            if(currentIndex > 0){

                updateFocus(
                    cards[currentIndex - 1]
                );

            }

            break;


        /* -----------------------------
           GIÙ
        ----------------------------- */

        case "ArrowDown":

            e.preventDefault();

            if(currentIndex + 4 < cards.length){

                updateFocus(
                    cards[currentIndex + 4]
                );

            }

            break;


        /* -----------------------------
           SU
        ----------------------------- */

        case "ArrowUp":

            e.preventDefault();

            if(currentIndex - 4 >= 0){

                updateFocus(
                    cards[currentIndex - 4]
                );

            }

            break;


        /* -----------------------------
           ENTER
        ----------------------------- */

        case "Enter":

            e.preventDefault();

            currentCard.click();

            break;


        /* -----------------------------
           ESC
        ----------------------------- */

        case "Escape":

            e.preventDefault();

            closeVideo();

            break;

    }

});