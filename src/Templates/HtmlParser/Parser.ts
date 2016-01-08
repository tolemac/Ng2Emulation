import {ParserRule} from "./ParserRule";
import NgContentRule from "./rules/NgContentRule";
import NgModelRule from "./rules/NgModelRule";
import NgPropertyRule from "./rules/NgPropertyRule";
import EventBindingRule from "./rules/EventBindingRule";
import PropertyBindingRule from "./rules/PropertyBindingRule";
import TwoWayBindingRule from "./rules/TwoWayBindingRule";
import NgForRule from "./rules/NgForRule";
import NgIfRule from "./rules/NgIfRule";
import {tokenize} from "HTML5Tokenizer";

export default class Parser {
    private static rules: ParserRule[] = [
         new NgModelRule(), new NgContentRule(), new NgPropertyRule(),
         new TwoWayBindingRule(), new PropertyBindingRule(), new EventBindingRule(),
         new NgForRule(), new NgIfRule()
    ];

    static processTemplate(template: string): string {
        const tokens = tokenize(template);
        let results = "";

        for (let i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            var result : string;
            if (token.type === "StartTag") {
                var attributes = token.attributes;
                var tagName = token.tagName;
                var selfClosing = token.selfClosing;

                var attrs: { [name: string]: { value: string; quoted: boolean; } } = {};
                for (let i = 0; i < attributes.length; i++) {
                    let [attrName, attrValue, attrQuoted] = attributes[i];
                    attrs[attrName] = { value: attrValue, quoted: attrQuoted };
                }
                this.rules.forEach((rule: ParserRule) => tagName = rule.startTag(tagName, attrs, selfClosing));

                results += `<${tagName}`;
                for (let name in attrs) {
                    if (attrs.hasOwnProperty(name)) {
                        results += attrs[name].quoted ? ` ${name}="${attrs[name].value}"` : ` ${name}=${attrs[name].value}`;
                    }
                }
                results += selfClosing ? "/>" : ">";
            } else if (token.type === "EndTag") {
                result = token.tagName;
                this.rules.forEach((rule: ParserRule) => result = rule.end(result));
                results += `</${result}>`;
            } else if (token.type === "Chars") {
                result = token.chars;
                this.rules.forEach((rule: ParserRule) => result = rule.chars(result));
                results += result;
            } else if (token.type === "Comment") {
                result = token.chars;
                this.rules.forEach((rule: ParserRule) => result = rule.chars(result));
                results += result;
            } else {
                results += token.chars;
            }
        }

        //HTMLParser(template, {
        //    start: (
        //        tagName: string,
        //        attributes: { name?: string; value?: string, escaped?: string }[],
        //        unary: boolean
        //    ) => {
        //        const attrs: { [name: string]: string } = {};
        //        for (let i = 0; i < attributes.length; i++) {
        //            attrs[attributes[i].name] = attributes[i].value;
        //        }
        //        this.rules.forEach((rule: ParserRule) => tagName = rule.startTag(tagName, attrs, unary));

        //        results += `<${tagName}`;
        //        for (let name in attrs) {
        //            if (attrs.hasOwnProperty(name)) {
        //                results += ` ${name}="${attrs[name]}"`;
        //            }
        //        }
        //        results += ">";
        //    },
        //    end: (tagName: string) => {
        //        let result = tagName;
        //        this.rules.forEach((rule: ParserRule) => result = rule.end(result));
        //        results += `</${result}>`;
        //    },
        //    chars: (text: string) => {
        //        let result = text;
        //        this.rules.forEach((rule: ParserRule) => result = rule.chars(result));
        //        results += result;
        //    },
        //    comment: (text: string) => {
        //        let result = text;
        //        this.rules.forEach((rule: ParserRule) => result = rule.chars(result));
        //        results += result;
        //    }
        //});
        
        return results;
    }
}

