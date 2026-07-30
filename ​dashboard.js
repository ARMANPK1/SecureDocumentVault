// ১. এডমিন লগইন চেক করা
async function checkAuth() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (!session) {
        // লগইন করা না থাকলে লগইন পেজে নিয়ে যাবে
        window.location.href = 'admin.html';
    }
}
checkAuth();

// DOM Elements (ভেরিয়েবল আইডি ঠিক করা হয়েছে)
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');
const passcodeInput = document.getElementById('passcodeInput'); // এখানে ভ্যালু ভুল ছিল, যা ঠিক করা হয়েছে
const statusMsg = document.getElementById('statusMsg');
const resultArea = document.getElementById('resultArea');
const qrImage = document.getElementById('qrImage');
const shareUrlInput = document.getElementById('shareUrl');
const logoutBtn = document.getElementById('logoutBtn');

// ২. ফাইল আপলোড এবং QR জেনারেট ফাংশন
if (uploadBtn) {
    uploadBtn.addEventListener('click', async () => {
        const file = fileInput.files[0];
        const passcode = passcodeInput ? passcodeInput.value.trim() : '';

        if (!file || !passcode) {
            statusMsg.innerText = "একটি ফাইল এবং পাসওয়ার্ড উভয়ই প্রদান করুন!";
            return;
        }

        statusMsg.innerText = "ফাইল আপলোড হচ্ছে, অপেক্ষা করুন...";

        try {
            // ইউনিক ফাইল নাম তৈরি করা
            const uniqueFileName = `${Date.now()}_${file.name}`;

            // ক. Supabase Storage-এ ফাইল আপলোড ('documents' বাকেটে)
            const { data: storageData, error: storageError } = await _supabase
                .storage
                .from('documents') // আপনার বাকেটের নাম দেওয়া হলো
                .upload(uniqueFileName, file);

            if (storageError) {
                statusMsg.innerText = "আপলোড ব্যর্থ হয়েছে: " + storageError.message;
                return;
            }

            // খ. Database (vault_files) টেবিলে তথ্য সেভ করা
            const { error: dbError } = await _supabase
                .from('vault_files')
                .insert([
                    { 
                        file_path: uniqueFileName, 
                        passcode: passcode 
                    }
                ]);

            if (dbError) {
                statusMsg.innerText = "ডাটাবেজে সেভ হয়নি: " + dbError.message;
                return;
            }

            // গ. ফাইলের এক্সেস লিংক এবং QR Code তৈরি
            const siteUrl = window.location.origin; 
            const accessLink = `${siteUrl}/index.html?file=${encodeURIComponent(uniqueFileName)}`;
            
            // QR Code API
            const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(accessLink)}`;

            // ঘ. স্ক্রিনে QR ও লিঙ্ক দেখানো
            statusMsg.innerText = "ফাইল সফলভাবে আপলোড হয়েছে!";
            qrImage.src = qrCodeUrl;
            shareUrlInput.value = accessLink;
            resultArea.style.display = 'block';

        } catch (err) {
            console.error(err);
            statusMsg.innerText = "একটি অভ্যন্তরীণ সমস্যা হয়েছে!";
        }
    });
}

// ৩. লগআউট হ্যান্ডলার
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await _supabase.auth.signOut();
        window.location.href = 'admin.html';
