#! /usr/bin/env node
const inquirer = require('inquirer');
const inqurierCheckboxPlus = require('inquirer-checkbox-plus-prompt');
const fuzzy = require('fuzzy');
const clipboardy = require('clipboardy');
const simpleGit = require('simple-git');
const _ = require('lodash');
const git = simpleGit();

const getAuthors = async () => {
  const fullLog = await git.log();

  const formattedLog = fullLog.all.map(
    (logEntry) => `${logEntry.author_name} <${logEntry.author_email}>`,
  );

  return _.uniqWith(formattedLog, _.isEqual);
};

async function choicesSearch(data, input) {
  input = input || '';

  const fuzzyResult = fuzzy.filter(input, data);

  return fuzzyResult.map((element) => element.original);
}

async function main() {
  inquirer.registerPrompt('checkbox-plus', inqurierCheckboxPlus);

  const logAuthors = await getAuthors();

  const { authors } = await inquirer.prompt([
    {
      type: 'checkbox-plus',
      message: `Which co-authors do you want to select? (type for autocomplete)`,
      pageSize: 15,
      name: 'authors',
      source: async (_, input) => choicesSearch(logAuthors, input),
      searchable: true,
    },
  ]);

  if (authors?.length) {
    const formattedAuthors = authors.map(
      (author) => `Co-authored-by: ${author}`,
    );

    clipboardy.writeSync(formattedAuthors.join('\n'));
  }
}

main();