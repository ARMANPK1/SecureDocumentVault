// Supabase Client Initialization
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const uploadForm = document.getElementById('uploadForm');

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // পেজ যেন রিফ্রেশ না হয়
    
    const fileName = document.getElementById('fileNameInput').value.trim();
    const passcode = document.getElementById('passcodeInput').value.trim();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file || !fileName || !passcode) {
        alert('অনুগ্রহ করে সবগুলো ঘর সঠিক তথ্য দিয়ে পূরণ করুন!');
        return;
    }

    const uploadBtn = document.getElementById('uploadBtn');
    uploadBtn.innerText = 'আপলোড হচ্ছে...';
    uploadBtn.disabled = true;

    try {
        // ১. ফাইল আপলোড
        const fileExt = file.name.split('.').pop();
        const uniqueFileName = `${Date.now()}_${fileName}.${fileExt}`;

        const { data: storageData, error: storageError } = await supabaseClient
            .storage
            .from('vault-files')
            .upload(uniqueFileName, file);

        if (storageError) {
            throw new Error('স্টোরেজে ফাইল আপলোড হতে পারেনি: ' + storageError.message);
        }

        // ২. ডাটাবেসে সেভ করা
        const { data: dbData, error: dbError } = await supabaseClient
            .from('vault_files')
            .insert([
                { 
                    file_path: uniqueFileName, 
                    passcode: passcode 
                }
            ]);

        if (dbError) {
            throw new Error('ডাটাবেসে সেভ হতে পারেনি: ' + dbError.message);
        }

        alert('🎉 দারুণ! ফাইল ও সিক্রেট পাসওয়ার্ড সফলভাবে আপলোড হয়েছে!');
        uploadForm.reset();

    } catch (err) {
        // যদি কোনো ভুল হয়, স্পষ্ট পপআপ মেসেজে লিখে দিবে সমস্যা কোথায়!
        alert('⚠️ আপলোড ব্যর্থ হয়েছে:\n' + err.message);
        console.error(err);
    } finally {
        uploadBtn.innerText = 'আপলোড করুন';
        uploadBtn.disabled = false;
    }
});
