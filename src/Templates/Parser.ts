import {ParserRule} from "./ParserRule";
import NgContentRule from "./Rules/NgContentRule";
import NgModelRule from "./Rules/NgModelRule";
import NgPropertyRule from "./Rules/NgPropertyRule";
import EventBindingRule from "./Rules/EventBindingRule";
import PropertyBindingRule from "./Rules/PropertyBindingRule";
import TwoWayBindingRule from "./Rules/TwoWayBindingRule";
import NgForRule from "./Rules/NgForRule";
import NgIfRule from "./Rules/NgIfRule";
import HtmlParser from "./HtmlParser/Parser"

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
        //let test = HtmlParser.processTemplate(template);
        this.rules.forEach((rule:any) => template = rule.processTemplate(template));
        return template;
    }
}
