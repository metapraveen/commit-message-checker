"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
validateCommits();
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
            console.log({ commit });
        });
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
    }
    catch (error) {
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
