import {DEFAULT_CONTROLLER_AS} from "../../Core/Angular1Wrapper";
import {ParserRule} from "../ParserRule";

export default class NgModelRule extends ParserRule {
	processAttribute(attr: Attr): { name: string; value: string } {
		const name = attr.name;
		const value = attr.value;

		if (name === "*ngfor") {
			const regex = /#([a-zA-Z0-9-]+) of ([a-zA-Z0-9.]+)(?:,(.*)?)?/;
			let [dummy, variable, list, more] = regex.exec(value);

			if (more) {
				let ngInit = "";
				const assigments = more.split(",");
				const regex = /#([a-zA-Z0-9-]+)\s?=\s?(.*)/;
				for (let i = 0; i < assigments.length; i++) {
					const m = regex.exec(assigments[i]);
					if (m != null && m[1]) {
						m[2] = m[2].replace("index", "$index");
						if (m[2] === "index")
							m[2] = "$index";
						ngInit += `${m[1]}=${m[2]};`;
					}
				}
				if (ngInit !== "")
					angular.element(attr.ownerElement).attr("ng-init", ngInit);
			}

			return {
				name: "ng-repeat",
                value: `${variable} in ${DEFAULT_CONTROLLER_AS}.${list}`
			};
			
		}
		return undefined;
	}
} 