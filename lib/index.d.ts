
/**
 * @module watson-assistant-test
 */

import AssistantV1 from "ibm-watson/assistant/v1";
import AssistantV2 from "ibm-watson/assistant/v2";
import TestSuite from "iteration-test";

 declare class AssistantTestSuite extends TestSuite {
    constructor(options: AssistantTestSuiteOptions)
    assistantAPI: AssistantV1 | AssistantV2
}

interface AssistantTestSuiteOptions {
    url: string
    version: string
    apikey: string
    workspaceId?: string
    assistantId?: string
    
    tests: Test[]
}

interface Test {
    name: string
    rounds: Round[]
}

interface Round {
    inputExpression: string
    evaluateExpression: string
}

export = AssistantTestSuite