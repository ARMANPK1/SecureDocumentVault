// DOM elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('emailInput');
const passInput = document.getElementById('passInput');
const loginBtn = document.getElementById('loginBtn');
const errorMsg = document.getElementById('errorMsg');

// Login Handler
if (loginBtn) {
    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passInput.value.trim();

        if (!email || !password) {
            errorMsg.innerText = "ইমেইল এবং পাসওয়ার্ড উভয়ই প্রদান করুন!";
            return;
        }

        errorMsg.innerText = "লগইন হচ্ছে...";

        try {
            // Supabase Auth দিয়ে এডমিন লগইন
            const { data, error } = await supabase.auth.signInWithPassword(...)
                email: email,
                password: password
            });

            if (error) {
                errorMsg.innerText = "ভুল ইমেইল বা পাসওয়ার্ড!";
                console.error(error.message);
                return;
            }

            if (data.user) {
                // লগইন সফল হলে ড্যাশবোর্ডে পাঠানো
                window.location.href = 'dashboard.html';
            }

        } catch (err) {
            console.error(err);
            errorMsg.innerText = "একটি সমস্যা হয়েছে, আবার চেষ্টা করুন।";
        }
    });
}
