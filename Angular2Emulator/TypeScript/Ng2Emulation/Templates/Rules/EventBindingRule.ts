import {ParserRule} from "../ParserRule";

export default class BindingRule implements ParserRule {
    processTemplate(template: string): string {

	    const replaceFn = (text, event, expression) => {
		    return ` ng-event-binding="${event}=>${expression}"`;
	    };

		// (event) syntax
		let regex = /<? \(([a-zA-Z0-9-]+)\)="([a-zA-Z0-9();='$ ]+)\"/g;

		template = template.replace(regex, replaceFn);

		// Cannonical on-event syntax
		regex = /<? on-([a-zA-Z0-9-]+)="([a-zA-Z0-9();='$ ]+)\"/g;

		template = template.replace(regex, replaceFn);

	    return template;
    }
} 