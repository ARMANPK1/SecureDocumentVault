alert("JS শুরু হয়েছে");
// SecureDocumentVault Script

alert("Script Loaded");


const SUPABASE_URL = "আপনার_SUPABASE_URL";https://hpmabasscvxobqjiaxya.supabase.co
const SUPABASE_ANON_KEY = "আপনার_SUPABASE_ANON_KEY";sb_publishable_Q6fekn1-CYNPC7kbjdX8zg_8-XUkcNB


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


  if(!file){

    alert("File নির্বাচন করুন");
    return;

  }


  const {data, error} = await supabaseClient
    .storage
    .from("documents")
    .upload(file.name, file, {
      upsert:true
    });



  if(error){

    alert(error.message);

  }

  else{

    alert("✅ File Upload হয়েছে");

    loadFiles();

  }


};




// Show Files

async function loadFiles(){


  fileList.innerHTML = "Loading...";


  const {data, error} = await supabaseClient
    .storage
    .from("documents")
    .list("");



  if(error){

    fileList.innerHTML = error.message;
    return;

  }



  fileList.innerHTML = "";



  data.forEach(file => {


    const {data:urlData} =
      supabaseClient
      .storage
      .from("documents")
      .getPublicUrl(file.name);



    fileList.innerHTML += `

      <div class="fileItem">

        <span>${file.name}</span>

        <a href="${urlData.publicUrl}" target="_blank">
        Open
        </a>

      </div>

    `;


  });


}
