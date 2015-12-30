import {ParserRule} from "../ParserRule";

export default class NgContentRule implements ParserRule {
    processTemplate(template: string): string {
        return template.replace(/ng-content/g, "ng-transclude");
    }
}