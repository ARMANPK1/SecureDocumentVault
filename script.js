alert("script.js শুরু হয়েছে");

const SUPABASE_URL = "https://hpmabasscvxobqjiaxya.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Q6fekn1-CYNPC7kbjdX8zg_8-XUkcNB";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function uploadFile() {
  alert("Upload চাপা হয়েছে");

  const fileInput = document.getElementById("fileInput");

  if (!fileInput.files.length) {
    alert("একটি ফাইল নির্বাচন করুন");
    return;
  }

  const file = fileInput.files[0];
const { data, error } = await supabase.storage
  .from("DOCUMENTS") // এখানে ছোট হাতের পরিবতে বড় হাতের দিন
  .upload(file.name, file, {
    upsert: true
  });
  if (if (error) {
    alert("Upload Failed: " + error.message);
  } else {
    alert("✅ Upload সফল হয়েছে!");
    loadFiles();
  }
}

async function loadFiles() {
  const { data, error } = await supabase.storage
    .from("documents")
    .list();

  if (error) {
    alert(error.message);
    return;
  }

  const list = document.getElementById("fileList");
  list.innerHTML = "";

  data.forEach(file => {
    const li = document.createElement("li");
    li.innerText = file.name; // এখানে ঠিক করা হয়েছে
    list.appendChild(li);      // লিস্টে উপাদান যোগ করার জন্য এটি জরুরি
  });
    }
