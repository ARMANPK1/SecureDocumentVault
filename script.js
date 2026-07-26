alert("script.js শুরু হয়েছে");

const SUPABASE_URL = "https://hpmabasscvxobqjiaxya.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Q6fekn1-CYNPC7kbjdX8zg_8-XUkcNB";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  
);

async function uploadFile() {
  alert("Upload চাপা হয়েছে");

  const fileInput = document.getElementById("fileInput");

  if (!fileInput.files.length) {
    alert("একটি ফাইল নির্বাচন করুন");
    return;
  }

  const file = fileInput.files[0];

// পরিবর্তন করে এটি দিন:
  const { data, error } = await supabase.storage
    .from("documents") // এখানে বড় হাতের DOCUMENTS এর বদলে ছোট হাতের documents দিন
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
  const { data, error } = await supabase.storage
    .from("DOCUMENTS")
    .list();

  if (error) {
    alert(error.message);
    return;
  }

  const list = document.getElementById("fileList");
  list.innerHTML = "";

  data.forEach(file => {
    const li = document.createElement("li");
    li.innerText = file.name;
    list.appendChild(li);
  });
}

// পেজ লোড হওয়ার সাথে সাথে ফাইল লিস্ট দেখানোর জন্য
loadFiles

async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.error('Error logging in:', error.message);
    alert('Failed to log in: ' + error.message);
  } else {
    console.log('Logged in successfully:', data);
    alert('Logged in successfully!');
  }
    }
