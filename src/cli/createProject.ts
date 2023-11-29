import inquirer from 'inquirer';
import fs from 'fs';
import ncp from 'ncp';
import mkdirp from 'mkdirp';
import chalk from 'chalk';
import { resolve } from 'path';
import { INames, toTitleFormat, toPascalCase, toSnakeCase, changeNameInfile, createDefaultName } from '../utils/utils';

export default async function createProject() {
  const options = await promptForQuestions() as any;
  const names = {
    title: toTitleFormat(options.name),
    pascal: toPascalCase(options.name),
    snake: toSnakeCase(options.name),
  };

  const language = await promptForLanguage();

  const projectDirectory = await copyTemplate(options.directory, language.language as string);
  await writeComponentName(projectDirectory, names, language.language as string);
  await writeProjectDescription(projectDirectory, options.description);

  const finishedMessage = `

    Your project is ready!
    To get started:

      cd ${options.directory}
      yarn install
      yarn start

    The project will be running at: ${chalk.magenta('localhost:3000')}

  `;

  console.log(chalk.greenBright(finishedMessage));
}

async function promptForQuestions() {
  const questions = [
    {
      type: 'input',
      name: 'directory',
      message: 'Choose a directory name for your project:',
      validate: function(value: string) {
        const pass = /^[a-zA-Z0-9-_]+$/.test(value);

        if (pass) {
          return true;
        }

        return 'Please enter a valid directory name';
      },
    },
    {
      type: 'input',
      name: 'name',
      message: 'Choose a name for your component',
      default: (current: any) => createDefaultName(current.directory),
      validate: function(value: string) {
        const pass = /(\w+-)+\w+/.test(value);

        if (pass) {
          return true;
        }

        return 'Name must be snake-case and must contain at least two words';
      },
    },
    {
      type: 'input',
      name: 'description',
      message: 'Give your component a description (optional)',
    },
  ];

  console.log('');
  const options = inquirer.prompt(questions);
  return options;
}

async function promptForLanguage() {
  const questions = [
    {
      type: 'list',
      name: 'language',
      message: 'Which language do you want to use?',
      choices: [
        {
          value: 'js',
          name: 'JavaScript',
        },
        {
          value: 'ts',
          name: 'TypeScript',
        },
      ],
    },
  ];

  console.log('');
  return inquirer.prompt(questions);
}

async function copyTemplate(projectName: string, language: string) {
  const currentDirectory = process.cwd();
  const templateDirectory = fs.realpathSync(resolve(__dirname, `../../templates/${language}`));

  const projectDirectory: string = await new Promise((resolve, reject) => {
    const projectDir = `${currentDirectory}/${projectName}`;
    // @ts-ignore
    mkdirp(projectDir, (err) => {
      if (err) {
        reject('Could not create directory: ' + projectDir);
      }

      resolve(projectDir);
    });
  });

  await new Promise((resolve, reject) => {
    ncp.ncp(templateDirectory, projectDirectory, (err) => {
      if (err) {
        reject('Could not copy template files');
      }

      resolve(null);
    });
  });

  return projectDirectory;
}

async function writeComponentName(projectDirectory: string, names: INames, language: string) {
  await changeNameInfile(`${projectDirectory}/public/index.html`, new RegExp(/%component-name-title%/g), names.title);
  await changeNameInfile(`${projectDirectory}/public/index.html`, new RegExp(/%component-name-snake%/g), names.snake);
  await changeNameInfile(`${projectDirectory}/package.json`, new RegExp(/%component-name-snake%/g), names.snake);
  await changeNameInfile(`${projectDirectory}/README.md`, new RegExp(/%component-name-title%/g), names.title);
  await changeNameInfile(`${projectDirectory}/README.md`, new RegExp(/%component-name-snake%/g), names.snake);

  if (language === 'js') {
    await changeNameInfile(`${projectDirectory}/src/index.js`, new RegExp(/%component-name-snake%/g), names.snake);
    await changeNameInfile(
      `${projectDirectory}/src/componentProperties.js`,
      new RegExp(/%component-name-title%/g),
      names.title,
    );
  }

  if (language === 'ts') {
    await changeNameInfile(`${projectDirectory}/src/index.tsx`, new RegExp(/%component-name-snake%/g), names.snake);
    await changeNameInfile(
      `${projectDirectory}/src/componentProperties.ts`,
      new RegExp(/%component-name-title%/g),
      names.title,
    );
  }  
}

async function writeProjectDescription(projectDirectory: string, description: string) {
  await changeNameInfile(`${projectDirectory}/README.md`, new RegExp(/%component-description%/g), description);
  await changeNameInfile(`${projectDirectory}/package.json`, new RegExp(/%component-description%/g), description);
}
