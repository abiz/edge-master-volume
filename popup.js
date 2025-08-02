// Get all tabs and build UI
chrome.tabs.query({}, (tabs) => {
  const container = document.getElementById("tabList");
  container.innerHTML = "";

  // Sort tabs to show the active tab first, then render UI
  chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
    const activeTabId = activeTabs[0]?.id;

    // Filter out non-http(s) tabs
    const filteredTabs = tabs.filter(tab =>
      tab.url?.startsWith("http://") || tab.url?.startsWith("https://")
    );
    
    filteredTabs.sort((a, b) => {
      if (a.id === activeTabId) return -1;
      if (b.id === activeTabId) return 1;
      return 0;
    });

    filteredTabs.forEach(tab => {
      const tabDiv = document.createElement("div");
      tabDiv.className = "tab";
      tabDiv.title = tab.title;

      // Favicon
      const favicon = document.createElement("img");
      favicon.src = tab.favIconUrl || "";
      favicon.alt = "";
      favicon.style.width = "16px";
      favicon.style.height = "16px";
      favicon.style.marginRight = "6px";
      favicon.style.verticalAlign = "middle";

      // Title Label
      const titleDiv = document.createElement("div");
      titleDiv.textContent = tab.title;
      titleDiv.style.fontSize = "12px";
      titleDiv.style.marginBottom = "4px";
      titleDiv.style.overflow = "hidden";
      titleDiv.style.textOverflow = "ellipsis";
      titleDiv.style.whiteSpace = "nowrap";
      titleDiv.style.width = "100%";

      const titleRow = document.createElement("div");
      titleRow.style.display = "flex";
      titleRow.style.alignItems = "center";
      titleRow.style.gap = "6px";
      titleRow.style.marginBottom = "4px";
      titleRow.appendChild(favicon);
      titleRow.appendChild(titleDiv);

      // Mute Button
      const muteBtn = document.createElement("button");
      muteBtn.className = "mute-btn";
      muteBtn.style.background = "none";
      muteBtn.style.border = "none";
      muteBtn.style.padding = "0";
      muteBtn.style.margin = "0";
      muteBtn.style.cursor = "pointer";
      muteBtn.style.display = "flex";
      muteBtn.style.alignItems = "center";

      const muteIcon = document.createElement("img");
      muteIcon.src = tab.mutedInfo?.muted ? "icons/volume-mute.svg" : "icons/volume-high.svg";
      muteIcon.alt = tab.mutedInfo?.muted ? "Muted" : "Unmuted";
      muteIcon.width = 20;
      muteIcon.height = 20;
      muteBtn.appendChild(muteIcon);

      muteBtn.onclick = () => {
        chrome.tabs.get(tab.id, (updatedTab) => {
          const newMutedState = !updatedTab.mutedInfo.muted;
          chrome.tabs.update(tab.id, { muted: newMutedState });
          muteIcon.src = newMutedState ? "icons/volume-mute.svg" : "icons/volume-high.svg";
          muteIcon.alt = newMutedState ? "Muted" : "Unmuted";
        });
      };

      // Volume Slider
      const volumeInput = document.createElement("input");
      volumeInput.type = "range";
      volumeInput.min = 0;
      volumeInput.max = 200;
      volumeInput.value = 100;
      volumeInput.className = "volume-slider";

      const volumeLabel = document.createElement("div");
      volumeLabel.className = "volume-label";
      volumeLabel.textContent = "100%";

      // Load saved volume from storage
      chrome.storage.local.get("vol_" + tab.id, (result) => {
        const savedVolume = result["vol_" + tab.id] ?? 100;
        volumeInput.value = savedVolume;
        volumeLabel.textContent = savedVolume + "%";
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: setVolume,
          args: [savedVolume / 100]
        });
      });

      // Store volume in storage on change
      volumeInput.oninput = () => {
        const value = volumeInput.value;
        volumeLabel.textContent = value + "%";
        chrome.storage.local.set({ ["vol_" + tab.id]: value });
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: setVolume,
          args: [value / 100]
        });
      };

      const controlsDiv = document.createElement("div");
      controlsDiv.className = "tab-controls";
      controlsDiv.appendChild(muteBtn);
      controlsDiv.appendChild(volumeInput);
      controlsDiv.appendChild(volumeLabel);

      tabDiv.appendChild(titleRow);
      tabDiv.appendChild(controlsDiv);
      container.appendChild(tabDiv);
    });
  });
});

// Cleanup volume storage when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.remove("vol_" + tabId);
});

// Injected function
function setVolume(multiplier) {
  const elements = document.querySelectorAll("audio, video");
  elements.forEach(el => {
    try {
      if (!el._volumeBoosted) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const source = ctx.createMediaElementSource(el);
        const gain = ctx.createGain();
        gain.gain.value = multiplier;
        source.connect(gain).connect(ctx.destination);
        el._volumeBoosted = true;
        el._gainNode = gain;
      } else {
        el._gainNode.gain.value = multiplier;
      }
    } catch (e) {
      el.volume = Math.min(multiplier, 1.0);
    }
  });
}
