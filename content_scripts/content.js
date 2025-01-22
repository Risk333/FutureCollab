// Function to create the floating tagging interface
function createTaggerPopup(message, comment, profileUrl) {
  // Remove existing popup if present
  const existingPopup = document.getElementById("linkedTaggerPopup");
  if (existingPopup) existingPopup.remove();

  const existingMiniPopup = document.getElementById("linkedTaggerMinimized");
  if (existingMiniPopup) existingMiniPopup.remove();

  // Create the popup container
  const popup = document.createElement("div");
  popup.id = "linkedTaggerPopup";
  popup.style = `
      position: fixed;
      top: 10px;
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

  // Set popup content
  popup.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <p style="margin: 0;">${message}</p>
        <button id="minimizePopup" style="
            background: none; 
            border: none; 
            font-size: 16px; 
            cursor: pointer;
        ">&#x2715;</button>
      </div>
      <style>
        .button {
          background-color: #04AA6D;
          border: none;
          color: white;
          margin: 5px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          transition-duration: 0.4s;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 5px;
        }

        .button1 {
          background-color: white; 
          color: black; 
          border: 2px solid #04AA6D;
        }

        .button1:hover {
          background-color: #04AA6D;
          color: white;
        }
        
        .button1.clicked {
          background-color: #04AA6D;
          color: white;
        }

        .button2 {
          background-color: white; 
          color: black; 
          border: 2px solid #f44336;
        }

        .button2:hover {
          background-color: #f44336;
          color: white;
        }
        
        .button2.clicked {
          background-color: #f44336;
          color: white;
        }

        .button3 {
          background-color: white;
          color: black;
          border: 2px solid #e7e7e7;
        }

        .button3:hover {
          background-color: #e7e7e7;
        }

        .button4 {
          background-color: #e7e7e7;
          color: black;
        }

        .button4:hover {
          background-color: black;
          color: white;
        }

        textarea {
          width: 100%;
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 8px;
        }
      </style>
      <button class="button button1" id="interested">Interested</button>
      <button class="button button2" id="not-interested">Not Interested</button>

      <div id="commentBox" style="margin-top: 10px; display: none;">
        <textarea id="commentInput" placeholder="${comment}" rows="3"></textarea>
        <button class="button button4" id="saveComment" style="margin-top: 10px;">Save</button>
        <button class="button button3" id="skipTagging" style="margin-top: 10px;">Skip</button>
      </div>
    `;

  document.body.appendChild(popup);

  // Event listeners for buttons
  document.getElementById("interested").addEventListener("click", (event) => {
    event.target.classList.add("clicked");

    const popup = document.getElementById("linkedTaggerPopup");
    popup.dataset.tag = "Interested";
    // alert("tag: " + "Interested");
    document.getElementById("commentBox").style.display = "block"; // Show comment box for tagging
  });

  document.getElementById("not-interested").addEventListener("click", (event) => {
    event.target.classList.add("clicked");

    const popup = document.getElementById("linkedTaggerPopup");
    popup.dataset.tag = "Not-Interested";
    // alert("tag: " + "Not-Interested");
    document.getElementById("commentBox").style.display = "block"; // Show comment box for tagging
  });

  // Save comment and tag
  document.getElementById("saveComment").addEventListener("click", () => {
    const comment = document.getElementById("commentInput").value;
    const tag = popup.dataset.tag;
    // alert("tag: " + tag);
    saveTag(profileUrl, tag, comment);
    minimizePopup(); // Minimize popup after saving data
  });

  // Skip tagging
  document.getElementById("skipTagging").addEventListener("click", () => {
    const comment = "";
    const tag = popup.dataset.tag;
    // alert("tag: " + tag);
    saveTag(profileUrl, tag, comment);
    minimizePopup(); // Minimize popup after skipping
  });

  // Minimize the popup to a small button
  document.getElementById("minimizePopup").addEventListener("click", minimizePopup);

  // Close the comment box if clicked outside and the comment box is active
  document.addEventListener("click", (event) => {
    const commentBox = document.getElementById("commentBox");
    const popup = document.getElementById("linkedTaggerPopup");
    if (
      commentBox &&
      commentBox.style.display === "block" &&
      !popup.contains(event.target) &&
      event.target.id !== "not-interested" &&
      event.target.id !== "interested" // Ignore clicks on the buttons
    ) {
      const comment = document.getElementById("commentInput").value;
      const tag = popup.dataset.tag;
      // alert("tag: " + tag);
      saveTag(profileUrl, tag, comment);
      minimizePopup(); // Minimize popup after clicking outside
    }
  });

}

// Function to save tags to local storage
function saveTag(profileUrl, tag, comment) {
  const timestamp = new Date().toISOString();

  // Retrieve existing tagged profiles and update the entry for the profile
  const webBrowser = (typeof browser !== "undefined" ? browser : chrome);
  webBrowser.storage.local.get({ taggedProfiles: [] }, (data) => {
    const taggedProfiles = data.taggedProfiles || [];

    // Filter out any existing entry for the same profileUrl
    const updatedProfiles = taggedProfiles.filter((entry) => entry.url !== profileUrl);

    // Add the new or updated entry
    updatedProfiles.push({ url: profileUrl, tag, comment, timestamp });

    // Save updated list back to storage
    webBrowser.storage.local.set({ taggedProfiles: updatedProfiles });
  });
}

// Function to minimize the popup
function minimizePopup() {
  const popup = document.getElementById("linkedTaggerPopup");
  if (popup) popup.remove();

  // Create the minimized button
  const minimizedButton = document.createElement("div");
  minimizedButton.id = "linkedTaggerMinimized";
  minimizedButton.style = `
      position: fixed;
      top: 10px;
      right: 10px;
      width: 50px;
      height: 50px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 50%;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      z-index: 10000;
    `;

  const webBrowser = (typeof browser !== "undefined" ? browser : chrome);
  const img = webBrowser.runtime.getURL("../web_accessible_resources/FutureCollab_minimize.png");
  minimizedButton.innerHTML = `<img src="${img}" alt="Tagger Icon" style="width: 30px; height: 30px;">`;

  // Add event listener to restore the full popup
  minimizedButton.addEventListener("click", () => {
    minimizedButton.remove();
    if (window.location.href.includes("/in/")) {
      handleProfileChange(window.location.href);
    }
  });

  document.body.appendChild(minimizedButton);
}

// Function to initialize the observer for URL changes
function observeUrlChanges() {
  let currentUrl = window.location.href;

  // Create a MutationObserver to watch for URL changes
  const observer = new MutationObserver(() => {
    if (currentUrl !== window.location.href) {
      currentUrl = window.location.href;

      // Trigger the main execution when the URL changes
      if (window.location.href.includes("/in/")) {
        handleProfileChange(currentUrl);
      }
      else {
        // Remove existing popup if present
        const existingPopup = document.getElementById("linkedTaggerPopup");
        if (existingPopup) existingPopup.remove();

        const existingMiniPopup = document.getElementById("linkedTaggerMinimized");
        if (existingMiniPopup) existingMiniPopup.remove();
      }
    }
  });

  // Observe changes to the <body> element (common for SPAs)
  observer.observe(document.body, { childList: true, subtree: true });
}

// Function to handle profile changes
function handleProfileChange(profileUrl) {
  const webBrowser = (typeof browser !== "undefined" ? browser : chrome);
  webBrowser.storage.local.get({ taggedProfiles: [] }, (data) => {
    const taggedProfiles = data.taggedProfiles || [];
    const existingProfile = taggedProfiles.find((entry) => entry.url === profileUrl);

    if (existingProfile) {
      const message =
        existingProfile.tag === "Interested"
          ? "You have marked this profile as <b>Interested</b> to work with in future! Changed your mind?"
          : "You have marked this profile as <b>Not Interested</b> to work with in future! Changed your mind?";

      const comment =
        existingProfile.comment === ""
          ? "Add a comment..."
          : existingProfile.comment;

      createTaggerPopup(message, comment, profileUrl);
    } else {
      createTaggerPopup("Are you Interested to work with this profile in the future?", "Add a comment...", profileUrl);
    }
  });
}

// Main execution: Initialize both on page load and for SPA navigation
if (window.location.href.includes("/in/")) {
  handleProfileChange(window.location.href);
}

// Initialize the observer for URL changes
observeUrlChanges();
