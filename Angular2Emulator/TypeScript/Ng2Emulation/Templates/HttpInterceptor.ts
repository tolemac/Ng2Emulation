import TemplateParser from "./Parser";

function parseInterceptor() {
    return {
        response: function (response) {
            response.data = TemplateParser.processTemplate(response.data);
            return response;
        }
    };
}

export default function (app: ng.IModule) {
    app.factory("ng2eTemplateParser", parseInterceptor);
    app.config(["$httpProvider", function ($httpProvider) {
        $httpProvider.interceptors.push('ng2eTemplateParser');
    }]);
}