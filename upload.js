const sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

document.getElementById("invia").addEventListener("click", uploadPhoto);

async function uploadPhoto() {

    const nome = document.getElementById("nome").value.trim();
    const messaggio = document.getElementById("messaggio").value.trim();
    const file = document.getElementById("foto").files[0];

    if (!file) {
        alert("Seleziona una foto.");
        return;
    }

    const fileName = Date.now() + "_" + file.name;

    const { error: uploadError } = await sb.storage
        .from("FOTO")
        .upload(fileName, file);

    if (uploadError) {
        console.error(uploadError);
        alert(uploadError.message);
        return;
    }

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
                approvata: false
            }
        ]);

    if (dbError) {
        console.error(dbError);
        alert(dbError.message);
        return;
    }

    alert("❤️ Grazie! La tua dedica è stata inviata.");

    document.getElementById("nome").value = "";
    document.getElementById("messaggio").value = "";
    document.getElementById("foto").value = "";
}