
document.addEventListener("DOMContentLoaded", function () {

    // 1. Get the search input from HTML
    const searchInput = document.getElementById("gigSearch");

    // 2. Get the Search Gigs button
    const searchButton = document.getElementById("searchButton");

    // 3. Get the gig cards container
    const gigContainer = document.getElementById("gigContainer");

    // 4. Get all gig cards
    const gigCards = gigContainer.querySelectorAll(
        '[data-purpose="gig-card"]'
    );

    // 5. Create a message for when no gigs match
    const noResults = document.createElement("p");

    noResults.textContent = "No gigs found. Try another search.";
    noResults.className =
        "hidden col-span-full text-center text-slate-500 py-10";

    gigContainer.after(noResults);

    // 6. Function to search gigs
    function searchGigs() {

        // Read what the user typed
        const searchText = searchInput.value
            .toLowerCase()
            .trim();

        // Count matching gigs
        let matchCount = 0;

        // Check every gig card
        gigCards.forEach(function (card) {

            // Read gig title
            const title = card.querySelector("h3")
                .textContent.toLowerCase();

            // Read gig description
            const description = card.querySelector("p")
                .textContent.toLowerCase();

            // Check for matching text
            const matches =
                title.includes(searchText) ||
                description.includes(searchText);

            // Show or hide the card
            card.classList.toggle("hidden", !matches);

            if (matches) {
                matchCount++;
            }
        });

        // Show a message if nothing matches
        noResults.classList.toggle(
            "hidden",
            matchCount !== 0
        );
    }

    // 7. Search when the button is clicked
    searchButton.addEventListener("click", searchGigs);

    // 8. Search while the user types
    searchInput.addEventListener("input", searchGigs);

    // 9. Search when Enter is pressed
    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            searchGigs();
        }
    });

    // ====================================
    // SORTING FUNCTIONALITY
    // ====================================

    // Get the sorting dropdown
    const sortDropdown = document.getElementById("sortGigs");

    // Store the original order of the cards
    const originalCards = Array.from(gigCards);

    // Function to extract hourly payment
    function getGigPrice(card) {

        // Find the price text, such as ₹450
        const priceElement = card.querySelector(".text-xl");

        // Remove currency symbols and convert to a number
        const price = Number(
            priceElement.textContent.replace(/[^0-9.]/g, "")
        );

        return price;
    }

    // Function to sort gigs
    function sortGigs() {

        // Read the selected option
        const selectedOption = sortDropdown.value;

        // Create a copy of the original card array
        let sortedCards = [...originalCards];

        if (selectedOption === "highest") {

            // Sort cards from highest to lowest price
            sortedCards.sort(function (a, b) {
                return getGigPrice(b) - getGigPrice(a);
            });

        }

        // Add cards back in the new order
        sortedCards.forEach(function (card) {
            gigContainer.appendChild(card);
        });

    }

    // Run sorting whenever dropdown selection changes
    sortDropdown.addEventListener("change", sortGigs);


    // =====================================
    // STEP 3 - VIEW GIG POPUP
    // =====================================

    // Select popup elements
    const gigModal = document.getElementById("gigModal");
    const closeGigModal = document.getElementById("closeGigModal");

    const modalTitle = document.getElementById("modalTitle");
    const modalCompany = document.getElementById("modalCompany");
    const modalDescription = document.getElementById("modalDescription");
    const modalPrice = document.getElementById("modalPrice");

    const applyNowButton = document.getElementById("applyNowButton");

    // Save the button that opened the popup
    let lastFocusedButton = null;

    // Open popup for the selected gig
    function openGigModal(card, button) {

        // Read the title
        const title = card.querySelector("h3").textContent.trim();

        // Read the description
        const description = card.querySelector("p").textContent.trim();

        // Read the payment
        const price = card.querySelector(".text-xl").textContent.trim();

        // Read the employer name from the card footer
        const company = card.querySelector(
            ".border-t .text-slate-700"
        ).textContent.trim();

        // Insert the gig details into the popup
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalPrice.textContent = price;
        modalCompany.textContent = company;

        // Remember the selected gig
        applyNowButton.dataset.gigTitle = title;

        // Remember which button opened the popup
        lastFocusedButton = button;

        // Display the popup
        gigModal.classList.add("active");
        gigModal.setAttribute("aria-hidden", "false");

        // Prevent scrolling behind the popup
        document.body.style.overflow = "hidden";

        // Focus the close button
        closeGigModal.focus();
    }

    // Close the popup
    function closeModal() {

        gigModal.classList.remove("active");
        gigModal.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";

        // Return focus to the original View Gig button
        if (lastFocusedButton) {
            lastFocusedButton.focus();
        }
    }

    // Attach click events to all gig cards
    gigCards.forEach(function (card) {

        const viewButton = Array.from(
            card.querySelectorAll("button")
        ).find(button => button.textContent.trim() === "View Gig");

        if (viewButton) {
            viewButton.addEventListener("click", function () {
                openGigModal(card, viewButton);
            });
        }
    });

    // Close using the X button
    closeGigModal.addEventListener("click", closeModal);

    // Close by clicking outside the popup
    gigModal.addEventListener("click", function (event) {
        if (event.target === gigModal) {
            closeModal();
        }
    });

    // Close by pressing Escape
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" &&
            gigModal.classList.contains("active")) {
            closeModal();
        }
    });

    // =====================================
    // STEP 4 - APPLY NOW FORM
    // =====================================

    const applicationModal =
        document.getElementById("applicationModal");

    const closeApplicationButton =
        document.getElementById("closeApplicationModal");

    const applicationForm =
        document.getElementById("gigApplicationForm");

    const selectedGig =
        document.getElementById("selectedGig");

    const applicantName =
        document.getElementById("applicantName");

    const applicantEmail =
        document.getElementById("applicantEmail");

    const applicantSkills =
        document.getElementById("applicantSkills");

    const applicationReason =
        document.getElementById("applicationReason");

    const applicationMessage =
        document.getElementById("applicationMessage");

    // Open application form when Apply Now is clicked
    applyNowButton.addEventListener("click", function () {

        const gigTitle = applyNowButton.dataset.gigTitle;

        // Close gig details popup
        closeModal();

        // Reset previous form values
        applicationForm.reset();

        // Insert the selected gig automatically
        selectedGig.value = gigTitle;

        // Hide previous feedback
        applicationMessage.classList.add("hidden");
        applicationMessage.textContent = "";

        // Open application popup
        applicationModal.classList.add("active");
        applicationModal.setAttribute("aria-hidden", "false");

        // Disable background scrolling
        document.body.style.overflow = "hidden";

        // Focus first editable field
        applicantName.focus();
    });

    // Close application form
    function closeApplicationModal() {

        applicationModal.classList.remove("active");
        applicationModal.setAttribute("aria-hidden", "true");

        document.body.style.overflow = "";

        // Return focus to the View Gig button
        if (lastFocusedButton) {
            lastFocusedButton.focus();
        }
    }

    // Close using X button
    closeApplicationButton.addEventListener(
        "click",
        closeApplicationModal
    );

    // Close by clicking the background
    applicationModal.addEventListener("click", function (event) {

        if (event.target === applicationModal) {
            closeApplicationModal();
        }
    });

    // Close using Escape key
    document.addEventListener("keydown", function (event) {

        if (
            event.key === "Escape" &&
            applicationModal.classList.contains("active")
        ) {
            closeApplicationModal();
        }
    });

    // =====================================
    // FORM VALIDATION AND SUBMISSION
    // =====================================

    applicationForm.addEventListener("submit", function (event) {

        // Prevent the page from refreshing
        event.preventDefault();

        // HTML validation
        if (!applicationForm.checkValidity()) {
            applicationForm.reportValidity();
            return;
        }

        // Read user inputs
        const name = applicantName.value.trim();
        const email = applicantEmail.value.trim();
        const skills = applicantSkills.value.trim();
        const reason = applicationReason.value.trim();

        // Validate name
        if (name.length < 2) {
            showApplicationError("Please enter a valid full name.");
            return;
        }

        // Validate skills
        if (skills.length < 2) {
            showApplicationError("Please enter your relevant skills.");
            return;
        }

        // Validate reason
        if (reason.length < 20) {
            showApplicationError(
                "Please write at least 20 characters about yourself."
            );
            return;
        }

        // Prepare the application data
        const applicationData = {
            gigTitle: selectedGig.value,
            studentName: name,
            email: email,
            skills: skills,
            reason: reason,
            submittedAt: new Date().toISOString()
        };

        // Display in console for testing
        console.log("Validated application:", applicationData);

        // This is validation only.
        // The backend submission will be added in Step 5.
        applicationMessage.textContent =
            "Form validated successfully! JSON saving will be connected next.";

        applicationMessage.className =
            "text-sm text-green-600 font-semibold";

    });

    // Display validation errors
    function showApplicationError(message) {

        applicationMessage.textContent = message;

        applicationMessage.className =
            "text-sm text-red-600 font-medium";
    }


    



});
