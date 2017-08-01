export default class Inspector {
    constructor(ruleSet) {
        if (typeof ruleSet !== 'object') {
            throw new Error('ruleSet must be object!');
        }
        this.ruleSet = ruleSet;
        this.result = {};
    }

    validate(target, callback) {
        Object.keys(this.ruleSet).forEach(prop => {
            if (this.ruleSet[prop].validator) {
                const isValid = this.ruleSet[prop].validator(target[prop]);
                if (!isValid) {
                    this.result[prop] = this.ruleSet[prop].message || 'Wrong!';
                }
            }
        });
        if (callback) {
            callback(this.result);
        }
        return this.result;
    }

    addRule(newRuleSet) {
        this.ruleSet = {
            ...this.ruleSet,
            ...newRuleSet,
        };
    }

    deleteRule(ruleName) {
        delete this.ruleSet[ruleName];
    }
}
