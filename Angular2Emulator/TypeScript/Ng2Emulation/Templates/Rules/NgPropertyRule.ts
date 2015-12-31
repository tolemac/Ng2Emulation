import {ParserRule} from "../ParserRule";

export default class NgPropertyRule implements ParserRule {
    processTemplate(template: string): string {

		// # symbol to declare local variables
		let regex = /<? #([a-zA-Z0-9-]+).+?>/g;

        template = template.replace(regex, (text, match) => {
	         return text.replace("#" + match, `ng-property="${match}"`);
        });

		// Cannonical syntax "var-"
		regex = /<? var-([a-zA-Z0-9-]+).+?>/g;

        template = template.replace(regex, (text, match) => {
			return text.replace("var-" + match, `ng-property="${match}"`);
        });

	    return template;
    }
}