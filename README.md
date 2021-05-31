<h1 align="center">watson-assistant-test</h1>
<p>
  <a href="https://www.npmjs.com/package/watson-assistant-test" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/watson-assistant-test.svg">
  </a>
  <a href="#" target="_blank">
    <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" />
  </a>
  <a href='https://coveralls.io/github/MarcoABCardoso/watson-assistant-test?branch=master'>
    <img src='https://coveralls.io/repos/github/MarcoABCardoso/watson-assistant-test/badge.svg?branch=master' alt='Coverage Status' />
  </a>
  <a href="#" target="_blank">
    <img alt="Node.js CI" src="https://github.com/MarcoABCardoso/watson-assistant-test/workflows/Node.js%20CI/badge.svg" />
  </a>
</p>

> Runs automated testing on Watson Assistant Skill.

## Install

```sh
npm install -g watson-assistant-test
```

## Usage

```js
const AssistantTestSuite = require('watson-assistant-test')

let testSuite = new AssistantTestSuite({
    url: 'YOUR_ASSISTANT_URL',
    workspaceId: 'YOUR_ASSISTANT_WORKSPACE_ID', // Alternatively, provide the assistantId field to use the v2 API
    apikey: 'YOUR_ASSISTANT_API_KEY',
    version: '2021-01-01',
    tests: [
        {
            name: 'Greet and say goodbye',
            rounds: [
                { inputExpression: '{ input: { text: "Hello" } }', evaluateExpression: 'output.text[0] == "Hi! How can I help you?"' },
                { inputExpression: '{ input: { text: "Goodbye" }, context: context }', evaluateExpression: 'output.text[0] == "Bye bye!"' },
            ]
        },
        {
            name: 'Book a visit',
            rounds: [
                { inputExpression: '{ input: { text: "Hello" } }', evaluateExpression: 'output.text[0] == "Hi! How can I help you?"' },
                { inputExpression: '{ input: { text: "Book a visit" }, context: context }', evaluateExpression: 'output.text[0] == "When do you want to pay us a visit?"' },
                { inputExpression: '{ input: { text: "Tomorrow" }, context: context }', evaluateExpression: 'output.text[0] == "All done!"' },
            ]
        },
    ]
})

let results = await testSuite.run()
```

## Sample results

```json
{
  "success": false,
  "passed": 1,
  "failed": 1,
  "details": [
    {
      "name": "Greet and say goodbye",
      "success": true,
    }, 
    {
      "name": "Book a visit",
      "success": false,
      "error": "Expression [output.text[0] == \"All done!\"] is false for obtained output { \"output\":{...}, context: {...} }"
    }
  ]
}

## Run tests

```sh
npm run test
```

## Author

👤 **Marco Cardoso**

* Github: [@MarcoABCardoso](https://github.com/MarcoABCardoso)
* LinkedIn: [@marco-cardoso](https://linkedin.com/in/marco-cardoso)

## Show your support

Give a ⭐️ if this project helped you!