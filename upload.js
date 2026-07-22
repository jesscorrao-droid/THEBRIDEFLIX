const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

document.getElementById("invia").addEventListener("click", uploadPhoto);

async function uploadPhoto() {

    const nome = document.getElementById("nome").value.trim();
    const messaggio = document.getElementById("messaggio").value.trim();
    const files = document.getElementById("foto").files;

    if (files.length === 0) {
        alert("Seleziona almeno una foto.");
        return;
    }

    const button = document.getElementById("invia");
    button.disabled = true;

    try {

        for (let i = 0; i < files.length; i++) {

            const file = files[i];

            button.innerHTML = `📤 Caricamento ${i + 1} di ${files.length}...`;

            const fileName = Date.now() + "_" + i + "_" + file.name;

            const { error: uploadError } = await sb.storage
                .from("FOTO")
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data } = sb.storage
                .from("FOTO")
                .getPublicUrl(fileName);

            const { error: dbError } = await sb
                .from("dediche")
                .insert([
                    {
                        nome,
                        messaggio,
                        foto: data.publicUrl,
                        approvata: true
                    }
                ]);

            if (dbError) throw dbError;

        }

        alert(`❤️ Grazie! Sono state caricate ${files.length} foto.`);

        document.getElementById("nome").value = "";
        document.getElementById("messaggio").value = "";
        document.getElementById("foto").value = "";

        const preview = document.getElementById("preview");
        const placeholder = document.getElementById("placeholder");

        preview.style.display = "none";
        preview.src = "";

        placeholder.style.display = "flex";

    } catch (err) {

        console.error(err);
        alert(err.message);

    } finally {

        button.disabled = false;
        button.innerHTML = "❤️ Invia la dedica";

    }

}