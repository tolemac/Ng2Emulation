import {ParserRule} from "../ParserRule";

export default class BindingRule implements ParserRule {
    processTemplate(template: string): string {

	    const replaceFn = (text, event, expression) => {
		    return ` ng-two-way-binding="${event}=>${expression}"`;
	    };

		// [(property)] syntax
		let regex = /<? \[\(([a-zA-Z0-9-]+)\)\]="([a-zA-Z0-9();='$ ]+)\"/g;

		template = template.replace(regex, replaceFn);

		// [(property)] syntax
		regex = /<? bindon-([a-zA-Z0-9-]+)="([a-zA-Z0-9();='$ ]+)\"/g;

		template = template.replace(regex, replaceFn);

	    return template;
    }
} 