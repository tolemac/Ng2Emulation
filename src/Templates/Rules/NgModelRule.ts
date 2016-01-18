import {ParserRule} from "../ParserRule";

export default class NgModelRule extends ParserRule 
{
	processAttribute(attr: Attr): { name: string; value: string } {
		const name = attr.name;
		const value = attr.value;

		if (name === "[(ngmodel)]")
			return {
				name: "ng-model",
				value: `$$cmp.${value}`
			};
		return undefined;
	}


	//processTemplate(template: string): string {
	//	let regex = /\[\(ngModel\)\]="([a-zA-Z0-9-$.]+)"/g;
	//	template = template.replace(regex, (text, match) => {
	//		return text.replace(match, `$$$$cmp.${match}`);
    //    });

    //    return template.replace(/\[\(ngModel\)\]/g, "ng-model");
    //}
} 