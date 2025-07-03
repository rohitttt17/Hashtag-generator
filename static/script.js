async function generateHashtags() {
  const topic = document.getElementById("topicInput").value.trim();
  const output = document.getElementById("output");
  const copyContainer = document.getElementById("copyContainer");

  output.innerHTML = "⏳ Generating...";
  copyContainer.style.display = "none"; // Hide button before generation

  if (!topic) {
    output.innerHTML = "<span>Please enter a topic!</span>";
    return;
  }

  const res = await fetch("/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic })
  });

  const data = await res.json();
  output.innerHTML = "";

  data.hashtags.forEach(tag => {
    const span = document.createElement("span");
    span.textContent = tag;
    output.appendChild(span);
  });

  // Show copy button only after hashtags are generated
  copyContainer.style.display = "block";
}

function copyHashtags() {
  const hashtags = [...document.querySelectorAll(".hashtags span")]
    .map(span => span.textContent)
    .join(" ");

  if (!hashtags) return;

  navigator.clipboard.writeText(hashtags).then(() => {
    const status = document.getElementById("copyStatus");
    status.textContent = "✅ Copied!";
    setTimeout(() => (status.textContent = ""), 2000);
  });
}
