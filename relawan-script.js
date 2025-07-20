document.addEventListener("DOMContentLoaded", () => {
    // Cek login di client-side untuk UX yang lebih baik
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
        window.location.href = "login.html?message=login_required";
        return;
    }
    // Jika user biasa, sembunyikan tombol CRUD
    if (currentUser.role !== 'admin') {
        document.getElementById('addRelawanBtn').style.display = 'none';
    }


    class RelawanManager {
        constructor() {
            this.apiBase = "api/";
            this.currentEditId = null;
            this.volunteersData = [];
            this.cacheDOMElements();
        }

        cacheDOMElements() {
            this.modal = document.getElementById("relawanModal");
            this.form = document.getElementById("relawanForm");
            this.tableBody = document.getElementById("relawanTableBody");
            this.searchInput = document.getElementById("searchInput");
            this.emptyState = document.getElementById("emptyState");
            this.modalTitle = document.getElementById("modalTitle");
            this.btnTambah = document.getElementById("addRelawanBtn");
            this.btnCancel = document.getElementById("btnCancel");
            this.closeModalBtn = document.getElementById("closeModal");
            this.totalRelawan = document.getElementById("totalRelawan");
        }

        async init() {
            this.bindEvents();
            await this.loadVolunteers();
            await this.loadStats();
        }

        bindEvents() {
            // Hanya admin yang bisa membuka modal tambah
            if(this.isAdmin()) {
                this.btnTambah.addEventListener("click", () => this.openModal());
            }
            
            this.btnCancel.addEventListener("click", () => this.closeModalHandler());
            this.closeModalBtn.addEventListener("click", () => this.closeModalHandler());
            this.form.addEventListener("submit", (e) => this.handleSubmit(e));

            let searchTimeout;
            this.searchInput.addEventListener("input", (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => this.loadVolunteers(e.target.value), 300);
            });

            this.modal.addEventListener("click", (e) => {
                if (e.target === this.modal) this.closeModalHandler();
            });
            document.addEventListener("keydown", (e) => {
                if (e.key === "Escape" && this.modal.style.display === "flex") this.closeModalHandler();
            });

            // Hanya admin yang bisa edit/delete
            if(this.isAdmin()) {
                this.tableBody.addEventListener('click', (e) => {
                    const button = e.target.closest('button');
                    if (!button) return;

                    const { id } = button.dataset;
                    if (button.classList.contains('btn-edit')) {
                        const volunteer = this.volunteersData.find(v => v.id == id);
                        if (volunteer) this.openModal(volunteer);
                    }
                    if (button.classList.contains('btn-delete')) {
                        if (confirm("Yakin ingin menghapus relawan ini?")) this.deleteVolunteer(id);
                    }
                });
            }
        }
        
        isAdmin() {
            const user = JSON.parse(localStorage.getItem('currentUser'));
            return user && user.role === 'admin';
        }

        async fetchData(url, options = {}) {
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: `HTTP Error: ${response.status}` }));
                    throw new Error(errorData.message);
                }
                return await response.json();
            } catch (error) {
                console.error("Fetch error:", error);
                this.showNotification(`Error: ${error.message}`, "error");
                throw error;
            }
        }

        async loadVolunteers(search = "") {
            const url = `${this.apiBase}volunteer.php` + (search ? `?search=${encodeURIComponent(search)}` : "");
            try {
                const result = await this.fetchData(url);
                if (result.success) {
                    this.volunteersData = result.data;
                    this.renderTable(this.volunteersData);
                }
            } catch (error) { /* Error ditangani oleh fetchData */ }
        }
        
        async loadStats() {
           try {
                const result = await this.fetchData(`${this.apiBase}stats.php`);
                if (result.success) {
                    this.animateNumber(this.totalRelawan, result.data.total_volunteers);
                }
            } catch (error) { /* Error ditangani */ }
        }

        renderTable(data = []) {
            this.emptyState.style.display = data.length === 0 ? "block" : "none";
            const isAdmin = this.isAdmin();
            
            // Sembunyikan header kolom Aksi jika bukan admin
            const thAksi = document.querySelector('th:last-child');
            if (thAksi) thAksi.style.display = isAdmin ? '' : 'none';

            this.tableBody.innerHTML = data.map(relawan => `
                <tr>
                    <td><strong>${relawan.nama}</strong></td><td>${relawan.email}</td><td>${relawan.nohp}</td>
                    ${isAdmin ? `<td><div class="action-buttons">
                        <button class="btn btn-small btn-edit" data-id="${relawan.id}"><i class="fas fa-edit"></i> Edit</button>
                        <button class="btn btn-small btn-delete" data-id="${relawan.id}"><i class="fas fa-trash"></i> Hapus</button>
                    </div></td>` : ''}
                </tr>
            `).join("");
        }
        
        async handleSubmit(e) {
            e.preventDefault();
            const volunteerData = {
                nama: this.form.nama.value.trim(), email: this.form.email.value.trim(), nohp: this.form.nohp.value.trim(),
            };
            if (!volunteerData.nama || !volunteerData.email || !volunteerData.nohp) {
                return this.showNotification("Semua kolom wajib diisi.", "error");
            }
            if (this.currentEditId) volunteerData.id = this.currentEditId;
            const url = `${this.apiBase}volunteer.php`;
            const options = {
                method: this.currentEditId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(volunteerData),
            };
            try {
                const result = await this.fetchData(url, options);
                if (result.success) {
                    this.showNotification(result.message, "success");
                    this.closeModalHandler();
                    await this.loadVolunteers();
                    await this.loadStats();
                }
            } catch (error) { /* Error ditangani */ }
        }
        
        async deleteVolunteer(id) {
            const url = `${this.apiBase}volunteer.php?id=${id}`;
            const options = { method: "DELETE" };
            try {
                const result = await this.fetchData(url, options);
                if (result.success) {
                    this.showNotification(result.message, "success");
                    await this.loadVolunteers();
                    await this.loadStats();
                }
            } catch (error) { /* Error ditangani */ }
        }
        
        openModal(volunteer = null) {
            this.currentEditId = volunteer ? volunteer.id : null;
            this.modalTitle.textContent = volunteer ? "Edit Relawan" : "Tambah Relawan Baru";
            this.form.reset();
            if (volunteer) {
                this.form.nama.value = volunteer.nama;
                this.form.email.value = volunteer.email;
                this.form.nohp.value = volunteer.nohp;
            }
            this.modal.style.display = "flex";
            this.form.nama.focus();
        }

        closeModalHandler() { this.modal.style.display = "none"; }
        
        showNotification(message, type = "success") {
            const el = document.createElement("div");
            el.className = `notification notification-${type} show`;
            el.textContent = message;
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 4000);
        }
        
        animateNumber(element, target) {
            let current = 0;
            const step = Math.max(1, Math.ceil(target / 100));
            const interval = setInterval(() => {
                current += step;
                if (current >= target) {
                    element.textContent = target;
                    clearInterval(interval);
                } else { element.textContent = current; }
            }, 20);
        }
    }

    new RelawanManager().init();
});