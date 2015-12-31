import {ParserRule} from "../ParserRule";

export default class NgPropertyRule implements ParserRule {
    processTemplate(template: string): string {

		const regex = /<? #([a-zA-Z0-9-]+).+?>/g;

        return template.replace(regex, (text, match) => {
	         return text.replace("#" + match, `ng-property="${match}"`);
        });
    }
}