import {ParserRule} from "../ParserRule";

export default class NgContentRule extends  ParserRule 
{
	processAttribute(attr: Attr): { name: string; value: string } {
		const name = attr.name;
		const value = attr.value;

		if (name === "ngcontent" || name === "ng-content")
			return {
				name: "ng-transcude",
				value: value
			};
		return undefined;
	}

    //processTemplate(template: string): string {
    //    return template.replace(/ng-content/g, "ng-transclude");
    //}
}