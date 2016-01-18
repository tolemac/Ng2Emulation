import {ParserRule} from "../ParserRule";

export default class BindingRule extends ParserRule {
	processAttribute(attr: Attr): { name: string; value: string } {
		const name = attr.name;
		const value = attr.value;
		let event: string;

		// (event) syntax
		if (name[0] === "(" && name[name.length - 1] === ")")
			event = name.substr(1, name.length - 2);
		// Cannonical on-event syntax
		if (name.length > 3 && name.substr(0, 3) === "on-")
			event = name.substr(3);

		if (event) {
			return {
				name: "ng-event-binding",
				value: `${event}=>${value}`
			}
		}
		return undefined;
	}

	/*
    processElement(template: string): string {

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
    }	 */
} 