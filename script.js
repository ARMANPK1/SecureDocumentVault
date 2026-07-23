const SUPABASE_URL = "https://hpmabasscvxobqjiaxya.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_Q6fekn1-CYNPC7kbjdX8zg_8-XUkcNB";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function uploadFile() {
  const fileInput = document.getElementById("fileInput");

  if (!fileInput.files.length) {
    alert("একটি ফাইল নির্বাচন করুন");
    return;
  }

  const file = fileInput.files[0];

  const { error } = await supabase.storage
    .from("documents")
    .upload(file.name, file, {
      upsert: true
    });

  if (error) {
    alert("Upload Failed: " + error.message);
  } else {
    alert("✅ Upload সফল হয়েছে!");
    loadFiles();
  }
}

async function loadFiles() {
  const fileList = document.getElementById("fileList");
  fileList.innerHTML = "";

  const { data, error } = await supabase.storage
    .from("documents")
    .list("");

  if (error) {
    console.log(error);
    return;
  }

  data.forEach(file => {
    const li = document.createElement("li");
    li.textContent = file.name;
    fileList.appendChild(li);
  });
}

loadFiles();
alert("Script loaded");
