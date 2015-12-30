import {ParserRule} from "../ParserRule";

export default class NgPropertyRule implements ParserRule {
    processTemplate(template: string): string {
        return template.replace(/#textInput/g, "ng-property=\"textInput\"");
    }
}