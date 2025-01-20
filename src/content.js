// Function to create the floating tagging interface
function createTaggerPopup(message, profileUrl) {
    // Remove existing popup if present
    const existingPopup = document.getElementById("linkedTaggerPopup");
    if (existingPopup) existingPopup.remove();
  
    const popup = document.createElement("div");
    popup.id = "linkedTaggerPopup";
    popup.style = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: white;
      border: 1px solid #ccc;
      padding: 15px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      width: 300px;
      border-radius: 8px;
    `;
  
    popup.innerHTML = `
      <p>${message}</p>
      <button data-tag="Interested" style="margin: 5px;">Interested</button>
      <button data-tag="Not Interested" style="margin: 5px;">Not Interested</button>
      <button id="skipTagging" style="margin: 5px;">Skip</button>
      <div id="commentBox" style="margin-top: 10px; display: none;">
        <textarea id="commentInput" placeholder="Add a comment..." rows="3" style="width: 100%;"></textarea>
        <button id="saveComment" style="margin: 5px; margin-top: 10px;">Save</button>
      </div>
    `;
  
    document.body.appendChild(popup);
  
    // Add event listeners for buttons
    popup.addEventListener("click", (e) => {
      const tag = e.target.dataset.tag;
      if (tag) {
        // Show comment box for tagging
        document.getElementById("commentBox").style.display = "block";
  
        // Save comment and tag when user clicks "Save"
        document.getElementById("saveComment").addEventListener("click", () => {
          const comment = document.getElementById("commentInput").value;
          saveTag(profileUrl, tag, comment);
          alert(`Profile tagged as "${tag}" with comment: "${comment}"`);
          popup.remove();
        });
      }
  
      // Handle "Skip"
      if (e.target.id === "skipTagging") {
        popup.remove();
      }
    });
  
    // Close comment box on clicking outside
    document.addEventListener("click", (event) => {
      if (!popup.contains(event.target)) {
        popup.remove();
      }
    });
  }
  
  // Function to save tags to local storage
  function saveTag(profileUrl, tag, comment) {
    const timestamp = new Date().toISOString();
    chrome.storage.local.get({ taggedProfiles: [] }, (data) => {
      const taggedProfiles = data.taggedProfiles || [];
      taggedProfiles.push({ url: profileUrl, tag, comment, timestamp });
      chrome.storage.local.set({ taggedProfiles });
    });
  }
  
  // Main execution
  if (window.location.href.includes("/in/")) {
    const profileUrl = window.location.href;
  
    chrome.storage.local.get({ taggedProfiles: [] }, (data) => {
      const taggedProfiles = data.taggedProfiles || [];
      const existingTag = taggedProfiles.find((entry) => entry.url === profileUrl);
  
      if (existingTag) {
        // Show previous tag message
        let message = "";
        if (existingTag.tag === "Interested") {
          message = "You have shown Interest in working with this profile in the future.";
        } else if (existingTag.tag === "Not Interested") {
          message = "You have shown not to work with this profile in the future.";
        }
        createTaggerPopup(message, profileUrl);
      } else {
        // Show default message for new profile
        createTaggerPopup(
          "Are you Interested to work with this profile in the future?",
          profileUrl
        );
      }
    });
  }
  