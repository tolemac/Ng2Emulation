import {ParserRule} from "../ParserRule";

export default class NgIfRule extends  ParserRule 
{
	//processAttribute(attr: Attr): { name: string; value: string } {
	//	const name = attr.name;
	//	const value = attr.value;

	//	if (name === "*ngif")
	//		return {
	//			name: "ng-if",
	//			value: `${DEFAULT_CONTROLLER_AS}.${value}`
	//		};
	//	return undefined;
	//}

    //processTemplate(template: string): string {
    //    return template.replace(/*ngif/g, "ng-if");
    //}

    startTag(tagName: string, attributes: { [name: string]: { value: string; quoted: boolean; } }, unary: boolean): string {
        if (attributes.hasOwnProperty("*ngIf")) {
            attributes["ng-if"] = angular.extend({}, attributes["*ngIf"]);
            delete attributes["*ngIf"];
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