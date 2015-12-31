import {ParserRule} from "../ParserRule";

export default class BindingRule implements ParserRule {
    processTemplate(template: string): string {
		const regex = /<? \[\(([a-zA-Z0-9-]+)\)\]="([a-zA-Z0-9();=' ]+)\"/g;
	    return template.replace(regex, (text, event, expression) => {
			return ` ng-two-way-binding="${event}=>${expression}`;
		});
    }
} 