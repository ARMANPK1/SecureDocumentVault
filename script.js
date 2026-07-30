SUPABASEASEASE("JS শুরু হয়েছে");

const SUPABASE_URL = "https://hpmabasscvxobqjiaxya.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_Q6fekn1-CYNPC7kbjdX8zg_8-XUkcNB";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);


// Vault Password
const VAULT_PASSWORD = "123456";

// Elements
const lockBox = document.getElementById("lockBox");
const vaultContent = document.getElementById("vaultContent");

const passInput = document.getElementById("passInput");
const unlockBtn = document.getElementById("unlockBtn");

const errorMsg = document.getElementById("errorMsg");

const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");

const fileList = document.getElementById("fileList");



// Unlock Password

unlockBtn.onclick = function(){

  if(passInput.value === VAULT_PASSWORD){

    lockBox.style.display = "none";
    vaultContent.style.display = "block";

    loadFiles();

  }

  else{

    errorMsg.innerHTML = "❌ ভুল Password";

  }

};




// Upload File

uploadBtn.onclick = async function(){

  const file = fileInput.files[0];
