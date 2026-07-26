const vaults = {
  folder1: {
    name: "ফোল্ডার ১ - গোপন ফাইল",
    password: "123",
    content: `
      <p>এখানে ফোল্ডার ১-এর তথ্য।</p>
      <a href="https://google.com" target="_blank">📄 ফাইল ১ ডাউনলোড করুন</a>
    `
  },
  folder2: {
    name: "ফোল্ডার ২ - ব্যক্তিগত ছবি",
    password: "456",
    content: `
      <p>এখানে ফোল্ডার ২-এর তথ্য।</p>
      <a href="https://google.com" target="_blank">📄 ফাইল ২ ডাউনলোড করুন</a>
    `
  },
  folder3: {
    name: "ফোল্ডার ৩ - অফিসের তথ্য",
    password: "789",
    content: `
      <p>এখানে ফোল্ডার ৩-এর তথ্য।</p>
      <a href="https://google.com" target="_blank">📄 ফাইল ৩ ডাউনলোড করুন</a>
    `
  }
};

const urlParams = new URLSearchParams(window.location.search);
const currentFolderId = urlParams.get("folder") || "folder1";
const folderData = vaults[currentFolderId];

window.onload = function () {
  document.getElementById("folderTitle").innerText =
    folderData ? folderData.name : "ফোল্ডার পাওয়া যায়নি!";
};

function unlockFolder() {
  const userPassword = document.getElementById("passInput").value;

  if (!folderData) {
    alert("অকার্যকর ফোল্ডার লিংক!");
    return;
  }

  if (userPassword === folderData.password) {
    document.getElementById("lockScreen").style.display = "none";
    document.getElementById("secretContent").style.display = "block";
    document.getElementById("folderDetails").innerHTML = folderData.content;
  } else {
    alert("❌ ভুল পাসওয়ার্ড!");
  }
}
