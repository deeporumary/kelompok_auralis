document.addEventListener("DOMContentLoaded", () => {
  // --- Universal Elements ---
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")
  const navbar = document.getElementById("navbar")

  // --- Navbar Toggle for Responsive Menu ---
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
      navToggle.classList.toggle("active")
    })
  }

  // --- Active Navigation Link ---
  const currentPath = window.location.pathname.split("/").pop() || "index.html"
  navLinks.forEach((link) => {
    // Remove active class from all links first
    link.classList.remove("active")
    // Add active class if the link's href matches the current page
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active")
    }
  })

  // --- Navbar Scroll Effect ---
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled")
      } else {
        navbar.classList.remove("scrolled")
      }
    })
  }

  // --- Donation Page Specific Script ---
  const donationForm = document.querySelector(".donation-form")
  if (donationForm) {
    const amountButtons = document.querySelectorAll(".amount-btn")
    const frequencyButtons = document.querySelectorAll(".freq-btn")
    const customAmountInput = document.querySelector(".custom-amount input")

    amountButtons.forEach((button) => {
      button.addEventListener("click", function () {
        amountButtons.forEach((btn) => btn.classList.remove("active"))
        this.classList.add("active")
        if (customAmountInput) customAmountInput.value = ""
      })
    })

    if (customAmountInput) {
      customAmountInput.addEventListener("input", () => {
        amountButtons.forEach((btn) => btn.classList.remove("active"))
      })
    }

    frequencyButtons.forEach((button) => {
      button.addEventListener("click", function () {
        frequencyButtons.forEach((btn) => btn.classList.remove("active"))
        this.classList.add("active")
      })
    })
  }

  // Load relawan data for program page
  loadRelawanForProgram()
})

// Add this function at the end of the file
function loadRelawanForProgram() {
  const relawanGrid = document.getElementById("relawanGrid")
  if (!relawanGrid) return

  const relawanData = JSON.parse(localStorage.getItem("relawanData")) || []
  const activeRelawan = relawanData.filter((r) => r.status === "aktif").slice(0, 6) // Show max 6

  if (activeRelawan.length === 0) {
    relawanGrid.innerHTML = `
            <div class="relawan-empty">
                <i class="fas fa-users"></i>
                <h3>Belum Ada Relawan Aktif</h3>
                <p>Jadilah relawan pertama untuk bergabung dengan misi mulia ini</p>
            </div>
        `
    return
  }

  relawanGrid.innerHTML = activeRelawan
    .map((relawan) => {
      const initials = relawan.nama
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
      const colors = ["#059669", "#3B82F6", "#8B5CF6", "#EF4444", "#F59E0B", "#10B981"]
      const colorIndex = relawan.nama.length % colors.length

      return `
            <div class="relawan-card">
                <div class="relawan-avatar" style="background: ${colors[colorIndex]}">
                    ${initials}
                </div>
                <div class="relawan-info">
                    <h3>${relawan.nama}</h3>
                    <div class="relawan-program">${relawan.program}</div>
                    <div class="relawan-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${relawan.kota}</span>
                    </div>
                    <div class="relawan-status status-aktif">
                        <i class="fas fa-check-circle"></i>
                        <span>Aktif</span>
                    </div>
                </div>
            </div>
        `
    })
    .join("")
}