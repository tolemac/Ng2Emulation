export interface ParserRule {
    processTemplate(template: string): string;
}