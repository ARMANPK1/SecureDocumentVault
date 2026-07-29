// ==========================================
// ১. Supabase কনফিগারেশন সেটআপ
// ==========================================
// ⚠️ নিচে আপনার নিজের Supabase URL এবং Anon Key বসিয়ে দিন
const SUPABASE_URL = "YOUR_SUPABASE_URL_HERE"; 
const SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY_HERE";

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

        if (dbError) throw dbError;

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
