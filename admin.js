// Supabase কনফিগারেশন (এখানে আপনার নিজের Supabase URL ও Anon Key বসাবেন)
const SUPABASE_URL = 'https://hpmabasscvxobqjiaxya.supabase.co
const SUPABASE_ANON_KEY = 'sb_publishable_Q6fekn1-CYNPC7kbjdX8zg_8-XUkcNB
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const uploadForm = document.getElementById('upload-form');
const docNameInput = document.getElementById('doc-name');
const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('fileList');
const qrResult = document.getElementById('qr-result');
const qrcodeDiv = document.getElementById('qrcode');

uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const docName = docNameInput.value.trim();
    const file = fileInput.files[0];

    if (!file) {
        alert('অনুগ্রহ করে একটি ফাইল সিলেক্ট করুন!');
        return;
    }

    try {
        // ১. Supabase Storage-এ ফাইল আপলোড
        const filePath = `vault/${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file);

        if (uploadError) {
            throw new Error('ফাইল আপলোড ব্যর্থ: ' + uploadError.message);
        }

        // ২. আপলোড করা ফাইলের পাবলিক লিংক নেওয়া
        const { data: urlData } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath);

        const publicUrl = urlData.publicUrl;

        // ৩. Supabase Database Table-এ তথ্যাদি সেভ করা
        const { data: dbData, error: dbError } = await supabase
            .from('documents')
            .insert([{ title: docName, file_url: publicUrl }])
            .select()
            .single();

        if (dbError) {
            throw new Error('ডাটাবেসে সেভ ব্যর্থ: ' + dbError.message);
        }

        // ৪. আপলোড হওয়া ফাইলের লিংক স্ক্রিনে দেখানো
        fileList.innerHTML += `
          <div class="fileItem" style="margin-bottom: 10px;">
            <strong>${docName}</strong> - 
            <a href="${publicUrl}" target="_blank">Open File</a>
          </div>
        `;

        // ৫. স্ক্যান করে দেখার লিংক তৈরি (index.html পেজের ইউআরএল)
        const viewerUrl = `${window.location.origin}/index.html?id=${dbData.id}`;

        // ৬. QR Code জেনারেট করা
        qrcodeDiv.innerHTML = ""; // পুরানো QR পরিষ্কার করা
        new QRCode(qrcodeDiv, {
            text: viewerUrl,
            width: 180,
            height: 180
        });

        // QR রেজাল্ট সেকশন দৃশ্যমান করা
        qrResult.style.display = 'block';

        // ফর্ম রিসেট করা
        uploadForm.reset();
        alert('ফাইল সফলভাবে আপলোড এবং QR Code তৈরি হয়েছে!');

    } catch (err) {
        alert(err.message);
        console.error(err);
    }
});
