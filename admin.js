// Line 1: Settings & Admin Master Password
const ADMIN_MASTER_PASS = "Admin@2026#Vault"; // 🔑 এটি আপনার এডমিন লগইন পাসওয়ার্ড

// Line 4: Admin Login Logic
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('admin-login-btn') || document.getElementById('loginBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const inputPass = document.getElementById('admin-pass').value;
            const msg = document.getElementById('admin-login-msg');

            if (inputPass === ADMIN_MASTER_PASS) {
                document.getElementById('admin-login-sec').classList.add('hidden');
                document.getElementById('admin-panel-sec').classList.remove('hidden');
            } else {
                if (msg) msg.textContent = "ভুল এডমিন পাসওয়ার্ড!";
                else alert("ভুল এডমিন পাসওয়ার্ড!");
            }
        });
    }

    // Line 22: Upload & Short QR Logic
    const uploadBtn = document.getElementById('upload-btn') || document.getElementById('uploadBtn');

    if (uploadBtn) {
        uploadBtn.addEventListener('click', async () => {
            // Supabase Initialization Check
            if (typeof supabase === 'undefined' || typeof SUPABASE_URL === 'undefined') {
                alert('⚠️ config.js ফাইল বা Supabase লাইব্রেরি সঠিকভাবে লোড হয়নি!');
                return;
            }

            const fileInput = document.getElementById('upload-file') || document.getElementById('fileNameInput');
            const passInput = document.getElementById('set-file-pass') || document.getElementById('passcodeInput');
            const msg = document.getElementById('upload-msg');

            if (!fileInput || fileInput.files.length === 0 || !passInput.value.trim()) {
                alert("⚠️ একটি ফাইল নির্বাচন করুন এবং কাস্টমার পাসওয়ার্ড দিন!");
                return;
            }

            const file = fileInput.files[0];
            const passcode = passInput.value.trim();
            const fileId = "doc_" + Math.random().toString(36).substring(2, 7);
            const filePath = `vault_files/${fileId}_${file.name}`;

            if (msg) msg.textContent = "Uploading file, please wait...";

            // 1. Upload file to Supabase Storage
            const { data: storageData, error: storageError } = await _supabase.storage
                .storage.from('vault-bucket')
                .upload(filePath, file);

            if (storageError) {
                if (msg) msg.textContent = "Upload Failed: " + storageError.message;
                return;
            }

            // 2. Get Public URL
            const { data: urlData } = _supabase.storage.from('vault-bucket').getPublicUrl(filePath);
            const publicUrl = urlData.publicUrl;

            // 3. Save entry to Database
            const { error: dbError } = await _supabase.from('documents').insert([
                { file_id: fileId, file_name: file.name, file_url: publicUrl, password: passcode }
            ]);

            if (dbError) {
                if (msg) msg.textContent = "DB Error: " + dbError.message;
                return;
            }

            if (msg) msg.textContent = "✅ ফাইল সফলভাবে আপলোড হয়েছে!";

            // 4. Create Short Link (TinyURL)
            const fullUrl = `${window.location.origin}/index.html?id=${fileId}`;
            let shortUrl = fullUrl;

            try {
                const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(fullUrl)}`);
                if (res.ok) {
                    shortUrl = await res.text();
                }
            } catch (e) {
                console.log("Using full URL.");
            }

            // 5. Generate QR Code
            const qrResult = document.getElementById('qr-result');
            if (qrResult) qrResult.classList.remove('hidden');
            
            const genUrlDisplay = document.getElementById('generated-url');
            if (genUrlDisplay) genUrlDisplay.textContent = shortUrl;

            const qrContainer = document.getElementById('qrcode');
            if (qrContainer && typeof qrcode !== 'undefined') {
                const qr = qrcode(0, 'M');
                qr.addData(shortUrl);
                qr.make();
                qrContainer.innerHTML = qr.createImgTag(5);
            }
        });
    }
});
