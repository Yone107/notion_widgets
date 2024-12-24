document.addEventListener("DOMContentLoaded", () => {
  const healthBar = document.getElementById("health-bar");
  const fightButton = document.getElementById("fight-button");
  const attackInput = document.getElementById("attack-input");
  const errorMessage = document.getElementById("error-message");
  const popup = document.getElementById("popup");
  const nextBossButton = document.getElementById("next-boss-button");
  const bossImage = document.getElementById("boss-image");
  const bossNameElement = document.getElementById("boss-name");
  const gameContainer = document.querySelector(".game-container"); // For blurring the background
  const defeatedOverlay = document.getElementById("popup-overlay"); // Defeated video overlay

  let currentBoss = 0; // Current boss index
  const bosses = [
    { name: "Itachi Uchiha", image: "Itachi Norm.mp4", defeatedVideo: "Itachi defeated.mp4", health: 1, codes: ["adam12"] },
    { name: "Dio Brando", image: "boss2.gif", defeatedVideo: "Dio defeated.mp4", health: 2, codes: ["dio12", "sui12"] },
  ];

  let bossHealth = bosses[currentBoss].health;
  let currentCodeIndex = 0;

  const loadBoss = () => {
    const boss = bosses[currentBoss];
    bossHealth = boss.health;
    currentCodeIndex = 0;
    bossImage.src = boss.image; // Reset to the boss video
    bossImage.loop = true; // Ensure the boss video loops
    bossImage.muted = true; // Keep muted during normal gameplay
    bossImage.play(); // Start the boss video
    bossNameElement.textContent = boss.name; // Update the boss name
    healthBar.style.width = "100%"; // Reset health bar
    fightButton.style.display = "block"; // Show the fight button
    attackInput.style.display = "none"; // Hide the attack input initially
    attackInput.value = ""; // Clear any previous input
    popup.classList.add("hidden"); // Hide the congratulations popup
    defeatedOverlay.classList.add("hidden"); // Hide defeated video overlay
    gameContainer.classList.remove("cinematic-bg"); // Remove background effects
  };

  const playDefeatedVideo = () => {
    const boss = bosses[currentBoss];
    bossImage.pause(); // Stop the normal boss video
    gameContainer.classList.add("cinematic-bg"); // Apply darkening and blur
  
    // Show the defeated video overlay
    const defeatedVideo = document.createElement("video");
    defeatedVideo.src = boss.defeatedVideo;
    defeatedVideo.autoplay = true;
    defeatedVideo.muted = false; // Unmute for dramatic effect
    defeatedVideo.loop = true;
    defeatedVideo.classList.add("cinematic-video");
    defeatedOverlay.appendChild(defeatedVideo);
    defeatedOverlay.classList.remove("hidden");
  
    // Show the popup just before the defeated video ends
    defeatedVideo.ontimeupdate = () => {
      if (defeatedVideo.currentTime >= defeatedVideo.duration - 1.5) {
        // Show the congratulations popup
        popup.classList.remove("hidden");
        defeatedVideo.ontimeupdate = null; // Prevent multiple triggers
      }
    };
  
  };
  

  fightButton.addEventListener("click", () => {
    fightButton.style.display = "none"; // Hide the fight button
    attackInput.style.display = "block"; // Show the attack input
  });

  attackInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const attackCode = attackInput.value.trim();
      if (attackCode === bosses[currentBoss].codes[currentCodeIndex]) {
        bossHealth -= 1; // Decrease boss health
        healthBar.style.width = `${(bossHealth / bosses[currentBoss].health) * 100}%`; // Update health bar

        if (bossHealth <= 0) {
          playDefeatedVideo(); // Play the cinematic defeated video
        } else {
          currentCodeIndex++; // Move to the next required code
        }
      } else {
        errorMessage.classList.remove("hidden"); // Show error message
        setTimeout(() => errorMessage.classList.add("hidden"), 2000); // Hide after 2 seconds
      }
    }
  });

  nextBossButton.addEventListener("click", () => {
    currentBoss++;
    if (currentBoss >= bosses.length) {
      alert("You defeated all the bosses!"); // Victory message
    } else {
      loadBoss(); // Load the next boss
    }
  });

  loadBoss(); // Initialize the first boss
});
