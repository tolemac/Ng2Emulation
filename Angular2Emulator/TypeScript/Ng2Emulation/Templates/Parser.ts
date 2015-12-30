import {ParserRule} from "./ParserRule";
import NgContentRule from "./rules/NgContentRule"
import NgPropertyRule from "./rules/NgPropertyRule"

export default class Parser {
    private static rules: ParserRule[] = [new NgContentRule(), new NgPropertyRule()];

    static addRule(rule: ParserRule) {
        this.rules.push(rule);
    }

    static processTemplate(template: string): string {
        this.rules.forEach(rule => template = rule.processTemplate(template));
        return template;
    }
}
