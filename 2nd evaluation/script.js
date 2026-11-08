
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

});
