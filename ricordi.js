// ===============================
// BrideFlix Memories Viewer
// Parte 1A
// ===============================

// -------------------------------
// Connessione Supabase
// -------------------------------

const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// -------------------------------
// Stato applicazione
// -------------------------------

let dediche = [];
let currentIndex = 0;
let currentCard = null;

// -------------------------------
// Elementi DOM
// -------------------------------

const gallery = document.getElementById("gallery");

const viewer = document.getElementById("viewer");

const viewerImage = document.getElementById("viewerImage");

const viewerMessage = document.getElementById("viewerMessage");

const viewerAuthor = document.getElementById("viewerAuthor");

const viewerDate = document.getElementById("viewerDate");

const viewerCounter = document.getElementById("viewerCounter");

const closeButton = document.getElementById("closeViewer");

const prevButton = document.getElementById("prevPhoto");

const nextButton = document.getElementById("nextPhoto");

// -------------------------------
// Swipe
// -------------------------------

let touchStartX = 0;
let touchEndX = 0;

// -------------------------------
// Carica dediche
// -------------------------------

async function caricaRicordi() {

    const { data, error } = await sb
        .from("dediche")
        .select("*")
        .order("id", { ascending: false });

    if (error) {

        console.error(error);

        return;

    }

    dediche = data || [];

    gallery.innerHTML = "";

    dediche.forEach((item, index) => {

        const card = document.createElement("div");

     card.className = "card dedication-card";

        let dataFormattata = "";

        if (item.creato_il) {

            dataFormattata = new Date(item.creato_il)
                .toLocaleString("it-IT");

        }

        card.innerHTML = `

            <img src="${item.foto}" loading="lazy">

            <div class="content">

                <div class="message">

                    ❝ ${item.messaggio || ""}

                </div>

                <div class="author">

                    — ${item.nome || "Anonimo"} ❤️

                </div>

                <div class="date">

                    ${dataFormattata}

                </div>

            </div>

        `;

        card.addEventListener("click", () => {

            currentIndex = index;

            currentCard = card;

            showViewer();

        });

        gallery.appendChild(card);

    });

}

// =====================================
// VIEWER
// =====================================

function showViewer() {

    const item = dediche[currentIndex];

    if (!item) return;

    let dataFormattata = "";

    if (item.creato_il) {

        dataFormattata = new Date(item.creato_il)
            .toLocaleString("it-IT");

    }

    viewer.style.display = "flex";

    document.body.style.overflow = "hidden";

    // Dissolvenza immagine

    viewerImage.style.opacity = "0";

    setTimeout(() => {

        viewerImage.src = item.foto;

    }, 120);

    viewerImage.onload = () => {

        viewerImage.style.opacity = "1";

    };

    viewerMessage.innerHTML = "❝ " + (item.messaggio || "");

    viewerAuthor.innerHTML = "— " + (item.nome || "Anonimo") + " ❤️";

    viewerDate.innerHTML = dataFormattata;

    viewerCounter.innerHTML =
        `${currentIndex + 1} di ${dediche.length} Wedding Memories`;

    // Gestione frecce

    if (currentIndex === 0) {

        prevButton.style.visibility = "hidden";

    } else {

        prevButton.style.visibility = "visible";

    }

    if (currentIndex === dediche.length - 1) {

        nextButton.style.visibility = "hidden";

    } else {

        nextButton.style.visibility = "visible";

    }

    preloadImages();

}


// =====================================
// FOTO SUCCESSIVA
// =====================================

function nextPhoto() {

    if (currentIndex >= dediche.length - 1) return;

    currentIndex++;

    showViewer();

}


// =====================================
// FOTO PRECEDENTE
// =====================================

function previousPhoto() {

    if (currentIndex <= 0) return;

    currentIndex--;

    showViewer();

}


// =====================================
// PRELOAD IMMAGINI
// =====================================

function preloadImages() {

    if (currentIndex + 1 < dediche.length) {

        const img = new Image();

        img.src = dediche[currentIndex + 1].foto;

    }

    if (currentIndex > 0) {

        const img = new Image();

        img.src = dediche[currentIndex - 1].foto;

    }

}


// =====================================
// AVVIO
// =====================================

caricaRicordi();

// =====================================
// CHIUSURA VIEWER
// =====================================

function closeViewer() {

    viewer.style.display = "none";

    document.body.style.overflow = "auto";

    if (currentCard) {

        currentCard.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

        currentCard.classList.add("activeCard");

        setTimeout(() => {

            currentCard.classList.remove("activeCard");

        }, 1200);

    }

}


// =====================================
// PULSANTI
// =====================================

closeButton.addEventListener("click", closeViewer);

prevButton.addEventListener("click", previousPhoto);

nextButton.addEventListener("click", nextPhoto);


// =====================================
// CLICK SULL'IMMAGINE
// =====================================

viewerImage.addEventListener("click", () => {

    nextPhoto();

});


// =====================================
// CLICK SULLO SFONDO
// =====================================

viewer.addEventListener("click", e => {

    if (e.target === viewer) {

        closeViewer();

    }

});


// =====================================
// TASTIERA
// =====================================

document.addEventListener("keydown", e => {

    if (viewer.style.display !== "flex") return;

    switch (e.key) {

        case "ArrowRight":

            nextPhoto();

            break;

        case "ArrowLeft":

            previousPhoto();

            break;

        case "Escape":

            closeViewer();

            break;

    }

});


// =====================================
// SWIPE MOBILE
// =====================================

viewer.addEventListener("touchstart", e => {

    touchStartX = e.changedTouches[0].screenX;

});

viewer.addEventListener("touchend", e => {

    touchEndX = e.changedTouches[0].screenX;

    const diff = touchStartX - touchEndX;

    if (diff > 60) {

        nextPhoto();

    }

    if (diff < -60) {

        previousPhoto();

    }

});


// =====================================
// PREVIENE IL DRAG DELL'IMMAGINE
// =====================================

viewerImage.draggable = false;


// =====================================
// PRELOAD INIZIALE
// =====================================

window.addEventListener("load", () => {

    preloadImages();

});
