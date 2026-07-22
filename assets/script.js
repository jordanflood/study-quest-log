<script>
const boxes = [...document.querySelectorAll('input[type="checkbox"]')];

boxes.forEach((box, index) => {
  box.dataset.key = `quest-${index}`;
  box.checked = localStorage.getItem(box.dataset.key) === "1";

  box.addEventListener("change", () => {
    localStorage.setItem(box.dataset.key, box.checked ? "1" : "0");
    updateProgress();
  });
});

function percentage(items) {
  if (!items.length) {
    return 0;
  }

  const completedItems = items.filter((item) => item.checked).length;
  return Math.round((completedItems / items.length) * 100);
}

function updateProgress() {
  const dailyBoxes = boxes.filter(
    (box) => box.dataset.group === "daily",
  );
  const lowEnergyBoxes = boxes.filter(
    (box) => box.dataset.group === "low",
  );
  const weeklyBoxes = boxes.filter(
    (box) => box.dataset.group === "weekly",
  );

  const normalClear = dailyBoxes.every((box) => box.checked);
  const lowEnergyClear = lowEnergyBoxes.every((box) => box.checked);
  const dailyPercentage = Math.max(
    percentage(dailyBoxes),
    lowEnergyClear ? 100 : percentage(lowEnergyBoxes),
  );

  const dailyProgress = document.getElementById("dailyProgress");
  const dailyLabel = document.getElementById("dailyLabel");
  const weeklyProgress = document.getElementById("weeklyProgress");
  const weeklyLabel = document.getElementById("weeklyLabel");
  const dailySection = document.getElementById("dailySection");

  dailyProgress.style.width = `${dailyPercentage}%`;
  dailyLabel.textContent =
    normalClear || lowEnergyClear
      ? "Daily clear complete ✓"
      : `Daily clear: ${dailyPercentage}%`;

  const weeklyPercentage = percentage(weeklyBoxes);
  weeklyProgress.style.width = `${weeklyPercentage}%`;
  weeklyLabel.textContent = `Weekly log: ${weeklyPercentage}%`;

  dailySection.classList.toggle(
    "clear",
    normalClear || lowEnergyClear,
  );
}

function resetGroups(groups) {
  boxes
    .filter((box) => groups.includes(box.dataset.group))
    .forEach((box) => {
      box.checked = false;
      localStorage.removeItem(box.dataset.key);
    });

  updateProgress();
}

function resetDaily() {
  resetGroups(["daily", "bonus", "low"]);
}

function resetWeekly() {
  resetGroups(["weekly"]);
}

function resetAll() {
  const shouldReset = confirm("Reset all study quest progress?");

  if (shouldReset) {
    resetGroups(["daily", "bonus", "low", "weekly"]);
  }
}
</script>

updateProgress();
