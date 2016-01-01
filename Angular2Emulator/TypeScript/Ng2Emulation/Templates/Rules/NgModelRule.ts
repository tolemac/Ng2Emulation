import {ParserRule} from "../ParserRule";

export default class NgModelRule implements ParserRule {
    processTemplate(template: string): string {
		let regex = /\[\(ngModel\)\]="([a-zA-Z0-9-$.]+)"/g;
		template = template.replace(regex, (text, match) => {
			return text.replace(match, `$$$$cmp.${match}`);
        });

        return template.replace(/\[\(ngModel\)\]/g, "ng-model");
    }
} 