/* =====================================================
   BRIDEFLIX - SCRIPT.JS
   VERSIONE DEFINITIVA
===================================================== */


/* =====================================================
   ELEMENTI PRINCIPALI
===================================================== */

const videoModal =
    document.getElementById("videoModal");

const trailerVideo =
    document.getElementById("trailerVideo");

const videoCloseButton =
    document.querySelector(
        "#videoModal .closeButton"
    );

const goHomeButton =
    document.getElementById("goHome");

let lastScrollPosition = 0;


/* =====================================================
   CREA CARD VIDEO
   PARTY + SPECIAL
===================================================== */

function createCategory(category, containerId) {

    const container =
        document.getElementById(containerId);

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (
        typeof videos === "undefined" ||
        !Array.isArray(videos)
    ) {

        console.error(
            "videos non trovato in data.js"
        );

        return;
    }

    const list =
        videos.filter(function(video) {

            return video.category === category;

        });


    list.forEach(function(video) {

        const card =
            document.createElement("div");

        card.className =
            "card";


        card.innerHTML = `

            <img
                src="${video.image}"
                alt="${video.title}"
            >

            <div class="card-info">

                <h3>
                    ${video.title}
                </h3>

            </div>

        `;


        if (video.youtube) {

            card.onclick = function() {

                openVideo(
                    video.youtube
                );

            };

        }


        container.appendChild(card);

    });

}


/* =====================================================
   CREA PARTY
===================================================== */

createCategory(
    "party",
    "partyRow"
);


/* =====================================================
   CREA SPECIALI
===================================================== */

createCategory(
    "special",
    "specialCards"
);


/* =====================================================
   APERTURA VIDEO
===================================================== */

function openVideo(url) {

    if (!url) {

        console.error(
            "URL YouTube mancante"
        );

        return;
    }


    if (
        !videoModal ||
        !trailerVideo
    ) {

        console.error(
            "Popup video non trovato"
        );

        return;
    }


    lastScrollPosition =
        window.scrollY;


    /*
       Aggiunge automaticamente:
       autoplay
       rel
       playsinline
       vq=hd1080

       NOTA:
       YouTube decide comunque
       autonomamente la qualità finale.
    */

    const separator =
        url.includes("?")
            ? "&"
            : "?";


    trailerVideo.src =
        url +
        separator +
        "autoplay=1" +
        "&rel=0" +
        "&playsinline=1" +
        "&vq=hd1080";


    videoModal.style.display =
        "block";


    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   CHIUDI VIDEO
===================================================== */

function closeVideo() {

    if (videoModal) {

        videoModal.style.display =
            "none";

    }


    if (trailerVideo) {

        trailerVideo.src = "";

    }


    document.body.style.overflow =
        "auto";

}


/* =====================================================
   PULSANTE X VIDEO
===================================================== */

if (videoCloseButton) {

    videoCloseButton.onclick =
        closeVideo;

}


/* =====================================================
   CLICK SFONDO VIDEO
===================================================== */

if (videoModal) {

    videoModal.onclick =
        function(e) {

            if (
                e.target === videoModal
            ) {

                closeVideo();

            }

        };

}


/* =====================================================
   TORNA ALLA HOME
===================================================== */

if (goHomeButton) {

    goHomeButton.onclick =
        function() {

            closeVideo();

            window.scrollTo({

                top:
                    lastScrollPosition,

                behavior:
                    "smooth"

            });

        };

}


/* =====================================================
   LA CERIMONIA
===================================================== */

const weddingSeriesCard =
    document.getElementById(
        "weddingSeriesCard"
    );

const weddingSeriesPage =
    document.getElementById(
        "weddingSeriesPage"
    );

const weddingEpisodes =
    document.getElementById(
        "weddingEpisodes"
    );

const closeWeddingSeries =
    document.getElementById(
        "closeWeddingSeries"
    );

const episodeCounter =
    document.getElementById(
        "seriesEpisodeCount"
    );


/* =====================================================
   CREA EPISODI
===================================================== */

function createWeddingEpisodes() {

    if (!weddingEpisodes) {

        console.error(
            "#weddingEpisodes non trovato"
        );

        return;
    }


    if (
        typeof videos === "undefined" ||
        !Array.isArray(videos)
    ) {

        console.error(
            "videos non trovato"
        );

        return;
    }


    weddingEpisodes.innerHTML =
        "";


    const weddingVideos =
        videos.filter(function(video) {

            return video.category === "wedding";

        });


    console.log(
        "Episodi matrimonio:",
        weddingVideos.length
    );


    if (episodeCounter) {

        episodeCounter.textContent =
            weddingVideos.length +
            (
                weddingVideos.length === 1
                    ? " EPISODIO"
                    : " EPISODI"
            );

    }


    weddingVideos.forEach(
        function(video, index) {

            const episode =
                document.createElement(
                    "article"
                );


            /*
               IMPORTANTE:
               questa classe corrisponde
               al CSS.
            */

            episode.className =
                "wedding-episode-card";


            episode.innerHTML = `

                <div class="episode-number">

                    ${String(index + 1)
                        .padStart(2, "0")}

                </div>


                <img
                    src="${video.image}"
                    alt="${video.title}"
                >


                <div class="episode-info">

                    <h3>
                        ${video.title}
                    </h3>


                    <p>
                        ${
                            video.description ||
                            "Un momento speciale del nostro matrimonio."
                        }
                    </p>

                </div>

            `;


            if (video.youtube) {

                episode.onclick =
                    function() {

                        openVideo(
                            video.youtube
                        );

                    };

            }


            weddingEpisodes.appendChild(
                episode
            );

        }
    );

}


/* =====================================================
   APRI LA CERIMONIA
===================================================== */

if (weddingSeriesCard) {

    weddingSeriesCard.onclick =
        function() {

            console.log(
                "CLICK LA CERIMONIA"
            );

            history.pushState(
    { page: "weddingSeries" },
    "",
    "#cerimonia"
);


            createWeddingEpisodes();


            if (weddingSeriesPage) {

                weddingSeriesPage.style.display =
                    "block";

                weddingSeriesPage.classList.add(
                    "active"
                );

            }


            document.body.style.overflow =
                "hidden";


            window.scrollTo({
                top: 0,
                behavior: "instant"
            });

        };

}


/* =====================================================
   CHIUDI LA CERIMONIA
===================================================== */

function closeWeddingPage() {

    if (!weddingSeriesPage) {
        return;
    }


    weddingSeriesPage.style.display =
        "none";


    weddingSeriesPage.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "auto";

}


if (closeWeddingSeries) {

    closeWeddingSeries.onclick =
        closeWeddingPage;

}


/* =====================================================
   WEDDING PHOTOS
===================================================== */

const dedicationCard =
    document.getElementById(
        "dedicationCard"
    );


if (dedicationCard) {

    dedicationCard.onclick =
        function() {

            /*
               Apre la pagina delle foto.
            */

            window.location.href =
                "ricordi.html";

        };

}


/* =====================================================
   ESC
===================================================== */

document.addEventListener(
    "keydown",
    function(e) {

        if (e.key !== "Escape") {
            return;
        }


        if (
            videoModal &&
            videoModal.style.display === "block"
        ) {

            closeVideo();

            return;

        }


        if (
            weddingSeriesPage &&
            weddingSeriesPage.classList.contains(
                "active"
            )
        ) {

            closeWeddingPage();

        }

    }
);


/* =====================================================
   DEDICHE / SUPABASE
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


function openDedica(dedica) {

    if (!dedicaModal) {
        return;
    }


    if (dedicaFoto) {

        dedicaFoto.src =
            dedica.foto || "";

    }


    if (dedicaNome) {

        dedicaNome.textContent =
            dedica.nome || "";

    }


    if (dedicaMessaggio) {

        dedicaMessaggio.textContent =
            dedica.messaggio || "";

    }


    dedicaModal.style.display =
        "block";


    document.body.style.overflow =
        "hidden";

}


function closeDedicaModal() {

    if (!dedicaModal) {
        return;
    }


    dedicaModal.style.display =
        "none";


    document.body.style.overflow =
        "auto";

}


if (closeDedica) {

    closeDedica.onclick =
        closeDedicaModal;

}


if (dedicaModal) {

    dedicaModal.onclick =
        function(e) {

            if (
                e.target === dedicaModal
            ) {

                closeDedicaModal();

            }

        };

}


/* =====================================================
   SUPABASE
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

} catch (error) {

    console.error(
        "Errore Supabase:",
        error
    );

}


/* =====================================================
   CARICA DEDICHE
===================================================== */

async function caricaDediche() {

    if (!sb) {
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


        if (result.error) {

            console.error(
                "Errore dediche:",
                result.error
            );

            return;

        }


        const data =
            result.data || [];


        const row =
            document.getElementById(
                "dediche-row"
            );


        /*
           Se la pagina Home non contiene
           dediche-row, non facciamo nulla.
        */

        if (!row) {
            return;
        }


        row.innerHTML =
            "";


        data.forEach(
            function(dedica) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "card dedica-card";


                card.innerHTML = `

                    <img
                        src="${dedica.foto || ""}"
                        alt="${dedica.nome || "Dedica"}"
                    >

                    <h3>
                        ${dedica.nome || ""}
                    </h3>

                `;


                card.onclick =
                    function() {

                        openDedica(
                            dedica
                        );

                    };


                row.appendChild(
                    card
                );

            }
        );


    } catch (error) {

        console.error(
            "Errore caricamento dediche:",
            error
        );

    }

}


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
                .then(
                    function() {

                        console.log(
                            "BrideFlix PWA attiva"
                        );

                    }
                )
                .catch(
                    function(error) {

                        console.error(
                            "Errore Service Worker:",
                            error
                        );

                    }
                );

        }
    );

}


/* =====================================================
   TV / TELECOMANDO
===================================================== */

let currentCard = null;


function refreshCards() {

    return Array.from(
        document.querySelectorAll(
            ".card"
        )
    );

}


function updateFocus(card) {

    const allCards =
        refreshCards();


    if (!allCards.length) {
        return;
    }


    allCards.forEach(
        function(item) {

            item.classList.remove(
                "tv-focus"
            );

        }
    );


    if (!card) {

        card =
            currentCard ||
            allCards[0];

    }


    currentCard =
        card;


    currentCard.classList.add(
        "tv-focus"
    );


    currentCard.scrollIntoView({

        behavior: "smooth",

        block: "nearest",

        inline: "center"

    });

}


window.addEventListener(
    "load",
    function() {

        setTimeout(
            function() {

                const allCards =
                    refreshCards();


                if (allCards.length) {

                    updateFocus(
                        allCards[0]
                    );

                }

            },
            500
        );

    }
);


document.addEventListener(
    "keydown",
    function(e) {

        /*
           Se siamo dentro la pagina
           della Cerimonia, lasciamo
           il browser gestire le frecce.
        */

        if (
            weddingSeriesPage &&
            weddingSeriesPage.classList.contains(
                "active"
            )
        ) {

            return;

        }


        const allCards =
            refreshCards();


        if (
            !allCards.length ||
            !currentCard
        ) {

            return;

        }


        const index =
            allCards.indexOf(
                currentCard
            );


        switch (e.key) {

            case "ArrowRight":

                e.preventDefault();

                if (
                    index <
                    allCards.length - 1
                ) {

                    updateFocus(
                        allCards[index + 1]
                    );

                }

                break;


            case "ArrowLeft":

                e.preventDefault();

                if (index > 0) {

                    updateFocus(
                        allCards[index - 1]
                    );

                }

                break;


            case "ArrowDown":

                e.preventDefault();

                if (
                    index + 4 <
                    allCards.length
                ) {

                    updateFocus(
                        allCards[index + 4]
                    );

                }

                break;


            case "ArrowUp":

                e.preventDefault();

                if (
                    index - 4 >= 0
                ) {

                    updateFocus(
                        allCards[index - 4]
                    );

                }

                break;


            case "Enter":

                e.preventDefault();

                currentCard.click();

                break;

        }

    }
);

/* =====================================================
   TASTO BACKSPACE / TASTO INDIETRO
   PAGINA LA CERIMONIA
===================================================== */

window.addEventListener("popstate", function () {

    const weddingSeriesPage =
        document.getElementById("weddingSeriesPage");

    const videoModal =
        document.getElementById("videoModal");

    const dedicaModal =
        document.getElementById("dedicaModal");


    /* Se è aperta la pagina La Cerimonia */

    if (
        weddingSeriesPage &&
        weddingSeriesPage.classList.contains("active")
    ) {

        weddingSeriesPage.classList.remove("active");

        weddingSeriesPage.style.display = "none";

        document.body.classList.remove("wedding-open");

        window.scrollTo({
            top: 0,
            behavior: "instant"
        });
    }


    /* Chiudi anche eventuale video */

    if (videoModal) {

        videoModal.classList.remove("active");

        videoModal.style.display = "none";

    }


    /* Chiudi eventuale finestra Wedding Photos */

    if (dedicaModal) {

        dedicaModal.classList.remove("active");

        dedicaModal.style.display = "none";

    }

});


/* =====================================================
   BACKSPACE
===================================================== */

document.addEventListener("keydown", function (event) {

    /* Backspace */

    if (event.key === "Backspace") {

        const activeElement = document.activeElement;

        /*
         * Non interferiamo quando l'utente
         * sta scrivendo in un campo di testo
         */

        if (
            activeElement &&
            (
                activeElement.tagName === "INPUT" ||
                activeElement.tagName === "TEXTAREA" ||
                activeElement.isContentEditable
            )
        ) {
            return;
        }


        const weddingSeriesPage =
            document.getElementById("weddingSeriesPage");


        /* Se siamo dentro La Cerimonia */

        if (
            weddingSeriesPage &&
            weddingSeriesPage.classList.contains("active")
        ) {

            event.preventDefault();

            history.back();

        }

    }

});