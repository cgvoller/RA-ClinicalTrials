// Render the Trials.md file into HTML
fetch('Trials.md')
  .then(res => res.text())
  .then(md => {
    const html = marked.parse(md);
    document.getElementById('markdown-preview').innerHTML = html;
  })
  .catch(err => {
    document.getElementById('markdown-preview').innerText = "Error loading markdown.";
    console.error(err);
  });

// Handle form submission (no backend yet)
document.getElementById('trialForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const entry = {};
  formData.forEach((value, key) => {
    entry[key] = value;
  });

  console.log("New submission:", entry);
  alert("Thanks! (This doesn't save anywhere yet — backend coming soon)");
  e.target.reset();
});