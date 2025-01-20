document.addEventListener("DOMContentLoaded", () => {
    const list = document.getElementById("taggedList");
    const downloadButton = document.getElementById("downloadData");
  
    chrome.storage.local.get({ taggedProfiles: [] }, (data) => {
      const taggedProfiles = data.taggedProfiles || [];
      taggedProfiles.forEach((profile) => {
        const li = document.createElement("li");
        li.textContent = `${profile.url} - ${profile.tag}`;
        list.appendChild(li);
      });
    });
  
    downloadButton.addEventListener("click", () => {
      chrome.storage.local.get({ taggedProfiles: [] }, (data) => {
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
  });
  