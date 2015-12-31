import {ParserRule} from "../ParserRule";

export default class BindingRule implements ParserRule {
    processTemplate(template: string): string {

		const replaceFn = (text, event, expression) => {
			return ` ng-property-binding="${event}=>${expression}"`;
		};

		// [property] syntax
		let regex = /<? \[([a-zA-Z0-9-]+)\]="([a-zA-Z0-9();='$ ]+)\"/g;

	    template = template.replace(regex, replaceFn);

		// Cannonical bind-property syntax
		regex = /<? bind-([a-zA-Z0-9-]+)="([a-zA-Z0-9();='$ ]+)\"/g;

		template = template.replace(regex, replaceFn);
	    return template;
    }
} 