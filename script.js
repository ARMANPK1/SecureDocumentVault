// ১. ফোল্ডারের তথ্য ও পাসওয়ার্ড
const vaults = {
  "folder1": {
    name: "ফোল্ডার ১ - গোপন ফাইল",
    password: "123",
    content: "<p>এখানে ফোল্ডার ১ এর তথ্য।</p><a href='https://google.com' target='_blank'>📄 ফাইল ১ ডাউনলোড করুন</a>"
  },
  "folder2": {
    name: "ফোল্ডার ২ - ব্যক্তিগত ছবি",
    password: "456",
    content: "<p>এখানে ফোল্ডার ২ এর তথ্য।</p><a href='https://google.com' target='_blank'>📄 ফাইল ২ ডাউনলোড করুন</a>"
  },
  "folder3": {
    name: "ফোল্ডার ৩ - অফিসের তথ্য",
    password: "789",
    content: "<p>এখানে ফোল্ডার ৩ এর তথ্য।</p><a href='https://google.com' target='_blank'>📄 ফাইল ৩ ডাউনলোড করুন</a>"
  }
};

// ২. লিংক থেকে ফোল্ডার আইডি বের করা
const urlParams = new URLSearchParams(window.location.search);
const currentFolderId = urlParams.get('folder') || 'folder1';

const folderData = vaults[currentFolderId];

// ৩. পেজ লোড হলে নাম দেখানো
window.onload = function() {
  if (folderData) {
    document.getElementById('folderTitle').innerText = folderData.name;
  } else {
    document.getElementById('folderTitle').innerText = "ফোল্ডার পাওয়া যায়নি!";
  }
};

// ৪. পাসওয়ার্ড চেক ফাংশন
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
