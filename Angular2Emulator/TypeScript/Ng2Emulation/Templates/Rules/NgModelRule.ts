import {ParserRule} from "../ParserRule";

export default class NgModelRule implements ParserRule {
    processTemplate(template: string): string {
        return template.replace(/[(ng-model)]/g, "ng-model");
    }
} 