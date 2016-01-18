import {ParserRule} from "../ParserRule";

export default class NgIfRule extends  ParserRule 
{
	processAttribute(attr: Attr): { name: string; value: string } {
		const name = attr.name;
		const value = attr.value;

		if (name === "*ngif")
			return {
				name: "ng-if",
				value: `$$cmp.${value}`
			};
		return undefined;
	}

    //processTemplate(template: string): string {
    //    return template.replace(/*ngif/g, "ng-if");
    //}
}