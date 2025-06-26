const { Octokit } = require("@octokit/rest");

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const token = process.env.GITHUB_TOKEN;
  const data = JSON.parse(event.body);

  const newRow = [
    data.number || "",
    data.trialName,
    data.status,
    data.phase,
    data.raMethod,
    data.sampleSize,
    data.arms,
    data.outcome,
    data.condition,
    data.primaryEndpoint,
    data.notes,
    data.doi,
    data.year
  ].map(cell => `| ${cell || ""} `).join("") + "|";

  const octokit = new Octokit({ auth: token });

  const owner = "cgvoller";
  const repo = "RA-ClinicalTrials";
  const path = "Trials.md";

  try {
    const { data: file } = await octokit.repos.getContent({ owner, repo, path });
    const oldContent = Buffer.from(file.content, "base64").toString();
    const updatedContent = oldContent.trim() + "\n" + newRow + "\n";
    const contentEncoded = Buffer.from(updatedContent).toString("base64");

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: "Add new trial from form",
      content: contentEncoded,
      sha: file.sha,
    });

    return { statusCode: 200, body: "Success!" };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Failed to update Trials.md" };
  }
};
