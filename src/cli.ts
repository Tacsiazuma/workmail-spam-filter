#!/usr/bin/env node
import { Command } from 'commander'
import Classifier from './function/classifier'

const fs = require('fs')
const path = require('node:path')
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

program.command('train')
    .description('Train the classifier')
    .option('-s --spam [spam]', 'JSON file containing spam words', 'spam.json')
    .option('-v --valid [valid]', 'JSON file containing valid words', 'valid.json')
    .option('-c --config [config]', 'Initial config file to extend', 'config.json')
    .action(async (options) => {
        if (!fs.existsSync(options.spam)) {
            return console.error('The spam word file does not exists')
        }
        if (!fs.existsSync(options.valid)) {
            return console.error('The valid word file does not exists')
        }
        if (!fs.existsSync(options.config)) {
            return console.error('The config JSON does not exists')
        }
        const classifier = new Classifier(fs.readFileSync(options.config))
        console.log("Training spam words")
        await classifier.train(JSON.parse(fs.readFileSync(options.spam)), true)
        console.log("Training valid words")
        await classifier.train(JSON.parse(fs.readFileSync(options.valid)), false)
        fs.writeFileSync(options.config, classifier.export())
        console.log("Training is complete. Writen configuration to " + options.config)
    })

program.parse()
