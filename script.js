/* =====================================================
   BRIDEFLIX
   SCRIPT.JS
   VERSIONE STABILE SENZA PLAYER.HTML
===================================================== */


/* =====================================================
   ELEMENTI VIDEO
===================================================== */

const modal =
    document.getElementById("videoModal");

const iframe =
    document.getElementById("trailerVideo");

const closeButton =
    document.querySelector("#videoModal .closeButton");

const homeButton =
    document.getElementById("goHome");

let lastScrollPosition = 0;


/* =====================================================
   CREA LE CARD
   QUESTA PARTE VIENE ESEGUITA SUBITO
===================================================== */

function createCategory(category, containerID) {

    const container =
        document.getElementById(containerID);

    if (!container) {

        console.warn(
            "Container non trovato:",
            containerID
        );

        return;
    }


    /* Pulisce il contenitore */

    container.innerHTML = "";


    /* Cerca i video della categoria */

    if (
        typeof videos === "undefined" ||
        !Array.isArray(videos)
    ) {

        console.error(
            "ERRORE: videos non trovato in data.js"
        );

        return;
    }


    const list =
        videos.filter(function(video) {

            return video.category === category;

        });


    console.log(
        "Categoria:",
        category,
        "Video:",
        list.length
    );


    /* Crea le card */

    list.forEach(function(video) {

        const card =
            document.createElement("div");

        card.className =
            "card";


        if (video.id) {

            card.dataset.id =
                video.id;

        }


        card.innerHTML = `

            <img
                src="${video.image}"
                alt="${video.title}"
            >

            <h3>
                ${video.title}
            </h3>

        `;


        /* ---------------------------------------------
           CLICK VIDEO
        --------------------------------------------- */

        if (video.youtube) {

            card.addEventListener(
                "click",
                function() {

                    openVideo(
                        video.youtube
                    );

                }
            );

        }


        container.appendChild(card);

    });

}


/* =====================================================
   CREA TUTTE LE CATEGORIE
===================================================== */

createCategory(
    "party",
    "partyRow"
);

createCategory(
    "wedding",
    "weddingCards"
);

createCategory(
    "special",
    "specialCards"
);


/* =====================================================
   APRE VIDEO
===================================================== */

function openVideo(url) {

    if (!url) {

        console.error(
            "URL video mancante"
        );

        return;
    }


    if (!iframe) {

        console.error(
            "iframe #trailerVideo non trovato"
        );

        return;
    }


    if (!modal) {

        console.error(
            "#videoModal non trovato"
        );

        return;
    }


    /* Salva posizione */

    lastScrollPosition =
        window.scrollY;


    /* ---------------------------------------------
       CREA URL YOUTUBE
    --------------------------------------------- */

    const separator =
        url.includes("?")
            ? "&"
            : "?";


    const videoURL =
        url +
        separator +
        "autoplay=1&rel=0&playsinline=1";


    console.log(
        "BrideFlix video:",
        videoURL
    );


    /* Carica video */

    iframe.src =
        videoURL;


    /* Mostra popup */

    modal.style.display =
        "block";


    /* Blocca scroll */

    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   CHIUDE VIDEO
===================================================== */

function closeVideo() {

    if (modal) {

        modal.style.display =
            "none";

    }


    if (iframe) {

        iframe.src =
            "";

    }


    document.body.style.overflow =
        "auto";

}


/* =====================================================
   PULSANTE X VIDEO
===================================================== */

if (closeButton) {

    closeButton.addEventListener(
        "click",
        closeVideo
    );

}


/* =====================================================
   CLICK SFONDO VIDEO
===================================================== */

if (modal) {

    modal.addEventListener(
        "click",
        function(e) {

            if (e.target === modal) {

                closeVideo();

            }

        }
    );

}


/* =====================================================
   ESC
===================================================== */

document.addEventListener(
    "keydown",
    function(e) {

        if (e.key === "Escape") {

            closeVideo();

        }

    }
);


/* =====================================================
   TORNA ALLA HOME
===================================================== */

if (homeButton) {

    homeButton.addEventListener(
        "click",
        function() {

            closeVideo();


            window.scrollTo({

                top:
                    lastScrollPosition,

                behavior:
                    "smooth"

            });

        }
    );

}


/* =====================================================
   HEADER
===================================================== */

const header =
    document.querySelector("header");


window.addEventListener(
    "scroll",
    function() {

        if (!header) {
            return;
        }


        if (window.scrollY > 60) {

            header.style.background =
                "#000";

        } else {

            header.style.background =
                "linear-gradient(to bottom,#000,transparent)";

        }

    }
);


/* =====================================================
   DEDICHE
===================================================== */

const dedicaModal =
    document.getElementById(
        "dedicaModal"
    );

const dedicaFoto =
    document.getElementById(
        "dedicaFoto"
    );

const dedicaNome =
    document.getElementById(
        "dedicaNome"
    );

const dedicaMessaggio =
    document.getElementById(
        "dedicaMessaggio"
    );

const closeDedica =
    document.getElementById(
        "closeDedica"
    );


/* =====================================================
   APRE DEDICA
===================================================== */

function openDedica(d) {

    if (!dedicaModal) {
        return;
    }


    if (dedicaFoto) {

        dedicaFoto.src =
            d.foto || "";

    }


    if (dedicaNome) {

        dedicaNome.textContent =
            d.nome || "";

    }


    if (dedicaMessaggio) {

        dedicaMessaggio.textContent =
            d.messaggio || "";

    }


    dedicaModal.style.display =
        "block";


    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   CHIUDE DEDICA
===================================================== */

function closeDedicaModal() {

    if (!dedicaModal) {
        return;
    }


    dedicaModal.style.display =
        "none";


    document.body.style.overflow =
        "auto";

}


/* =====================================================
   PULSANTE CHIUDI DEDICA
===================================================== */

if (closeDedica) {

    closeDedica.addEventListener(
        "click",
        closeDedicaModal
    );

}


/* =====================================================
   CLICK SFONDO DEDICA
===================================================== */

if (dedicaModal) {

    dedicaModal.addEventListener(
        "click",
        function(e) {

            if (e.target === dedicaModal) {

                closeDedicaModal();

            }

        }
    );

}


/* =====================================================
   SUPABASE
   NON DEVE BLOCCARE LE CARD
===================================================== */

let sb = null;


try {

    if (
        window.supabase &&
        typeof SUPABASE_URL !== "undefined" &&
        typeof SUPABASE_KEY !== "undefined"
    ) {

        sb =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );

    }

} catch(error) {

    console.error(
        "Errore inizializzazione Supabase:",
        error
    );

}


/* =====================================================
   CARICA DEDICHE
===================================================== */

async function caricaDediche() {

    if (!sb) {

        console.warn(
            "Supabase non disponibile."
        );

        return;
    }


    try {

        const result =
            await sb
                .from("dediche")
                .select("*")
                .order(
                    "id",
                    {
                        ascending: false
                    }
                );


        const data =
            result.data;

        const error =
            result.error;


        if (error) {

            console.error(
                "Errore dediche:",
                error
            );

            return;
        }


        const row =
            document.getElementById(
                "dediche-row"
            );


        if (!row) {
            return;
        }


        row.innerHTML = "";


        data.forEach(function(d) {

            const card =
                document.createElement("div");


            card.className =
                "card dedica-card";


            card.innerHTML = `

                <img
                    src="${d.foto || ""}"
                    alt="${d.nome || "Dedica"}"
                >

                <h3>
                    ${d.nome || ""}
                </h3>

            `;


            card.addEventListener(
                "click",
                function() {

                    openDedica(d);

                }
            );


            row.appendChild(card);

        });

    } catch(error) {

        console.error(
            "Errore caricamento dediche:",
            error
        );

    }

}


/* =====================================================
   CARICA DEDICHE
===================================================== */

caricaDediche();


/* =====================================================
   PWA
===================================================== */

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(
        "load",
        function() {

            navigator.serviceWorker
                .register(
                    "./service-worker.js"
                )
                .then(function() {

                    console.log(
                        "BrideFlix PWA attiva"
                    );

                })
                .catch(function(error) {

                    console.error(
                        "Errore Service Worker:",
                        error
                    );

                });

        }
    );

}


/* =====================================================
   TV MODE
===================================================== */

let currentCard =
    null;

let cards =
    [];


/* =====================================================
   AGGIORNA CARDS
===================================================== */

function refreshCards() {

    cards = [
        ...document.querySelectorAll(
            ".card"
        )
    ];

}


/* =====================================================
   FOCUS TV
===================================================== */

function updateFocus(card = null) {

    refreshCards();


    if (!cards.length) {
        return;
    }


    cards.forEach(function(c) {

        c.classList.remove(
            "tv-focus"
        );

    });


    if (card) {

        currentCard =
            card;

    }


    if (!currentCard) {

        currentCard =
            cards[0];

    }


    currentCard.classList.add(
        "tv-focus"
    );


    currentCard.scrollIntoView({

        behavior:
            "smooth",

        block:
            "nearest",

        inline:
            "center"

    });

}


/* =====================================================
   PRIMO FOCUS
===================================================== */

window.addEventListener(
    "load",
    function() {

        setTimeout(
            function() {

                refreshCards();


                if (cards.length) {

                    updateFocus(
                        cards[0]
                    );

                }

            },
            500
        );

    }
);


/* =====================================================
   TELECOMANDO
===================================================== */

document.addEventListener(
    "keydown",
    function(e) {

        refreshCards();


        if (
            !cards.length ||
            !currentCard
        ) {

            return;

        }


        const index =
            cards.indexOf(
                currentCard
            );


        switch(e.key) {

            case "ArrowRight":

                e.preventDefault();


                if (
                    index <
                    cards.length - 1
                ) {

                    updateFocus(
                        cards[index + 1]
                    );

                }

                break;


            case "ArrowLeft":

                e.preventDefault();


                if (index > 0) {

                    updateFocus(
                        cards[index - 1]
                    );

                }

                break;


            case "ArrowDown":

                e.preventDefault();


                if (
                    index + 4 <
                    cards.length
                ) {

                    updateFocus(
                        cards[index + 4]
                    );

                }

                break;


            case "ArrowUp":

                e.preventDefault();


                if (
                    index - 4 >= 0
                ) {

                    updateFocus(
                        cards[index - 4]
                    );

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

    }
);