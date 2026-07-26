<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Secure Document Vault</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <div class="container">
    <h1>Secure Document Vault</h1>
    <p>আপনার ব্যক্তিগত ডকুমেন্ট নিরাপদে সংরক্ষণ করুন</p>

    <!-- লগইন সেকশন -->
    <div id="login-container">
      <h2>লগ ইন করুন</h2>
      <input type="email" id="emailInput" placeholder="ইমেল ঠিকানা">
      <input type="password" id="passwordInput" placeholder="পাসওয়ার্ড">
      <button type="button" onclick="executeLogin()">লগ ইন</button>
    </div>

    <!-- ফাইল সেকশন -->
    <h2>Upload Document</h2>
    <input type="file" id="fileInput">
    <button type="button" onclick="uploadFile()">Upload</button>

    <hr>

    <h2>Uploaded Files</h2>
    <ul id="fileList"></ul>
  </div>

  <!-- ১. আগে Supabase CDN লাইব্রেরি -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  
  <!-- ২. পরে আপনার script.js ফাইল -->
  <script src="script.js"></script>

</body>
</html>না 
