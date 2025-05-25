const shortlistedSet = new Set();
let isFilterOn = false;

function renderListings(listings) {
  const container = document.querySelector(".main1-body");
  container.innerHTML = ""; // Clear existing content

  // Filter listings if the filter is clck
  const filteredListings = isFilterOn
    ? listings.filter(listing => shortlistedSet.has(listing.id))
    : listings;

  if (filteredListings.length === 0 && isFilterOn) {
    container.innerHTML = '<p class="no-listings">No shortlisted listings found. Turn off the filter to see all.</p>';
    return;
  } else if (filteredListings.length === 0) {
    container.innerHTML = '<p class="no-listings">No listings available.</p>';
    return;
  }

  filteredListings.forEach((listing) => {
    const card = document.createElement("div");
    card.className = "listing-card";
    card.dataset.id = listing.id;

    const isCurrentListingShortlisted = shortlistedSet.has(listing.id);


    const shortlistIconSrc = isCurrentListingShortlisted
      ? "images/Vector copy.png"
      : "images/outline.png";

    // Star Rating 
    let starRatingHtml = '<div class="star-rating">';
    const totalStars = 5;
    for (let i = 1; i <= totalStars; i++) {
      if (i <= Math.floor(listing.rating)) {
        starRatingHtml += '<img src="images/FilledStar.png" alt="filled star" />';
      } else if (i - 0.5 === listing.rating) {
        starRatingHtml += '<img src="images/HalfFilledStar.png" alt="half-filled star" />';
      } else {
        starRatingHtml += '<img src="images/OutlinedStar.png" alt="outline star" />';
      }
    }
    starRatingHtml += '</div>';


    card.innerHTML = `
            <div class="listing-content">
                <div class="info">
                    <h3>${listing.name}</h3>
                    ${starRatingHtml} <p class="description">${listing.description}</p>

                    <div class="metrics">
                        <div class="metric-item"><strong>${listing.projects}</strong><span>Projects</span></div>
                        <div class="metric-item"><strong>${listing.years}</strong><span>Years</span></div>
                        <div class="metric-item"><strong>${listing.price}</strong><span>Price</span></div>
                    </div>

                    <div class="contact-numbers">
                        <p>${listing.phone1}</p>
                        <p>${listing.phone2}</p>
                    </div>
                </div>
                 <div class="divider"></div>
                <div class="actions">
                 <div class="action-buttons-inner">
                    <button class="action-btn details-btn">
                        <img src="images/arrow-right-short 1.png" alt="Details arrow icon" class="action-icon-details"/>
                        <span>Details</span>
                    </button>
                    <button class="action-btn hide-btn">
                        <img src="images/eye-slash 1.png" alt="Hide icon" class="action-icon-hide" />
                        <span>Hide</span>
                    </button>
                    <button class="action-btn shortlist-btn" data-id="${listing.id}" data-shortlisted="${isCurrentListingShortlisted}">
                        <img src="${shortlistIconSrc}" alt="Shortlist icon" class="action-icon-shortlist"/>
                        <span>Shortlist</span>
                    </button>
                    <button class="action-btn report-btn">
                        <img src="images/exclamation-circle 1.png" alt="Report icon"  class="action-icon-report"/>
                        <span>Report</span>
                    </button>
                </div>
            </div>
        `;

    container.appendChild(card);
  });

  bindShortlistButtons();
}

function bindShortlistButtons() {
  document.querySelectorAll(".shortlist-btn").forEach((btn) => {
    btn.onclick = null;
    btn.onclick = () => {
      const id = btn.dataset.id;
      const isShortlisted = btn.dataset.shortlisted === "true";

      if (isShortlisted) {
        shortlistedSet.delete(id);
        btn.dataset.shortlisted = "false";
        btn.querySelector("img").src = "images/outline.png";
      } else {
        shortlistedSet.add(id);
        btn.dataset.shortlisted = "true";
        btn.querySelector("img").src = "images/Vector copy.png";
      }

      if (isFilterOn) {
        fetchAndRender();
      }
    };
  });
}

function fetchAndRender() {
  fetch("data/listings.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      renderListings(data);
    })
    .catch((error) => {
      console.error("Error fetching listings:", error);
      document.querySelector(".main1-body").innerHTML = '<p class="error-message">Failed to load listings. Please try again later.</p>';
    });
}

document.getElementById("shortlisted-filter").onclick = () => {
  isFilterOn = !isFilterOn;
  document.getElementById("shortlisted-filter").classList.toggle("active", isFilterOn);
  fetchAndRender();
};

fetchAndRender();