import {ParserRule} from "../ParserRule";

export default class BindingRule extends  ParserRule 
{
	//processAttribute(attr: Attr): { name: string; value: string } {
	//	const name = attr.name;
	//	const value = attr.value;
	//	let property: string;

	//	// (property) syntax
	//	if (name[0] === "[" && name[name.length - 1] === "]")
	//		property = name.substr(1, name.length - 2);
	//	// Cannonical bind-property syntax
	//	if (name.length > 5 && name.substr(0, 5) === "bind-")
	//		property = name.substr(5);

	//	if (property) {
	//		return {
	//			name: "ng-property-binding",
	//			value: `${property}=>${value}`
	//		}
	//	}
	//	return undefined;
	//}
	
    //processTemplate(template: string): string {

	//	const replaceFn = (text, event, expression) => {
	//		return ` ng-property-binding="${event}=>${expression}"`;
	//	};

	//	// [property] syntax
	//	let regex = /<? \[([a-zA-Z0-9-]+)\]="([a-zA-Z0-9();='$ ]+)\"/g;

	//    template = template.replace(regex, replaceFn);

	//	// Cannonical bind-property syntax
	//	regex = /<? bind-([a-zA-Z0-9-]+)="([a-zA-Z0-9();='$ ]+)\"/g;

	//	template = template.replace(regex, replaceFn);
	//    return template;
    //}

    startTag(tagName: string, attributes: { [name: string]: { value: string; quoted: boolean; } }, unary: boolean): string {
        const removeAttrs: string[] = [];
        for (let name in attributes) {
            if (attributes.hasOwnProperty(name)) {
                const value = attributes[name].value;
                let property: string;

                // (property) syntax
                if (name[0] === "[" && name[name.length - 1] === "]")
                    property = name.substr(1, name.length - 2);
                // Cannonical bind-property syntax
                if (name.length > 5 && name.substr(0, 5) === "bind-")
                    property = name.substr(5);

                if (property) {
                    removeAttrs.push(name);
                    attributes["ng-property-binding"] = attributes["ng-property-binding"] || { value: "", quoted: true };
                    if (attributes["ng-property-binding"].value)
                        attributes["ng-property-binding"].value += "[&&]";
                    attributes["ng-property-binding"].value += `${property}=>${value}`;
                }
            }
        }
        removeAttrs.forEach((attrName: any) => { delete attributes[attrName]; });
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