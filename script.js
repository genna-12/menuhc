// CONFIGURAZIONE JSONBIN.IO (Gratuito, crea un account in 1 minuto)
const BIN_ID = "6a29deb4f5f4af5e29db3577"; // L'ID del file JSON creato
const API_KEY = "$2a$10$/dWJWy6e1Z8FkH9PGSOh.u0babfpnOJA.T1YuBdMTBYyv6Sp7MnL6"; // La chiave per permettere la scrittura
const CHEF_PIN = "4231"; // Sicurezza front-end

// Imposta in automatico la data di "oggi" all'apertura del sito
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('data_menu').valueAsDate = new Date();
});

document.getElementById('btnInvia').addEventListener('click', inviaMenu);

// Converte da "YYYY-MM-DD" a "Mercoledì 10 giugno 2026"
function formattaData(dataString) {
    if (!dataString) return "";
    
    // Divide anno, mese e giorno per evitare problemi di fuso orario
    const [year, month, day] = dataString.split("-");
    const dateObj = new Date(year, month - 1, day); 
    
    // Opzioni per avere giorno della settimana, numero, mese e anno
    const opzioni = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    let dataFormattata = dateObj.toLocaleDateString('it-IT', opzioni);
    
    // Mette la prima lettera maiuscola (es. "Mercoledì" invece di "mercoledì")
    return dataFormattata.charAt(0).toUpperCase() + dataFormattata.slice(1);
}

async function inviaMenu() {
    const pin = document.getElementById('pin').value;
    const statusDiv = document.getElementById('statusMessage');
    const btn = document.getElementById('btnInvia');

    if (pin !== CHEF_PIN) {
        statusDiv.innerHTML = "PIN errato!";
        statusDiv.className = "error";
        return;
    }

    btn.innerText = "Invio in corso...";
    btn.disabled = true;
    statusDiv.innerHTML = "";

    const dataOriginale = document.getElementById('data_menu').value;
    
    const menuData = {
        data_menu: formattaData(dataOriginale), // Invia a Word la data già bella pulita (es. 24/05/2026)
        data_file_name: dataOriginale, // Usato dal PC per nominare il file da salvare
        timestamp: new Date().toLocaleString("it-IT", { timeZone: "Europe/Rome" }),
        p_primo_1: document.getElementById('p_primo_1').value,
        p_primo_2: document.getElementById('p_primo_2').value,
        p_primo_3: document.getElementById('p_primo_3').value,
        p_sec_1: document.getElementById('p_sec_1').value,
        p_sec_2: document.getElementById('p_sec_2').value,
        p_sec_3: document.getElementById('p_sec_3').value,
        p_bimbi_primo: document.getElementById('p_bimbi_primo').value,
        p_bimbi_sec: document.getElementById('p_bimbi_sec').value,
        c_primo_1: document.getElementById('c_primo_1').value,
        c_primo_2: document.getElementById('c_primo_2').value,
        c_primo_3: document.getElementById('c_primo_3').value,
        c_sec_1: document.getElementById('c_sec_1').value,
        c_sec_2: document.getElementById('c_sec_2').value,
        c_sec_3: document.getElementById('c_sec_3').value,
        c_bimbi_primo: document.getElementById('c_bimbi_primo').value,
        c_bimbi_sec: document.getElementById('c_bimbi_sec').value,
    };

    try {
        const response = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": API_KEY
            },
            body: JSON.stringify(menuData)
        });

        if (response.ok) {
            statusDiv.innerHTML = `✓ Menù inviato! (Aggiornato: ${menuData.timestamp})`;
            statusDiv.className = "success";
        } else {
            throw new Error("Errore nel salvataggio");
        }
    } catch (error) {
        statusDiv.innerHTML = "Errore di connessione. Riprova.";
        statusDiv.className = "error";
    } finally {
        btn.innerText = "INVIA MENÙ ALLA RECEPTION";
        btn.disabled = false;
    }
}