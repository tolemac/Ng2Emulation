import {ParserRule} from "../ParserRule";

export default class NgSubmitRule extends ParserRule {
	//processAttribute(attr: Attr): { name: string; value: string } {
	//	const name = attr.name;
	//	const value = attr.value;

	//	if (name === "[(ngmodel)]")
	//		return {
	//			name: "ng-model",
	//			value: `${DEFAULT_CONTROLLER_AS}.${value}`
	//		};
	//	return undefined;
	//}


	//processTemplate(template: string): string {
	//	let regex = /\[\(ngModel\)\]="([a-zA-Z0-9-$.]+)"/g;
	//	template = template.replace(regex, (text, match) => {
	//		return text.replace(match, `${DEFAULT_CONTROLLER_AS}.${match}`);
    //    });

    //    return template.replace(/\[\(ngModel\)\]/g, "ng-model");
    //}

    startTag(tagName: string, attributes: { [name: string]: { value: string; quoted: boolean; } }, unary: boolean): string {
        if (attributes.hasOwnProperty("(ngSubmit)")) {
            attributes["ng-submit"] = angular.extend({}, attributes["(ngSubmit)"]);
            delete attributes["(ngSubmit)"];
        }
        return tagName;
    }

    end(tagName: string): string {
        return tagName;
    }

    chars(text: string): string {
        return text;
    }

    comment(text: string): string {
        return text;
    }
} 