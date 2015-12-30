import {ParserRule} from "../ParserRule";

export default class NgPropertyRule implements ParserRule {
    processTemplate(template: string): string {
		
        return template.replace(/<? #([a-zA-Z0-9-]+).+?>/g, (text, match) => {
	         return text.replace("#" + match, `ng-property="${match}"`);
        });
    }
}