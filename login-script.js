document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const alertBox = document.getElementById("alertBox");
    const alertMessage = document.getElementById("alertMessage");
    const alertClose = document.getElementById("alertClose");

    function showAlert(message, type = "error") {
        alertMessage.textContent = message;
        alertBox.className = `alert-box ${type} show`;
        setTimeout(() => {
            alertBox.classList.remove("show");
        }, 5000);
    }
    alertClose.addEventListener("click", () => alertBox.classList.remove("show"));
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('error') === 'admin_required') {
        showAlert("Anda harus login sebagai admin untuk mengakses halaman tersebut.");
    }
    if (urlParams.get('message') === 'login_required') {
        showAlert("Silakan login untuk mengakses halaman ini.");
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('api/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();

if (result.success) {
    showAlert(result.message, 'success');
    
    // **PASTIKAN BARIS INI ADA SEBELUM REDIRECT**
    const user = { username: data.username, role: result.role };
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// ... di dalam loginForm.addEventListener("submit", ...
            if (result.success) {
                showAlert(result.message, 'success');
                
                // **PASTIKAN BARIS INI ADA SEBELUM REDIRECT**
                const user = { username: data.username, role: result.role };
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } 
            else {
                showAlert(result.message, 'error');
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
            }
        } catch (error) {
            showAlert("Tidak dapat terhubung ke server.", "error");
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    });

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());

        if (data.password.length < 6) {
            return showAlert("Password minimal 6 karakter.");
        }
        if (data.password !== data.confirmPassword) {
            return showAlert("Password dan konfirmasi password tidak cocok!");
        }

        try {
            const response = await fetch('api/register.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: data.username, email: data.email, password: data.password })
            });
            const result = await response.json();

            if (result.success) {
                showAlert(result.message, 'success');
                registerForm.reset();
                document.querySelector('[data-tab="login"]').click();
            } else {
                showAlert(result.message, 'error');
            }
        } catch (error) {
            showAlert("Tidak dapat terhubung ke server saat mendaftar.", "error");
        }
    });

    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove("active"));
            tabContents.forEach(c => c.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById(target + "Tab").classList.add("active");
        });
    });
    
    document.querySelectorAll(".password-toggle").forEach(toggle => {
        toggle.addEventListener("click", () => {
            const input = document.getElementById(toggle.dataset.target);
            input.type = input.type === "password" ? "text" : "password";
            toggle.querySelector("i").classList.toggle("fa-eye");
            toggle.querySelector("i").classList.toggle("fa-eye-slash");
        });
    });
});
