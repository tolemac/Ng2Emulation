import {ParserRule} from "../ParserRule";

export default class NgModelRule extends ParserRule {
	//processAttribute(attr: Attr): { name: string; value: string } {
	//	const name = attr.name;
	//	const value = attr.value;

	//	if (name === "*ngfor") {
	//		const regex = /#([a-zA-Z0-9-]+) of ([a-zA-Z0-9.]+)(?:,(.*)?)?/;
	//		let [dummy, variable, list, more] = regex.exec(value);

	//		if (more) {
	//			let ngInit = "";
	//			const assigments = more.split(",");
	//			const regex = /#([a-zA-Z0-9-]+)\s?=\s?(.*)/;
	//			for (let i = 0; i < assigments.length; i++) {
	//				const m = regex.exec(assigments[i]);
	//				if (m != null && m[1]) {
	//					m[2] = m[2].replace("index", "$index");
	//					if (m[2] === "index")
	//						m[2] = "$index";
	//					ngInit += `${m[1]}=${m[2]};`;
	//				}
	//			}
	//			if (ngInit !== "")
	//				angular.element(attr.ownerElement).attr("ng-init", ngInit);
	//		}

	//		return {
	//			name: "ng-repeat",
	//			value: `${variable} in $$cmp.${list}`
	//		};
			
	//	}
	//	return undefined;
 //   }

    startTag(tagName: string, attributes: { [name: string]: { value: string; quoted: boolean; } }, unary: boolean): string {
        if (attributes.hasOwnProperty("*ngFor")) {
            const value = attributes["*ngFor"].value;
            const regex = /#([a-zA-Z0-9-]+) of ([a-zA-Z0-9.]+)(?:,(.*)?)?/;
            const [, variable, list, more] = regex.exec(value);

            if (more) {
                let ngInit = "";
                const assigments = more.split(",");
                const regex2 = /#([a-zA-Z0-9-]+)\s?=\s?(.*)/;
                for (let i = 0; i < assigments.length; i++) {
                    const m = regex2.exec(assigments[i]);
                    if (m != null && m[1]) {
                        m[2] = m[2].replace("index", "$index");
                        if (m[2] === "index")
                            m[2] = "$index";
                        ngInit += `${m[1]}=${m[2]};`;
                    }
                }
                if (ngInit !== "") {
                    attributes["ng-init"] = attributes["ng-init"] || {value:"", quoted: true};
                    attributes["ng-init"].value = ngInit + attributes["ng-init"].value;
                }
            }

            attributes["ng-repeat"] = { value: `${variable} in $$cmp.${list}`, quoted: true };
            delete attributes["*ngFor"];
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