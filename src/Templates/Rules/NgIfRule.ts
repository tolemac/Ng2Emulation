import {ParserRule} from "../ParserRule";
import {DEFAULT_CONTROLLER_AS} from "../../Core/Angular1Wrapper";

export default class NgIfRule extends  ParserRule 
{
	processAttribute(attr: Attr): { name: string; value: string } {
		const name = attr.name;
		const value = attr.value;

		if (name === "*ngif")
			return {
				name: "ng-if",
                value: `${DEFAULT_CONTROLLER_AS}.${value}`
			};
		return undefined;
	}

    //processTemplate(template: string): string {
    //    return template.replace(/*ngif/g, "ng-if");
    //}
}