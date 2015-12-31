import {ParserRule} from "./ParserRule";
import NgContentRule from "./rules/NgContentRule"
import NgPropertyRule from "./rules/NgPropertyRule"
import EventBindingRule from "./rules/EventBindingRule"
import PropertyBindingRule from "./rules/PropertyBindingRule"
import TwoWayBindingRule from "./rules/TwoWayBindingRule"

export default class Parser {
    private static rules: ParserRule[] = [
		new NgContentRule(), new NgPropertyRule(),
		new TwoWayBindingRule(), new PropertyBindingRule(), new EventBindingRule()
	];

    static addRule(rule: ParserRule) {
        this.rules.push(rule);
    }

    static processTemplate(template: string): string {
        this.rules.forEach(rule => template = rule.processTemplate(template));
        return template;
    }
}
