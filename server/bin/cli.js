#!/usr/bin/env node

const { execSync } = require("child_process");

const runCommand = (command) => {
  try {
    execSync(`${command}`);
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);
    return false;
  }
  return true;
};

const repoName = process.argv[2];
const gitcheckoutCommand = `git clone https://github.com/Hero-debug-cloud/Backend_Template.git ${repoName}`;
const installDepsCommand = `cd ${repoName} && npm install`;

console.log(`Clonning the repository with name ${repoName}`);

const checkOut = runCommand(gitcheckoutCommand);
if (!checkOut) process.exit(-1);

console.log(`Installing dependencies for ${repoName}`);
const isntalledDeps = runCommand(installDepsCommand);

if (!isntalledDeps) process.exit(-1);

console.log("Congratulation! , Follow the following commands to start");
console.log(`cd ${repoName} && npm start`);
