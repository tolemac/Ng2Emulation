declare function HTMLParser(html: string, handlerss : {
    start?: (
        tagName: string,
        attributes: { name?: string; value?: string, scaped?:string }[],
        unary: boolean
    ) => void;
    end?: (tagName: string) => void;
    chars?: (text: string) => void;
    comment?: (text: string) => void;
});