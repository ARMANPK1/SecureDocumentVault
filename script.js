// 🔐 এখানে ফোল্ডারের আইডি, পাসওয়ার্ড এবং ফাইলের লিংকগুলো থাকবে
const vaults = {
  "folder1": {
    name: "ফোল্ডার ১ - গোপন ফাইল",
    password: "123", // 🔑 পাসওয়ার্ড
    content: "<p>এখানে ফোল্ডার ১ এর তথ্য।</p><a href='https://example.com/file1.pdf' target='_blank'>📄 ফাইল ডাউনলোড করুন</a>"
  },
  "folder2": {
    name: "ফোল্ডার ২ - ব্যক্তিগত ছবি",
    password: "456", // 🔑 পাসওয়ার্ড
    content: "<p>এখানে ফোল্ডার ২ এর তথ্য।</p><a href='https://example.com/file2.pdf' target='_blank'>📄 ফাইল ডাউনলোড করুন</a>"
  },
  "folder3": {
    name: "ফোল্ডার ৩ - অফিসের তথ্য",
    password: "789", // 🔑 পাসওয়ার্ড
    content: "<p>এখানে ফোল্ডার ৩ এর তথ্য।</p><a href='https://example.com/file3.pdf' target='_blank'>📄 ফাইল ডাউনলোড করুন</a>"
  }
};

// লিংক থেকে ফোল্ডার আইডি বের করা (?folder=folder1)
const urlParams = new URLSearchParams(window.location.search);
const currentFolderId = urlParams.get('folder') || 'folder1'; // ডিফল্ট ফোল্ডার ১

// পেজ লোড হলে ফোল্ডারের নাম সেট করা
const folderData = vaults[currentFolderId];
if (folderData) {
  document.getElementById('folderTitle').innerText = folderData.name;
} else {
  document.getElementById('folderTitle').innerText = "ফোল্ডার পাওয়া যায়নি!";
}

// পাসওয়ার্ড মেলানোর ফাংশন
function unlockFolder() {
  const userPassword = document.getElementById('passInput').value;

  if (!folderData) {
    alert("অকার্যকর ফোল্ডার লিংক!");
    return;
  }

  if (userPassword === folderData.password) {
    alert("পাসওয়ার্ড সঠিক হয়েছে!");
    document.getElementById('lockScreen').style.display = 'none';
    document.getElementById('secretContent').style.display = 'block';
    document.getElementById('folderDetails').innerHTML = folderData.content;
  } else {
    alert("❌ ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।");
  }
}
