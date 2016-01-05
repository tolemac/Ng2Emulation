export abstract class ParserRule {
    abstract startTag(tagName: string, attributes: { [name: string]: string }, unary: boolean): string;

    abstract end(tagName: string): string;

    abstract chars(text: string): string;

    abstract comment(text: string): string;
}