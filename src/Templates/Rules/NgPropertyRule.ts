import {ParserRule} from "../ParserRule";

export default class NgPropertyRule extends ParserRule 
{
	processAttribute(attr: Attr): { name: string; value: string } {
		const name = attr.name;
		let variable: string;

		// # symbol to declare local variables
		if (name[0] === "#")
			variable = name.substr(1, name.length);
		// Cannonical var- syntax
		if (name.length > 4 && name.substr(0, 4) === "var-")
			variable = name.substr(4);

		if (variable) {
			return {
				name: "ng-property",
				value: variable
			}
		}
		return undefined;
	}


    //processTemplate(template: string): string {

	//	// # symbol to declare local variables
	//	let regex = /<? #([a-zA-Z0-9-$]+).+?>/g;

    //    template = template.replace(regex, (text, match) => {
	//         return text.replace("#" + match, `ng-property="${match}"`);
    //    });

	//	// Cannonical syntax "var-"
	//	regex = /<? var-([a-zA-Z0-9-]+).+?>/g;

    //    template = template.replace(regex, (text, match) => {
	//		return text.replace("var-" + match, `ng-property="${match}"`);
    //    });

	//    return template;
    //}
}