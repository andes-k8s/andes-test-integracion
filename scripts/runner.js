// runs Cypress end-to-end tests using Cypress Node module API
// https://on.cypress.io/module-api

/* eslint-disable no-console */

const cypress = require('cypress')
const globby = require('globby')
const fs = require('fs')

require('console.table')

const runOneSpec = (spec) => {
    console.log('runnign ' + spec);
    return cypress.run({
        config: {
            video: false,
            baseUrl: 'http://localhost'
        },
        env: {
            ENVIRONMENT: "develop",
            API_SERVER: "http://localhost",
            RETRIES: 0
        },
        spec: spec,
    }).catch((err) => {
        console.error(err);
        process.exit(1);
    })
}

globby('./cypress/integration/**/*.spec.js')
    .then(async (specs) => {
        console.log('Running spec', specs)
        const runsResults = [];
        for (const spec of specs) {
            const r = await runOneSpec(spec);
            runsResults.push(r);
        }
        return runsResults;
    })
    .then((runsResults) => {
        // information about each test run is available
        // see the full NPM API declaration in
        // https://github.com/cypress-io/cypress/tree/develop/cli/types

        // you can generate your own report,
        // email or post a Slack message
        // rerun the failing specs, etc.

        // for now show just the summary
        // by drilling down into specResults objects
        const summary = runsResults
            .map((oneRun) => oneRun.runs[0])
            .map((run) => {
                return {
                    spec: run.spec.name,
                    tests: run.stats.tests,
                    passes: run.stats.passes,
                    failures: run.stats.failures,
                }
            })

        console.table('Test run summary', summary)
    })