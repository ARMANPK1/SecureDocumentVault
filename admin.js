// ==========================================
// ১. // DOM elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('emailInput');
const passInput = document.getElementById('passInput');
const loginBtn = document.getElementById('loginBtn');
const errorMsg = document.getElementById('errorMsg');

// Login Handler
if (loginBtn) {
    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passInput.value.trim();

        if (!email || !password) {
            errorMsg.innerText = "ইমেইল এবং পাসওয়ার্ড উভয়ই প্রদান করুন!";
            return;
        }

        errorMsg.innerText = "লগইন হচ্ছে...";

        try {
            // Supabase Auth দিয়ে এডমিন লগইন
            const { data, error } = await _supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                errorMsg.innerText = "ভুল ইমেইল বা পাসওয়ার্ড!";
                console.error(error.message);
                return;
            }

            if (data.user) {
                // লগইন সফল হলে ড্যাশবোর্ডে পাঠানো
                window.location.href = 'dashboard.html';
            }

        } catch (err) {
            console.error(err);
            errorMsg.innerText = "একটি সমস্যা হয়েছে, আবার চেষ্টা করুন।";
        }
    }); কনফিগারেশন সেটআপ
// ==========================================
// ⚠️ নিচে আপনার নিজের Supabase URL এবং Anon Key বসিয়ে দিন
const SUPABASE_URL = "https://hpmabasscvxobqjiaxya.supabase.co"; 
const SUPABASE_KEY = "sb_publishable_Q6fekn1-CYNPC7kbjdX8zg_8-XUkcNB";

// Supabase ক্লায়েন্ট তৈরি
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// HTML Elements নির্বাচন
const uploadForm = document.getElementById('upload-form');
const docNameInput = document.getElementById('doc-name');
const fileInput = document.getElementById('file-input');
const fileListContainer = document.getElementById('fileList');
const qrResultDiv = document.getElementById('qr-result');
const qrcodeDiv = document.getElementById('qrcode');

// ==========================================
// ২. ফাইল আপলোড ও QR Code জেনারেট করার লজিক
// ==========================================
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const docName = docNameInput.value.trim();
    const file = fileInput.files[0];

    if (!file) {
        alert("দয়া করে একটি ফাইল সিলেক্ট করুন!");
        return;
    }

    try {
        // বাটনের টেক্সট পরিবর্তন (Loading state)
        const submitBtn = uploadForm.querySelector('button');
        submitBtn.disabled = true;
        submitBtn.innerText = "আপলোড হচ্ছে...";

        // ১. ফাইলের জন্য ইউনিক নাম তৈরি (যেন একই নামের ফাইল ওভাররাইট না হয়)
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `documents/${fileName}`;

        // ২. Supabase Storage-এ ফাইল আপলোড (আপনার Storage Bucket এর নাম 'vault-files' ধরে নেওয়া হয়েছে)
        const { data: storageData, error: storageError } = await supabase.storage
            .from('vault-files')
            .upload(filePath, file);

        if (storageError) throw storageError;

        // ৩. ফাইলের পাবলিক ইউআরএল (Public URL) সংগ্রহ করা
        const { data: urlData } = supabase.storage
            .from('vault-files')
            .getPublicUrl(filePath);

        const publicUrl = urlData.publicUrl;

        // ৪. Supabase Database (Table: 'documents') এ ফাইলের তথ্য সেভ করা
        const { error: dbError } = await supabase
            .from('documents')
            .insert([
                { 
                    title: docName, 
                    file_url: publicUrl, 
                    file_path: filePath 
                }
            ]);

        // ==========================================
// ২. ফাইল আপলোড ও QR Code জেনারেট করার লজিক (ডিবাগসহ)
// ==========================================
uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("Submit button clicked!"); // কনসোলে চেক করার জন্য

    const docName = docNameInput.value.trim();
    const file = fileInput.files[0];

    if (!file) {
        alert("দয়া করে একটি ফাইল সিলেক্ট করুন!");
        return;
    }

    const submitBtn = uploadForm.querySelector('button');
    submitBtn.disabled = true;
    submitBtn.innerText = "আপলোড হচ্ছে...";

    try {
        // ১. ফাইলের জন্য ইউনিক নাম তৈরি
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `documents/${fileName}`;

        console.log("Uploading to Storage...");
        // ২. Supabase Storage-এ ফাইল আপলোড
        const { data: storageData, error: storageError } = await supabase.storage
            .from('vault-files')
            .upload(filePath, file);

        if (storageError) {
            alert("Storage Error: " + storageError.message);
            throw storageError;
        }

        console.log("Getting Public URL...");
        // ৩. ফাইলের পাবলিক ইউআরএল সংগ্রহ করা
        const { data: urlData } = supabase.storage
            .from('vault-files')
            .getPublicUrl(filePath);

        const publicUrl = urlData.publicUrl;

        console.log("Inserting to Database...");
        // ৪. Supabase Database-এ তথ্য সেভ করা
        const { error: dbError } = await supabase
            .from('documents')
            .insert([
                { 
                    title: docName, 
                    file_url: publicUrl, 
                    file_path: filePath 
                }
            ]);

        if (dbError) {
            alert("Database Error: " + dbError.message);
            throw dbError;
        }

        alert("ফাইল সফলভাবে আপলোড হয়েছে!");

        // ৫. QR Code জেনারেট করা
        generateQRCode(publicUrl);

        uploadForm.reset();
        fetchUploadedFiles();

    } catch (error) {
        console.error("Full Error Details:", error);
        alert("কোথাও সমস্যা হয়েছে: " + (error.message || JSON.stringify(error)));
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "আপলোড করুন";
    }
});

        alert("ফাইল সফলভাবে আপলোড হয়েছে!");

        // ৫. QR Code জেনারেট করা
        generateQRCode(publicUrl);

        // ফর্ম রিসেট করা
        uploadForm.reset();

        // আপডেট হওয়া ফাইলের তালিকা আবার লোড করা
        fetchUploadedFiles();

    } catch (error) {
        console.error("Error uploading file:", error);
        alert("আপলোড করতে সমস্যা হয়েছে: " + error.message);
    } finally {
        const submitBtn = uploadForm.querySelector('button');
        submitBtn.disabled = false;
        submitBtn.innerText = "আপলোড করুন";
    }
});

// ==========================================
// ৩. QR Code জেনারেট করার ফাংশন
// ==========================================
function generateQRCode(url) {
    // আগের QR ক্লিয়ার করা
    qrcodeDiv.innerHTML = "";
    
    // নতুন QR Code তৈরি করা
    new QRCode(qrcodeDiv, {
        text: url,
        width: 180,
        height: 180,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    // QR Section দৃশ্যমান করা
    qrResultDiv.style.display = "block";
}

// ==========================================
// ৪. আপলোড হওয়া ফাইলগুলোর তালিকা লোড করা
// ==========================================
async function fetchUploadedFiles() {
    try {
        fileListContainer.innerHTML = "<p>ফাইল লোড হচ্ছে...</p>";

        const { data: docs, error } = await supabase
            .from('documents')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!docs || docs.length === 0) {
            fileListContainer.innerHTML = "<p>এখনো কোনো ফাইল আপলোড করা হয়নি।</p>";
            return;
        }

        // ফাইলের তালিকা তৈরি
        let htmlList = "<h3>আপলোড করা ফাইলসমূহ:</h3><ul style='list-style: none; padding: 0;'>";
        
        docs.forEach(doc => {
            htmlList += `
                <li style="background: #f4f4f4; margin: 10px 0; padding: 12px; border-radius: 5px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${doc.title}</strong><br>
                        <small style="color: #666;">${new Date(doc.created_at).toLocaleString('bn-BD')}</small>
                    </div>
                    <div>
                        <a href="${doc.file_url}" target="_blank" style="margin-right: 10px; color: #007bff; text-decoration: none;">দেখুন</a>
                        <button onclick="deleteFile('${doc.id}', '${doc.file_path}')" style="background: #ff4d4d; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">ডিলিট</button>
                    </div>
                </li>
            `;
        });

        htmlList += "</ul>";
        fileListContainer.innerHTML = htmlList;

    } catch (error) {
        console.error("Error fetching files:", error);
        fileListContainer.innerHTML = "<p>ফাইল তালিকা লোড করতে ব্যর্থ হয়েছে।</p>";
    }
}

// ==========================================
// ৫. ফাইল ডিলিট করার ফাংশন
// ==========================================
async function deleteFile(id, filePath) {
    if (!confirm("আপনি কি নিশ্চিত যে এই ফাইলটি ডিলিট করতে চান?")) return;

    try {
        // ১. Storage থেকে ফাইল ডিলিট করা
        const { error: storageError } = await supabase.storage
            .from('vault-files')
            .remove([filePath]);

        if (storageError) console.warn("Storage delete failed:", storageError);

        // ২. Database থেকে রেকর্ড ডিলিট করা
        const { error: dbError } = await supabase
            .from('documents')
            .delete()
            .eq('id', id);

        if (dbError) throw dbError;

        alert("ফাইল ডিলিট করা হয়েছে!");
        fetchUploadedFiles(); // লিস্ট রিফ্রেশ করা

    } catch (error) {
        console.error("Error deleting file:", error);
        alert("ডিলিট করতে সমস্যা হয়েছে: " + error.message);
    }
}

// পেজ লোড হলেই ফাইলের তালিকা লোড হবে
document.addEventListener("DOMContentLoaded", fetchUploadedFiles);
