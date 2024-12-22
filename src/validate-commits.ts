import * as core from "@actions/core";
import * as github from "@actions/github";
import axios from "axios";



validateCommits();

type Commit = {
  sha: string;
  message: string;
  diff: {
    filename: string;
    changes: number;
    patch: string;
  }[];
}

type CommitFeedback = {
  feedback: string;
}

async function validateCommits() {
  try {
    // Inputs from action.yml
    const token = core.getInput("GITHUB_TOKEN");
    const serviceUrl = core.getInput("SERVICE_URL");

    const octokit = github.getOctokit(token);
    const context = github.context;

    if (!context.payload.pull_request) {
      console.log("This action must be run in a pull_request event.");
      core.setFailed("This action must be run in a pull_request event.");
      return;
    }

    const owner = context.repo.owner;
    const repo = context.repo.repo;
    const pullNumber = context.payload.pull_request.number;

    // Get all commits in the PR
    const { data: commits } = await octokit.rest.pulls.listCommits({
      owner,
      repo,
      pull_number: pullNumber,
    });

    commits.forEach((commit) => {
      console.log({commit});
    })

  //   for (const commit of commits) {
  //     const message = commit.commit.message;
  //     const sha = commit.sha;

  //     const diff = await fetchCommitDiff(octokit, owner, repo, sha);

  //     // Call external service for validation
  //     const response: Axios.AxiosXHR<CommitFeedback> = await axios.post(serviceUrl, {
  //       sha,
  //       message,
  //       diff,
  //     });

  //     // Post feedback if any issues are found
  //     if (response.data.feedback) {
  //       await octokit.rest.issues.createComment({
  //         owner,
  //         repo,
  //         issue_number: pullNumber,
  //         body: `Feedback on commit [${sha.substring(0, 7)}](https://github.com/${owner}/${repo}/commit/${sha}): ${response.data.feedback}`,
  //       });
  //     }
  //   }
  } catch (error: any) {
    core.setFailed(`Action failed with error: ${error.message}`);
  }
}



// async function fetchCommitDiff(
//   octokit: ReturnType<typeof github.getOctokit>,
//   owner: string,
//   repo: string,
//   sha: string
// ): Promise<Commit["diff"]> {
//   const { data } = await octokit.rest.repos.getCommit({
//     owner,
//     repo,
//     ref: sha,
//   });

//   return data.files?.map((file) => ({
//     filename: file.filename || "",
//     changes: file.changes || 0,
//     patch: file.patch || "",
//   })) || [];
// }


