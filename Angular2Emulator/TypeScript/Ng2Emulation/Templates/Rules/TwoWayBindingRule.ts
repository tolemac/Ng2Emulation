import {ParserRule} from "../ParserRule";

export default class BindingRule extends  ParserRule 
{
	processAttribute(attr: Attr): { name: string; value: string } {
		const name = attr.name;
		const value = attr.value;
		let property: string;

		// [(property)] syntax
		if (name.length > 4 && name.substr(0, 2) === "[(" && name.substr(name.length - 2, 2) === ")]")
			property = name.substr(2, name.length - 4);
		// Cannonical bindon-property syntax
		if (name.length > 7 && name.substr(0, 7) === "bindon-")
			property = name.substr(7);

		if (property) {
			return {
				name: "ng-two-way-binding",
				value: `${property}=>${value}`
			}
		}
		return undefined;
	}
	
    //processTemplate(template: string): string {

	//    const replaceFn = (text, event, expression) => {
	//	    return ` ng-two-way-binding="${event}=>${expression}"`;
	//    };

	//	// [(property)] syntax
	//	let regex = /<? \[\(([a-zA-Z0-9-]+)\)\]="([a-zA-Z0-9();='$ ]+)\"/g;

	//	template = template.replace(regex, replaceFn);

	//	// [(property)] syntax
	//	regex = /<? bindon-([a-zA-Z0-9-]+)="([a-zA-Z0-9();='$ ]+)\"/g;

	//	template = template.replace(regex, replaceFn);

	//    return template;
    //}
} 