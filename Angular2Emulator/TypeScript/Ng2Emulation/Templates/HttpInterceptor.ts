import TemplateParser from "./HtmlParser/Parser";

function parseInterceptor() {
    "use strict";
    return {
        response(response:any) {
            response.data = TemplateParser.processTemplate(response.data);
            return response;
        }
    };
}

export default function httpInterceptor(app: ng.IModule) {
    "use strict";
    app.factory("ng2eTemplateParser", parseInterceptor);
    app.config(["$httpProvider", ($httpProvider : any) => {
        $httpProvider.interceptors.push("ng2eTemplateParser");
    }]);
}