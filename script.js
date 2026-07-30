alert("Script File Connected Successfully!");

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
  document.addEventListener('DOMContentLoaded', () => {
    console.log("script.js successfully loaded");

    const urlParams = new URLSearchParams(window.location.search);
    const fileName = urlParams.get('file');

    const submitBtn = document.getElementById('submitBtn');
    const passcodeInput = document.getElementById('passcodeInput');
    const fileContainer = document.getElementById('fileContainer');
    const previewArea = document.getElementById('previewArea');
    const downloadLink = document.getElementById('downloadLink');

    if (submitBtn) {
        // এখানে (e) যোগ করা হয়েছে
        submitBtn.addEventListener('click', async (e) => {
            // পেজ যাতে রিফ্রেশ/উধাও না হয়ে যায় সেটির জন্য এই লাইনটি আবশ্যক
            e.preventDefault();

            const inputPasscode = passcodeInput ? passcodeInput.value.trim() : '';

            // ১. পাসওয়ার্ড না দিলে অ্যালার্ট
            if (!inputPasscode) {
                alert("⚠️ অনুগ্রহ করে পাসওয়ার্ডটি লিখুন!");
                return;
            }

            // ২. লিংক থেকে ফাইল নেম না পেলে অ্যালার্ট
            if (!fileName) {
                alert("❌ ফাইল নির্বাচন করা হয়নি! সঠিক লিঙ্ক বা QR কোড ব্যবহার করুন।");
                return;
            }

            try {
                // ৩. Supabase Database থেকে ফাইলের বিবরণ চেক করা
                const { data, error } = await _supabase
                    .from('vault_files')
                    .select('*')
                    .eq('file_path', fileName)
                    .maybeSingle();

                if (error || !data) {
                    alert("❌ ফাইলটি ডাটাবেজে পাওয়া যায়নি!");
                    console.error("Database error:", error);
                    return;
                }

                // ৪. পাসওয়ার্ড ম্যাচ করা
                if (data.passcode === inputPasscode) {
                    alert("✅ পাসওয়ার্ড সঠিক হয়েছে!");

                    // Supabase Storage 'documents' বাকেট থেকে ফাইলের পাবলিক URL আনা
                    const { data: publicUrlData } = _supabase
                        .storage
                        .from('documents')
                        .getPublicUrl(fileName);

                    const fileUrl = publicUrlData.publicUrl;

                    // ছবি বা ফাইল প্রিভিউ দেখানো
                    if (fileUrl.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
                        previewArea.innerHTML = `<img src="${fileUrl}" style="max-width:100%; border-radius:8px;">`;
                    } else {
                        previewArea.innerHTML = `<p>ফাইলটি ভিউ করতে নিচের ডাউনলোড বাটনে চাপুন।</p>`;
                    }

                    downloadLink.href = fileUrl;
                    downloadLink.setAttribute('download', fileName);
                    fileContainer.style.display = 'block';

                } else {
                    alert("❌ ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিয়ে আবার চেষ্টা করুন।");
                }

            } catch (err) {
                console.error("Internal Error:", err);
                alert("⚠️ একটি অভ্যন্তরীণ সমস্যা হয়েছে!");
            }
        });
    }
});
