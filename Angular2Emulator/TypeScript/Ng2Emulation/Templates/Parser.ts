import {ParserRule} from "./ParserRule";
import NgContentRule from "./rules/NgContentRule";
import NgModelRule from "./rules/NgModelRule";
import NgPropertyRule from "./rules/NgPropertyRule";
import EventBindingRule from "./rules/EventBindingRule";
import PropertyBindingRule from "./rules/PropertyBindingRule";
import TwoWayBindingRule from "./rules/TwoWayBindingRule";
import NgForRule from "./rules/NgForRule";
import NgIfRule from "./rules/NgIfRule";

export default class Parser {
    private static rules: ParserRule[] = [
		new NgModelRule(), new NgContentRule(), new NgPropertyRule(),
		new TwoWayBindingRule(), new PropertyBindingRule(), new EventBindingRule(),
		new NgForRule(), new NgIfRule()
	];

    static addRule(rule: ParserRule) {
        this.rules.push(rule);
    }

    static processTemplate(template: string): string {
        this.rules.forEach((rule:any) => template = rule.processTemplate(template));
        return template;
    }
}
