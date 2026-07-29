// URL থেকে ফাইলের নাম বা আইডি পড়া (যেমন: index.html?file=my-file.pdf)
const urlParams = new URLSearchParams(window.location.search);
const fileName = urlParams.get('file');

const lockBox = document.getElementById('lockBox');
const vaultContent = document.getElementById('vaultContent');
const passInput = document.getElementById('passInput');
const unlockBtn = document.getElementById('unlockBtn');
const errorMsg = document.getElementById('errorMsg');
const docPreview = document.getElementById('docPreview');
const downloadBtn = document.getElementById('downloadBtn');

// Unlock বাটনে ক্লিক করলে পাসওয়ার্ড যাচাই
unlockBtn.addEventListener('click', async () => {
    const password = passInput.value.trim();

    if (!password) {
        errorMsg.innerText = "অনুগ্ৰহ করে পাসওয়ার্ড দিন!";
        return;
    }

    if (!fileName) {
        errorMsg.innerText = "কোনো ফাইল নির্দিষ্ট করা নেই!";
        return;
    }

    try {
        // ১. ডাটাবেজ থেকে ফাইলের পাসওয়ার্ড চেক করা
        const { data, error } = await _supabase
            .from('vault_files')
            .select('*')
            .eq('file_path', fileName)
            .eq('passcode', password)
            .single();

        if (error || !data) {
            errorMsg.innerText = "ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।";
            return;
        }

        // ২. পাসওয়ার্ড সঠিক হলে স্টোরেজ থেকে ফাইলের লিংক তৈরি করা
        const { data: fileData } = _supabase
            .storage
            .from('vault-files')
            .getPublicUrl(fileName);

        if (fileData.publicUrl) {
            // লক বক্স লুকিয়ে ফাইলের প্রিভিউ ও ডাউনলোড বাটন দেখানো
            lockBox.style.display = 'none';
            vaultContent.style.display = 'block';

            docPreview.src = fileData.publicUrl;
            downloadBtn.href = fileData.publicUrl;
        } else {
            errorMsg.innerText = "ফাইলটি খুঁজে পাওয়া যায়নি!";
        }

    } catch (err) {
        console.error(err);
        errorMsg.innerText = "একটি সমস্যা হয়েছে, আবার চেষ্টা করুন।";
    }
});
