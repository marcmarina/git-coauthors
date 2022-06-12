const inquirer = require('inquirer');
const inqurierCheckboxPlus = require('inquirer-checkbox-plus-prompt');
const fuzzy = require('fuzzy');
const clipboardy = require('clipboardy');
const simpleGit = require('simple-git');
const _ = require('lodash');

const git = simpleGit();

const getFormattedLog = async () => {
  const fullLog = await git.log();

  const formattedLog = fullLog.all.map(
    (logEntry) =>
      `Co-authored-by: ${logEntry.author_name} <${logEntry.author_email}>`,
  );

  return _.uniqWith(formattedLog, _.isEqual);
};

const choicesSearch = async (_, input) => {
  input = input || '';

  const fuzzyResult = fuzzy.filter(input, await getFormattedLog());

  return fuzzyResult.map((element) => element.original);
};

const userPrompt = async () => {
  inquirer.registerPrompt('checkbox-plus', inqurierCheckboxPlus);

  const { authors } = await inquirer.prompt([
    {
      type: 'checkbox-plus',
      message: `Which co-authors do you want to select? (type for autocomplete)`,
      pageSize: 15,
      name: 'authors',
      source: choicesSearch,
      searchable: true,
    },
  ]);

  if (authors?.length) clipboardy.writeSync(authors.join('\n'));
};

userPrompt();
