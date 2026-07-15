const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let elenco = [];
let indice = 0;

const foto = document.getElementById("foto");
const sfondo = document.getElementById("background");
const dedica = document.getElementById("dedica");
const messaggio = document.getElementById("messaggio");
const nome = document.getElementById("nome");

const welcome = document.getElementById("welcomeScreen");
const container = document.getElementById("container");
const qrBox = document.getElementById("qr-box");

async function caricaDediche() {

    const { data, error } = await sb
        .from("dediche")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error(error);
        return;
    }

    elenco = data;

}

function mostraFoto() {

    if (elenco.length === 0) {

        welcome.style.display = "flex";
        container.style.display = "none";

        if (qrBox) qrBox.style.display = "none";

        return;
    }

    welcome.style.display = "none";
    container.style.display = "flex";

    if (qrBox) qrBox.style.display = "flex";

    if (indice >= elenco.length)
        indice = 0;

    const item = elenco[indice];

    dedica.style.opacity = 0;
    foto.style.opacity = 0;

    setTimeout(() => {

        foto.src = item.foto;

        sfondo.style.backgroundImage =
            `url('${item.foto}')`;

        messaggio.innerHTML = "❝ " + (item.messaggio || "");

        nome.innerHTML = "— " + (item.nome || "") + " ❤️";

        foto.style.animation = "none";
        foto.offsetHeight;
        foto.style.animation = "zoom 10s linear forwards";

        foto.style.opacity = 1;

        dedica.style.opacity = 1;
        dedica.style.transform = "translateY(0)";

        indice++;

    },700);

}

async function aggiorna(){

    await caricaDediche();

    mostraFoto();

}

aggiorna();

setInterval(aggiorna,5000);