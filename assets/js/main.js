/* =========================================
   SCHOOL 012 — FRAME / FIELD NOTES
   Part 03: JavaScript interactions
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    /*=============== SELECT ELEMENTS ===============*/

    const header = document.querySelector("#header");

    const nav = document.querySelector("#nav");
    const menuToggle = document.querySelector("#menu-toggle");
    const navLinks = document.querySelectorAll(".nav-link");

    const previewFigure = document.querySelector("#preview-figure");
    const previewCaption = document.querySelector("#preview-caption");
    const previewTitle = document.querySelector("#preview-title");
    const previewDescription = document.querySelector("#preview-description");

    const titleInput = document.querySelector("#caption-title");
    const descriptionInput = document.querySelector("#caption-description");

    const positionButtons = document.querySelectorAll(
        ".control-option[data-position]",
    );

    const styleButtons = document.querySelectorAll(".style-option[data-style]");

    const styleLabel = document.querySelector("#preview-style-label");
    const resetButton = document.querySelector("#reset-studio");

    /*=============== MOBILE NAVIGATION ===============*/

    if (menuToggle && nav) {
        menuToggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
        });

        // Close the mobile menu after selecting a navigation link.
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                nav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        // Close the menu when pressing Escape.
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                nav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });

        // Close the menu when clicking outside it.
        document.addEventListener("click", (event) => {
            const clickedInsideNav = nav.contains(event.target);
            const clickedToggle = menuToggle.contains(event.target);

            if (!clickedInsideNav && !clickedToggle) {
                nav.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    /*=============== HEADER SCROLL EFFECT ===============*/

    function updateHeader() {
        if (!header) return;

        header.classList.toggle("scrolled", window.scrollY > 30);
    }

    window.addEventListener("scroll", updateHeader, {
        passive: true,
    });

    updateHeader();

    /*=============== ACTIVE NAVIGATION ===============*/

    const pageSections = document.querySelectorAll(
        "main section[id], body > section[id]",
    );

    function setActiveLink() {
        let currentSection = "";

        pageSections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (
                window.scrollY >= sectionTop - 180 &&
                window.scrollY < sectionTop + sectionHeight - 100
            ) {
                currentSection = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            const target = link.getAttribute("href");

            link.classList.toggle("active", target === `#${currentSection}`);
        });
    }

    window.addEventListener("scroll", setActiveLink, {
        passive: true,
    });

    setActiveLink();

    /*=============== SCROLL REVEAL ===============*/

    const revealElements = document.querySelectorAll(
        ".section-heading, .concept-card, .code-study, .gallery-item, " +
            ".comparison-card, .studio-preview, .studio-controls, .practice-content",
    );

    revealElements.forEach((element) => {
        element.classList.add("reveal");
    });

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px",
            },
        );

        revealElements.forEach((element) => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for browsers without Intersection Observer.
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });
    }

    /*=============== FIGURE STUDIO ===============*/

    if (previewFigure && previewCaption && previewTitle && previewDescription) {
        // Store the original content so the reset button can restore it.
        const originalTitle = previewTitle.textContent;
        const originalDescription = previewDescription.textContent;

        const originalFigureClasses = Array.from(previewFigure.classList);

        const originalTitleInput = titleInput
            ? titleInput.value
            : originalTitle;

        const originalDescriptionInput = descriptionInput
            ? descriptionInput.value
            : originalDescription;

        const originalStyleLabel = styleLabel
            ? styleLabel.textContent
            : "Editorial";

        /*=============== CAPTION POSITION ===============*/

        positionButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const position = button.dataset.position;

                // Remove the previous position.
                previewFigure.classList.remove("caption-top");

                // Apply the selected position.
                if (position === "top") {
                    previewFigure.classList.add("caption-top");
                }

                // Update selected button.
                positionButtons.forEach((item) => {
                    const isActive = item === button;

                    item.classList.toggle("active", isActive);
                    item.setAttribute("aria-pressed", String(isActive));
                });
            });
        });

        /*=============== CAPTION STYLE ===============*/

        const styleNames = {
            editorial: "Editorial",
            minimal: "Minimal",
            dark: "Dark room",
        };

        styleButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const selectedStyle = button.dataset.style;

                if (!styleNames[selectedStyle]) return;

                // Remove all existing style classes.
                previewFigure.classList.remove(
                    "style-editorial",
                    "style-minimal",
                    "style-dark",
                );

                // Add the selected style.
                previewFigure.classList.add(`style-${selectedStyle}`);

                // Update the label below the preview.
                if (styleLabel) {
                    styleLabel.textContent = `Current style / ${styleNames[selectedStyle]}`;
                }

                // Update selected button.
                styleButtons.forEach((item) => {
                    const isActive = item === button;

                    item.classList.toggle("active", isActive);
                    item.setAttribute("aria-pressed", String(isActive));
                });
            });
        });

        /*=============== LIVE CAPTION EDITING ===============*/

        if (titleInput) {
            titleInput.addEventListener("input", () => {
                previewTitle.textContent =
                    titleInput.value.trim() || "Untitled photograph";
            });
        }

        if (descriptionInput) {
            descriptionInput.addEventListener("input", () => {
                previewDescription.textContent =
                    descriptionInput.value.trim() ||
                    "Add a short description to your photograph.";
            });
        }

        /*=============== RESET STUDIO ===============*/

        if (resetButton) {
            resetButton.addEventListener("click", () => {
                // Restore original figure classes.
                previewFigure.className = originalFigureClasses.join(" ");

                // Restore original caption.
                previewTitle.textContent = originalTitle;
                previewDescription.textContent = originalDescription;

                // Restore input values.
                if (titleInput) {
                    titleInput.value = originalTitleInput;
                }

                if (descriptionInput) {
                    descriptionInput.value = originalDescriptionInput;
                }

                // Restore style label.
                if (styleLabel) {
                    styleLabel.textContent = originalStyleLabel;
                }

                // Reset position buttons.
                positionButtons.forEach((button) => {
                    const isActive = button.dataset.position === "bottom";

                    button.classList.toggle("active", isActive);
                    button.setAttribute("aria-pressed", String(isActive));
                });

                // Reset style buttons.
                styleButtons.forEach((button) => {
                    const isActive = button.dataset.style === "editorial";

                    button.classList.toggle("active", isActive);
                    button.setAttribute("aria-pressed", String(isActive));
                });
            });
        }

        // Set initial accessibility states.
        positionButtons.forEach((button) => {
            button.setAttribute(
                "aria-pressed",
                String(button.classList.contains("active")),
            );
        });

        styleButtons.forEach((button) => {
            button.setAttribute(
                "aria-pressed",
                String(button.classList.contains("active")),
            );
        });
    }

    /*=============== FOOTER YEAR ===============*/

    const yearElement = document.querySelector("#current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});
