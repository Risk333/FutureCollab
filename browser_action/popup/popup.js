document.addEventListener("DOMContentLoaded", () => {
  const webBrowser = typeof browser !== "undefined" ? browser : chrome;

  const interestedTableBody = document.querySelector("#interestedProfilesTable tbody");
  const notInterestedTableBody = document.querySelector("#notInterestedProfilesTable tbody");
  const downloadButton = document.getElementById("downloadData");
  const removeDataButton = document.getElementById("removeData");

  // Display the data in respective sections
  webBrowser.storage.local.get({ taggedProfiles: [] }, (data) => {
    const taggedProfiles = data.taggedProfiles || [];

    taggedProfiles.forEach((profile) => {
      const tableBody = profile.tag === "Interested" ? interestedTableBody : notInterestedTableBody;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${profile.url || ""}</td>
        <td>${profile.comment}</td>
      `;
      tableBody.appendChild(row);
    });
  });

  // Download the data
  downloadButton.addEventListener("click", () => {
    webBrowser.storage.local.get({ taggedProfiles: [] }, (data) => {
      const taggedProfiles = data.taggedProfiles || [];
      const header = ["Profile URL", "Tag", "Comment", "Timestamp"];
      const rows = taggedProfiles.map(profile => [
        profile.url,
        profile.tag,
        profile.comment || "",
        profile.timestamp || ""
      ]);
      const csvContent = [
        header.join(","),
        ...rows.map(row => row.map(value => `"${value}"`).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tagged_profiles.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  });

  // Remove all data
  removeDataButton.addEventListener("click", () => {
    webBrowser.storage.local.set({ taggedProfiles: [] }, () => {
      interestedTableBody.innerHTML = "";
      notInterestedTableBody.innerHTML = "";
      alert("All entries have been removed!");
    });
  });

  // Display extension version
  const manifestData = webBrowser.runtime.getManifest();
  document.getElementById("ext-version").textContent = "v" + manifestData.version;
});
