const TestSuite = require('iteration-test')
const { IamAuthenticator } = require('ibm-watson/auth')
const AssistantV1 = require('ibm-watson/assistant/v1')
const AssistantV2 = require('ibm-watson/assistant/v2')

module.exports = class AssistantTestSuite {
    constructor(options) {

        let assistantOptions = {
            url: options.url,
            version: options.version,
            authenticator: new IamAuthenticator({ apikey: options.apikey })
        }

        let messageFunction
        if (options.assistantId) {
            this.assistantAPI = new AssistantV2(assistantOptions)
            messageFunction = payload => this.assistantAPI.messageStateless({ assistantId: options.assistantId, ...payload }).then(data => data.result)
        } else {
            this.assistantAPI = new AssistantV1(assistantOptions)
            messageFunction = payload => this.assistantAPI.message({ workspaceId: options.workspaceId, ...payload }).then(data => data.result)
        }

        this.testSuite = new TestSuite({ testFunction: messageFunction, tests: options.tests })
    }

    run() {
        return this.testSuite.run()
    }

}