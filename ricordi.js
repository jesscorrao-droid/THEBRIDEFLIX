const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function caricaRicordi() {

    const { data, error } = await sb
        .from("dediche")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    const gallery = document.getElementById("gallery");

    gallery.innerHTML = "";

    data.forEach(item => {

        const card = document.createElement("div");

        card.className = "card";

        let dataFormattata = "";

        if(item.creato_il){

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

    document.getElementById("viewer").style.display = "flex";

    document.getElementById("viewerImage").src = item.foto;

    document.getElementById("viewerMessage").innerHTML =
        "❝ " + (item.messaggio || "");

    document.getElementById("viewerAuthor").innerHTML =
        "— " + (item.nome || "Anonimo") + " ❤️";

    document.getElementById("viewerDate").innerHTML =
        dataFormattata;

});
        gallery.appendChild(card);

    });

}

caricaRicordi();

document.getElementById("closeViewer")
.addEventListener("click", () => {

    document.getElementById("viewer").style.display = "none";

});

document.addEventListener("keydown", e => {

    if(e.key==="Escape"){

        document.getElementById("viewer").style.display="none";

    }

});