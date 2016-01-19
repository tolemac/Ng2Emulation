import {ParserRule} from "../ParserRule";
import {DEFAULT_CONTROLLER_AS} from "../../Core/Angular1Wrapper";

export default class NgModelRule extends ParserRule 
{
	processAttribute(attr: Attr): { name: string; value: string } {
		const name = attr.name;
		const value = attr.value;

		if (name === "[(ngmodel)]")
			return {
				name: "ng-model",
                value: `${DEFAULT_CONTROLLER_AS }.${value}`
			};
		return undefined;
	}


	//processTemplate(template: string): string {
	//	let regex = /\[\(ngModel\)\]="([a-zA-Z0-9-$.]+)"/g;
	//	template = template.replace(regex, (text, match) => {
	//		return text.replace(match, `${DEFAULT_CONTROLLER_AS}.${match}`);
    //    });

    //    return template.replace(/\[\(ngModel\)\]/g, "ng-model");
    //}
} 