export declare abstract class ParserRule {
    abstract startTag(tagName: string, attributes: {
        [name: string]: {
            value: string;
            quoted: boolean;
        };
    }, selfClosing: boolean): string;
    abstract end(tagName: string): string;
    abstract chars(text: string): string;
    abstract comment(text: string): string;
}
