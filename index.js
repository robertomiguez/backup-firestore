'use strict';
const inquirer = require('inquirer'),
  initFirebase = require('./config/firebase'),
  { writeFile, getNameCollections } = require('./src/backup-firestore'),
  { readFile, getFiles } = require ('./src/restore-firestore')

const optionsPrompt = {
  type: 'list',
  name: 'option',
  message: 'Which option would you like to choose?',
  choices: [
      'Backup (export one collection to JSON file)', 
      'Restore (import one JSON file to collection)',
      'Exit'
  ]
}

const backupQuestion = {
  type: 'list',
  name: 'option',
  message: 'Which collection would you like to export?'
}


const restoreQuestion = {
  type: 'list',
  name: 'option',
  message: 'Which file would you like to import?'
}

const confirmQuestion = {
  type: 'list',
  name: 'option',
  message: 'Your collection will be replaced, are you sure?',
  choices: ['Yes','No']
}

const exitQuestion = {
  type: 'list',
  name: 'option',
  message: 'would you like to do another operation?',
  choices: ['Yes','No']
}

const main = async () => {
  const db = await initFirebase()
  const answers = await inquirer.prompt(optionsPrompt)
  // console.group(answers)
  switch (answers.option.slice(0,2)) {
      case 'Ba' :
          await backup(db) 
          break
      case 'Re' :
          await restore(db)
          break
      case 'Ex' : 
          process.exit() // node repl exit
  }
  exit()
      
}

const backup = async (db) => {
  backupQuestion.choices = await getNameCollections(db)
  const answers = await inquirer.prompt(backupQuestion)
  await writeFile(db,answers.option)
}

const restore = async (db) => {
  restoreQuestion.choices = await getFiles()
  const answers = await inquirer.prompt(restoreQuestion)
  if (await confirmRestore(answers.option.slice(0,-10))) await readFile(db,answers.option)
}

const confirmRestore = async (collection) => {
  confirmQuestion.message = `Your collection ${collection} will be replaced, are you sure?`
  const answers = await inquirer.prompt(confirmQuestion)
  return  (answers.option === 'Yes') 
}

const exit = async () => {
  const answers = await inquirer.prompt(exitQuestion)
  if (answers.option === 'Yes') main()
  else process.exit() // node repl exit
}


main();