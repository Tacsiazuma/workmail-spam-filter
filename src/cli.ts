#!/usr/bin/env node
import { Command } from 'commander'

const fs = require('fs')
const program = new Command()
program.name('workmail-spam-filter')
    .description('CLI for workmail spam filter')
    .version('0.1.6')

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
        if (!fs.existsSync('db')) {
            fs.mkdirSync('db');
        }
        fs.writeFileSync('db/config.json', JSON.stringify(initialConfig))
    })
program.parse()
