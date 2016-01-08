import { ParserRule } from "../ParserRule";
export default class NgContentRule extends ParserRule {
    startTag(tagName: string, attributes: {
        [name: string]: {
            value: string;
            quoted: boolean;
        };
    }, unary: boolean): string;
    end(tagName: string): string;
    chars(text: string): string;
    comment(text: string): string;
}
