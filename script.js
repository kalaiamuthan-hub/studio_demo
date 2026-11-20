/**
 * ROYAL LENS STUDIO - LUXURY PHOTOGRAPHY & CINEMATOGRAPHY
 * Vanilla JavaScript for modern animations, portfolio filtering, and shoot booking
 */

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. DOM Elements ---
    const mainHeader = document.getElementById("mainHeader");
    const topBar = document.querySelector(".top-announcement-bar");
    const menuBtn = document.getElementById("menuBtn");
    const mobileNav = document.getElementById("mobileNav");
    const mobileOverlay = document.getElementById("mobileOverlay");
    const closeMobileNav = document.getElementById("closeMobileNav");
    const mobileLinks = document.querySelectorAll(".mobile-link");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section[id]");
    const scrollProgress = document.getElementById("scrollProgress");
    const backToTop = document.getElementById("backToTop");
    const toastContainer = document.getElementById("toastContainer");
    const tabButtons = document.querySelectorAll(".tab-btn");
    const menuCards = document.querySelectorAll("#menuCards .card");
    const addToPlateBtns = document.querySelectorAll(".add-to-plate-btn");
    const bookingForm = document.getElementById("bookingForm");
    const bookDateInput = document.getElementById("bookDate");
    const newsletterForm = document.getElementById("newsletterForm");

    // Set minimum date for reservation to today
    if (bookDateInput) {
        const today = new Date().toISOString().split("T")[0];
        bookDateInput.min = today;
        bookDateInput.value = today;
    }

    // --- 2. Mobile Navigation Drawer ---
    function openMenu() {
        mobileNav.classList.add("active");
        mobileOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    }

    function closeMenu() {
        mobileNav.classList.remove("active");
        mobileOverlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    if (menuBtn) menuBtn.addEventListener("click", openMenu);
    if (closeMobileNav) closeMobileNav.addEventListener("click", closeMenu);
    if (mobileOverlay) mobileOverlay.addEventListener("click", closeMenu);

    mobileLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    const mobileBookBtn = document.getElementById("mobileBookBtn");
    if (mobileBookBtn) {
        mobileBookBtn.addEventListener("click", closeMenu);
    }

    // --- 3. Scroll Events (Header, Progress Bar, Back-To-Top, Nav Spy) ---
    window.addEventListener("scroll", () => {
        const scrollY = window.pageYOffset;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

        // Header & Top Announcement Bar on Scroll
        if (scrollY > 40) {
            mainHeader.classList.add("scrolled");
            if (topBar) topBar.classList.add("hide");
        } else {
            mainHeader.classList.remove("scrolled");
            if (topBar) topBar.classList.remove("hide");
        }

        // Top Scroll Progress Bar
        if (totalHeight > 0 && scrollProgress) {
            const progress = (scrollY / totalHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        }

        // Back to Top Button Visibility
        if (backToTop) {
            if (scrollY > 400) {
                backToTop.classList.add("show");
            } else {
                backToTop.classList.remove("show");
            }
        }

        // Active Navigation Link Scroll Spy
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach((link) => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    });

    // Back to Top Click
    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // --- 4. Intersection Observer for Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");

                    // Trigger number counters if present in this section
                    const counters = entry.target.querySelectorAll(".stat-num");
                    if (counters.length > 0) {
                        counters.forEach((counter) => runCounter(counter));
                    }

                    observer.unobserve(entry.target);
                }
            });
        },
        {
            root: null,
            threshold: 0.15,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    // --- 5. Number Counter Animation ---
    function runCounter(counter) {
        const target = +counter.getAttribute("data-target");
        let count = 0;
        const duration = 1800; // ms
        const stepTime = Math.max(Math.floor(duration / target), 20);

        const timer = setInterval(() => {
            count++;
            counter.innerText = count;
            if (count >= target) {
                counter.innerText = target;
                clearInterval(timer);
            }
        }, stepTime);
    }

    // --- 6. Menu Filter Tabs ---
    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            tabButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");

            const filterValue = button.getAttribute("data-filter");

            menuCards.forEach((card) => {
                const category = card.getAttribute("data-category");

                if (filterValue === "all" || category === filterValue) {
                    card.style.display = "flex";
                    // Trigger a brief fade in
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.95)";
                    setTimeout(() => {
                        card.style.transition = "opacity 0.4s ease, transform 0.4s ease";
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    }, 50);
                } else {
                    card.style.display = "none";
                }
            });
        });
    });

    // --- 7. Toast Notification Utility ---
    function showToast(message, icon = "fa-circle-check") {
        if (!toastContainer) return;

        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = "toastOut 0.35s ease forwards";
            setTimeout(() => {
                toast.remove();
            }, 350);
        }, 3200);
    }

    // --- 8. Inquire / Quick Booking Buttons ---
    addToPlateBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const serviceName = btn.getAttribute("data-name") || "Wedding Package";

            // Visual button bounce effect
            btn.style.transform = "scale(0.85)";
            setTimeout(() => {
                btn.style.transform = "";
            }, 180);

            showToast(`Inquiry saved for <strong>"${serviceName}"</strong>! We will send details to your WhatsApp.`, "fa-camera-retro");
        });
    });

    // --- 9. Photoshoot Booking Form Handler ---
    if (bookingForm) {
        bookingForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("guestName").value;
            const date = document.getElementById("bookDate").value;
            const time = document.getElementById("bookTime").value;
            const category = document.getElementById("guestsCount").value;
            const location = document.getElementById("seatingPref").value;

            // Submit animation state on button
            const submitBtn = bookingForm.querySelector("button[type='submit']");
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending Booking...`;

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                bookingForm.reset();

                // Reset default min date
                if (bookDateInput) {
                    const today = new Date().toISOString().split("T")[0];
                    bookDateInput.value = today;
                }

                showToast(`Thank you <strong>${name}</strong>! We got your booking for ${date} (${time}). We will call you soon!`, "fa-calendar-check");
            }, 1000);
        });
    }

    // --- 10. Newsletter Form Handler ---
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector("input[type='email']");
            if (input && input.value) {
                showToast("Thank you! We will send our special discount offers to your email.", "fa-envelope-open-text");
                newsletterForm.reset();
            }
        });
    }
});
