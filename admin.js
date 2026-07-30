// admin.js
document.addEventListener('DOMContentLoaded', () => {
    const uploadBtn = document.getElementById('uploadBtn');

    if (!uploadBtn) return;

    uploadBtn.addEventListener('click', async () => {
        // Supabase এবং config.js এর ভ্যারিয়েবল চেক
        if (typeof supabase === 'undefined') {
            alert('⚠️ Supabase লাইব্রেরি লোড হয়নি!');
            return;
        }
        if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_ANON_KEY === 'undefined') {
            alert('⚠️ config.js ফাইল থেকে SUPABASE_URL বা SUPABASE_ANON_KEY পাওয়া যায়নি!');
            return;
        }

        const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        const fileName = document.getElementById('fileNameInput').value.trim();
        const passcode = document.getElementById('passcodeInput').value.trim();
        const fileInput = document.getElementById('fileInput');
        const file = fileInput ? fileInput.files[0] : null;

        if (!file || !fileName || !passcode) {
            alert('⚠️ অনুগ্রহ করে সবগুলো ঘর পূরণ করুন এবং ফাইল নির্বাচন করুন!');
            return;
        }

        uploadBtn.innerText = 'আপলোড হচ্ছে...';
        uploadBtn.disabled = true;

        try {
            // ১. Storage Bucket-এ ফাইল আপলোড
            const fileExt = file.name.split('.').pop();
            const uniqueFileName = `${Date.now()}_${fileName}.${fileExt}`;

            const { data: storageData, error: storageError } = await supabaseClient
                .storage
                .from('vault-files')
                .upload(uniqueFileName, file);

            if (storageError) {
                throw new Error('স্টোরেজ এরর: ' + storageError.message);
            }

            // ২. Database-এ ডেটা সেভ
            const { data: dbData, error: dbError } = await supabaseClient
                .from('vault_files')
                .insert([
                    { 
                        file_path: uniqueFileName, 
                        passcode: passcode 
                    }
                ]);

            if (dbError) {
                throw new Error('ডাটাবেস এরর: ' + dbError.message);
            }

            alert('🎉 সফলভাবে ফাইল ও পাসওয়ার্ড সেভ হয়েছে!');
            document.getElementById('uploadForm').reset();

        } catch (err) {
            alert('❌ ' + err.message);
            console.error(err);
        } finally {
            uploadBtn.innerText = 'আপলোড করুন';
            uploadBtn.disabled = false;
        }
    });
});
