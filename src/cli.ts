import { Command } from 'commander'
import pkg from '../package.json'

const fs = require('fs')
const program = new Command()
program.name('workmail-spam-filter')
    .description('CLI for workmail spam filter')
    .version(pkg.version)

const initialConfig = {
    "categories": {
    },
    "docCount": {
    },
    "totalDocuments": 0,
    "vocabulary": {},
    "vocabularySize": 0,
    "wordCount": {},
    "wordFrequencyCount": {},
    "options": {}
}

program.command('init')
    .description('Create an initial classifier configuration')
    .action(() => {
        fs.writeFileSync('db/config.json', JSON.stringify(initialConfig))
    })
program.parse()
