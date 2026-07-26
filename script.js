// ================================
// Secure Document Vault
// Part 1
// ================================

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
