// তোমার Supabase তথ্য
const SUPABASE_URL = "https://hpmabasscvxobqjiaxya.supabase.co";

const SUPABASE_KEY = "sb_publishable_Q6fekn1-CYNPC7kbjdX8zg_8-XUkcNB";

// Supabase Client
const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// তোমার Supabase তথ্য
const SUPABASE_URL = "https://hpmabasscvxobqjiaxya.supabase.co";

const SUPABASE_KEY = "sb_publishable_Q6fekn1-CYNPC7kbjdX8zg_8-XUkcNB";

// Supabase Client
const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// Bucket
const BUCKET = "documents";


// Folder Configuration

const vaults = {

    folder1:{

        name:"ব্যক্তিগত ডকুমেন্ট",

        password:"123"

    },

    folder2:{

        name:"ছবির ফোল্ডার",

        password:"456"

    },

    folder3:{

        name:"অফিস ডকুমেন্ট",

        password:"789"

    }

};


// URL থেকে Folder বের করা

const params = new URLSearchParams(window.location.search);

const currentFolder = params.get("folder") || "folder1";

const folder = vaults[currentFolder];


// Page Load

window.onload = ()=>{

    if(!folder){

        document.getElementById("folderTitle").innerHTML="❌ Folder পাওয়া যায়নি";

        return;

    }

    document.getElementById("folderTitle").innerHTML=folder.name;

};
// ================================
// Part 2 - Unlock Folder & Load Files
// ================================

async function unlockFolder() {

    const pass = document.getElementById("passInput").value;

    if (!folder) {
        alert("ফোল্ডার পাওয়া যায়নি");
        return;
    }

    if (pass !== folder.password) {
        alert("❌ ভুল পাসওয়ার্ড");
        return;
    }

    document.getElementById("lockScreen").style.display = "none";
    document.getElementById("secretContent").style.display = "block";

    loadFiles();

}

async function loadFiles() {

    const container = document.getElementById("folderDetails");

    container.innerHTML = "<p>লোড হচ্ছে...</p>";

    const { data, error } = await supabase
        .storage
        .from(BUCKET)
        .list("", {
            limit: 100
        });

    if (error) {

        container.innerHTML =
            "<p>❌ ফাইল লোড করা যায়নি</p>";

        console.error(error);

        return;

    }

    container.innerHTML = "";

    if (data.length === 0) {

        container.innerHTML =
            "<p>কোনো ফাইল পাওয়া যায়নি।</p>";

        return;

    }

    data.forEach(file => {

        const url =
`${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${file.name}`;

        const card = document.createElement("div");

        card.className = "file-card";

        let preview = "";

        if (file.name.endsWith(".jpg") ||
            file.name.endsWith(".jpeg") ||
            file.name.endsWith(".png") ||
            file.name.endsWith(".webp")) {

            preview =
            `<img src="${url}" alt="${file.name}">`;

        }

        card.innerHTML = `
            ${preview}

            <h3>${file.name}</h3>

            <a href="${url}" target="_blank">
                📥 Download
            </a>
        `;

        container.appendChild(card);

    });

}
window.unlockFolder = unlockFolder;

console.log("unlockFolder ready");
