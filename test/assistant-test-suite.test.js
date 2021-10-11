const AssistantTestSuite = require('../lib')


let passingTestOptions = {
    url: 'foo_url',
    apikey: 'foo_apikey',
    workspaceId: 'foo_workspace_id',
    version: 'foo_version',
    tests: [
        {
            name: 'foo_passing_test_1',
            rounds: [
                { inputExpression: '{ input: { text: "hello" } }', evaluateExpression: 'output.text[0] == \'Response to input {"text":"hello"} with context undefined\'' },
                { inputExpression: '{ input: { text: "hello again" }, context: context }', evaluateExpression: 'output.text[0] == \'Response to input {"text":"hello again"} with context {"conversation_id":"foo_conversation_id"}\'' },
            ]
        },
        {
            name: 'foo_passing_test_2',
            rounds: [
                { inputExpression: '{ input: { text: "goodbye" } }', evaluateExpression: 'output.text[0] == \'Response to input {"text":"goodbye"} with context undefined\'' },
                { inputExpression: '{ input: { text: "goodbye again" }, context: context }', evaluateExpression: 'output.text[0] == \'Response to input {"text":"goodbye again"} with context {"conversation_id":"foo_conversation_id"}\'' },
            ]
        }
    ]
}

let failingTestOptions = {
    url: 'foo_url',
    apikey: 'foo_apikey',
    version: 'foo_version',
    assistantId: 'foo_assistant_id',
    tests: [
        {
            name: 'foo_passing_test',
            rounds: [
                { inputExpression: '{ input: { text: "hello" } }', evaluateExpression: 'output.text[0] == \'Response to input {"text":"hello"} with context undefined\'' },
                { inputExpression: '{ input: { text: "hello again" }, context: context }', evaluateExpression: 'output.text[0] == \'Response to input {"text":"hello again"} with context {"conversation_id":"foo_conversation_id"}\'' },
            ]
        },
        {
            name: 'foo_failing_test',
            rounds: [
                { inputExpression: '{ input: { text: "hello" } }', evaluateExpression: 'output.text[0] == \'Response to input {"text":"hello"} with context undefined\'' },
                { inputExpression: '{ input: { text: "goodbye" } }', evaluateExpression: 'output.text == "Something incorrect"' },
            ]
        },
        {
            name: 'foo_broken_test_input',
            rounds: [
                { inputExpression: 'invalidSyntax', evaluateExpression: 'output.text[0] == \'Response to input {"text":"hello"} with context undefined\'' },
            ]
        },
        {
            name: 'foo_broken_test_output',
            rounds: [
                { inputExpression: '{ input: { text: "hello" } }', evaluateExpression: 'invalidSyntax' },
            ]
        }
    ]
}

let assistantV1Mock = {
    message: (options) => Promise.resolve({
        result: {
            context: { conversation_id: 'foo_conversation_id' },
            output: { text: [`Response to input ${JSON.stringify(options.input)} with context ${JSON.stringify(options.context)}`] }
        }
    })
}
let assistantV2Mock = {
    messageStateless: (options) => Promise.resolve({
        result: {
            context: { conversation_id: 'foo_conversation_id' },
            output: { text: [`Response to input ${JSON.stringify(options.input)} with context ${JSON.stringify(options.context)}`] }
        }
    })
}

describe('Assistant', () => {
    describe('#run', () => {
        it('Generates success report when it succeeds', (done) => {
            let testSuite = new AssistantTestSuite(passingTestOptions)
            testSuite.assistantAPI = assistantV1Mock
            testSuite.run()
                .then(results => {
                    expect(results).toEqual({ 'details': [{ 'name': 'foo_passing_test_1', 'success': true }, { 'name': 'foo_passing_test_2', 'success': true }], 'failed': 0, 'passed': 2, 'success': true })
                    done()
                })
                .catch(err => done.fail(err))
        })
        it('Generates failure report when it fails', (done) => {
            let testSuite = new AssistantTestSuite(failingTestOptions)
            testSuite.assistantAPI = assistantV2Mock
            testSuite.run()
                .then(results => {
                    expect(results).toEqual({ 'details': [{ 'name': 'foo_passing_test', 'success': true }, { 'error': 'Expression [output.text == "Something incorrect"] is false for obtained output', 'name': 'foo_failing_test', 'success': false , index: 1}, { 'error': 'invalidSyntax is not defined', 'name': 'foo_broken_test_input', 'success': false, index: 0 }, { 'error': 'invalidSyntax is not defined', 'name': 'foo_broken_test_output', 'success': false, index: 0 }], 'failed': 3, 'passed': 1, 'success': false })
                    done()
                })
                .catch(err => done.fail(err))
        })
    })

})