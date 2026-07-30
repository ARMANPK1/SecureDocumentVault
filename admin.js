// Supabase Client Init
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const uploadForm = document.getElementById('uploadForm');

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fileName = document.getElementById('fileNameInput').value.trim();
    const passcode = document.getElementById('passcodeInput').value.trim();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file || !fileName || !passcode) {
        alert('সবগুলো ঘর সঠিকভাবে পূরণ করুন!');
        return;
    }

    const uploadBtn = document.getElementById('uploadBtn');
    uploadBtn.innerText = 'আপলোড হচ্ছে...';
    uploadBtn.disabled = true;

    try {
        // ১. Storage Bucket-এ ফাইল আপলোড
        const fileExt = file.name.split('.').pop();
        const filePath = `${Date.now()}_${fileName}.${fileExt}`;

        const { data: storageData, error: storageError } = await supabaseClient
            .storage
            .from('vault-files')
            .upload(filePath, file);

        if (storageError) throw storageError;

        // ২. Database Table-এ ফাইল নাম ও পাসওয়ার্ড সেভ
        const { data: dbData, error: dbError } = await supabaseClient
            .from('vault_files')
            .insert([
                { file_path: filePath, passcode: passcode }
            ]);

        if (dbError) throw dbError;

        alert('সফলভাবে ফাইল আপলোড ও পাসওয়ার্ড সেভ হয়েছে!');
        uploadForm.reset();

    } catch (err) {
        alert('আপলোড ব্যর্থ হয়েছে: ' + err.message);
        console.error(err);
    } finally {
        uploadBtn.innerText = 'আপলোড করুন';
        uploadBtn.disabled = false;
    }
});
