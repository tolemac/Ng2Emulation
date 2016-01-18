System.register("Templates/HttpInterceptor.js", ["./HtmlParser/Parser"], function(exports_1) {
  var Parser_1;
  function parseInterceptor() {
    "use strict";
    return {response: function(response) {
        response.data = Parser_1.default.processTemplate(response.data);
        return response;
      }};
  }
  function httpInterceptor(app) {
    "use strict";
    app.factory("ng2eTemplateParser", parseInterceptor);
    app.config(["$httpProvider", function($httpProvider) {
      $httpProvider.interceptors.push("ng2eTemplateParser");
    }]);
  }
  exports_1("default", httpInterceptor);
  return {
    setters: [function(Parser_1_1) {
      Parser_1 = Parser_1_1;
    }],
    execute: function() {}
  };
});

System.register("Expressions/Ng1Lexer/Lexer.js", [], function(exports_1) {
  var $parseMinErr,
      lowercase,
      OPERATORS,
      ESCAPE,
      Lexer;
  function isScope(obj) {
    return obj && obj.$evalAsync && obj.$watch;
  }
  function isWindow(obj) {
    return obj && obj.window === obj;
  }
  function toJsonReplacer(key, value) {
    var val = value;
    if (typeof key === "string" && key.charAt(0) === "$" && key.charAt(1) === "$") {
      val = undefined;
    } else if (isWindow(value)) {
      val = "$WINDOW";
    } else if (value && document === value) {
      val = "$DOCUMENT";
    } else if (isScope(value)) {
      val = "$SCOPE";
    }
    return val;
  }
  function serializeObject(obj) {
    var seen = [];
    return JSON.stringify(obj, function(key, val) {
      val = toJsonReplacer(key, val);
      if (angular.isObject(val)) {
        if (seen.indexOf(val) >= 0)
          return "...";
        seen.push(val);
      }
      return val;
    });
  }
  function toDebugString(obj) {
    if (typeof obj === "function") {
      return obj.toString().replace(/ \{[\s\S]*$/, "");
    } else if (angular.isUndefined(obj)) {
      return "undefined";
    } else if (typeof obj !== "string") {
      return serializeObject(obj);
    }
    return obj;
  }
  function minErr(module, ErrorConstructor) {
    ErrorConstructor = ErrorConstructor || Error;
    return function() {
      var SKIP_INDEXES = 2;
      var templateArgs = arguments,
          code = templateArgs[0],
          message = "[" + (module ? module + ":" : "") + code + "] ",
          template = templateArgs[1],
          paramPrefix,
          i;
      message += template.replace(/\{\d+\}/g, function(match) {
        var index = +match.slice(1, -1),
            shiftedIndex = index + SKIP_INDEXES;
        if (shiftedIndex < templateArgs.length) {
          return toDebugString(templateArgs[shiftedIndex]);
        }
        return match;
      });
      message += "\nhttp://errors.angularjs.org/1.4.8/" + (module ? module + "/" : "") + code;
      for (i = SKIP_INDEXES, paramPrefix = "?"; i < templateArgs.length; i++, paramPrefix = "&") {
        message += paramPrefix + "p" + (i - SKIP_INDEXES) + "=" + encodeURIComponent(toDebugString(templateArgs[i]));
      }
      return new ErrorConstructor(message);
    };
  }
  return {
    setters: [],
    execute: function() {
      $parseMinErr = minErr("$parse");
      lowercase = function(string) {
        return (angular.isString(string) ? string.toLowerCase() : string);
      };
      OPERATORS = {};
      angular.forEach("+ - * / % === !== == != < > <= >= && || ! = |".split(" "), function(operator) {
        OPERATORS[operator] = true;
      });
      ESCAPE = {
        "n": "\n",
        "f": "\f",
        "r": "\r",
        "t": "\t",
        "v": "\v",
        "'": "'",
        '"': '"'
      };
      exports_1("Lexer", Lexer = function(options) {
        this.options = options;
      });
      Lexer.prototype = {
        constructor: Lexer,
        lex: function(text) {
          this.text = text;
          this.index = 0;
          this.tokens = [];
          while (this.index < this.text.length) {
            var ch = this.text.charAt(this.index);
            if (ch === '"' || ch === "'") {
              this.readString(ch);
            } else if (this.isNumber(ch) || ch === "." && this.isNumber(this.peek())) {
              this.readNumber();
            } else if (this.isIdent(ch)) {
              this.readIdent();
            } else if (this.is(ch, "(){}[].,;:?")) {
              this.tokens.push({
                index: this.index,
                text: ch
              });
              this.index++;
            } else if (this.isWhitespace(ch)) {
              this.index++;
            } else {
              var ch2 = ch + this.peek();
              var ch3 = ch2 + this.peek(2);
              var op1 = OPERATORS[ch];
              var op2 = OPERATORS[ch2];
              var op3 = OPERATORS[ch3];
              if (op1 || op2 || op3) {
                var token = op3 ? ch3 : (op2 ? ch2 : ch);
                this.tokens.push({
                  index: this.index,
                  text: token,
                  operator: true
                });
                this.index += token.length;
              } else {
                this.throwError("Unexpected next character ", this.index, this.index + 1);
              }
            }
          }
          return this.tokens;
        },
        is: function(ch, chars) {
          return chars.indexOf(ch) !== -1;
        },
        peek: function(i) {
          var num = i || 1;
          return (this.index + num < this.text.length) ? this.text.charAt(this.index + num) : false;
        },
        isNumber: function(ch) {
          return ("0" <= ch && ch <= "9") && typeof ch === "string";
        },
        isWhitespace: function(ch) {
          return (ch === " " || ch === "\r" || ch === "\t" || ch === "\n" || ch === "\v" || ch === "\u00A0");
        },
        isIdent: function(ch) {
          return ("a" <= ch && ch <= "z" || "A" <= ch && ch <= "Z" || "_" === ch || ch === "$");
        },
        isExpOperator: function(ch) {
          return (ch === "-" || ch === "+" || this.isNumber(ch));
        },
        throwError: function(error, start, end) {
          end = end || this.index;
          var colStr = (angular.isDefined(start) ? "s " + start + "-" + this.index + " [" + this.text.substring(start, end) + "]" : " " + end);
          throw $parseMinErr("lexerr", "Lexer Error: {0} at column{1} in expression [{2}].", error, colStr, this.text);
        },
        readNumber: function() {
          var number = "";
          var start = this.index;
          while (this.index < this.text.length) {
            var ch = lowercase(this.text.charAt(this.index));
            if (ch == "." || this.isNumber(ch)) {
              number += ch;
            } else {
              var peekCh = this.peek();
              if (ch == "e" && this.isExpOperator(peekCh)) {
                number += ch;
              } else if (this.isExpOperator(ch) && peekCh && this.isNumber(peekCh) && number.charAt(number.length - 1) == "e") {
                number += ch;
              } else if (this.isExpOperator(ch) && (!peekCh || !this.isNumber(peekCh)) && number.charAt(number.length - 1) == "e") {
                this.throwError("Invalid exponent");
              } else {
                break;
              }
            }
            this.index++;
          }
          this.tokens.push({
            index: start,
            text: number,
            constant: true,
            value: Number(number)
          });
        },
        readIdent: function() {
          var start = this.index;
          while (this.index < this.text.length) {
            var ch = this.text.charAt(this.index);
            if (!(this.isIdent(ch) || this.isNumber(ch))) {
              break;
            }
            this.index++;
          }
          this.tokens.push({
            index: start,
            text: this.text.slice(start, this.index),
            identifier: true
          });
        },
        readString: function(quote) {
          var start = this.index;
          this.index++;
          var string = "";
          var rawString = quote;
          var escape = false;
          while (this.index < this.text.length) {
            var ch = this.text.charAt(this.index);
            rawString += ch;
            if (escape) {
              if (ch === "u") {
                var hex = this.text.substring(this.index + 1, this.index + 5);
                if (!hex.match(/[\da-f]{4}/i)) {
                  this.throwError("Invalid unicode escape [\\u" + hex + "]");
                }
                this.index += 4;
                string += String.fromCharCode(parseInt(hex, 16));
              } else {
                var rep = ESCAPE[ch];
                string = string + (rep || ch);
              }
              escape = false;
            } else if (ch === "\\") {
              escape = true;
            } else if (ch === quote) {
              this.index++;
              this.tokens.push({
                index: start,
                text: rawString,
                constant: true,
                value: string
              });
              return;
            } else {
              string += ch;
            }
            this.index++;
          }
          this.throwError("Unterminated quote", start);
        }
      };
    }
  };
});

System.register("Expressions/ExpressionParser.js", ["./Ng1Lexer/Lexer", "../Core/Angular1Wrapper"], function(exports_1) {
  var Lexer_1,
      Angular1Wrapper_1;
  var _lexer;
  function getCmpPropLevel(token, context, level) {
    "use strict";
    if (level === void 0) {
      level = 0;
    }
    if (context.hasOwnProperty(Angular1Wrapper_1.DEFAULT_CONTROLLER_AS) && (context[Angular1Wrapper_1.DEFAULT_CONTROLLER_AS].hasOwnProperty(token) || context[Angular1Wrapper_1.DEFAULT_CONTROLLER_AS].constructor.prototype.hasOwnProperty(token))) {
      return level;
    }
    if (context.$parent) {
      return getCmpPropLevel(token, context.$parent, ++level);
    }
    return undefined;
  }
  function getScopePropLevel(token, context, level) {
    "use strict";
    if (level === void 0) {
      level = 0;
    }
    if (context.hasOwnProperty(token)) {
      return level;
    }
    if (context.$parent) {
      return getCmpPropLevel(token, context.$parent, ++level);
    }
    return undefined;
  }
  function parseToken(token, context) {
    "use strict";
    var result = token;
    if (token === Angular1Wrapper_1.DEFAULT_CONTROLLER_AS) {
      return result;
    }
    var cmpLevel = getCmpPropLevel(token, context);
    if (angular.isDefined(cmpLevel)) {
      result = "$$cmp." + result;
      for (var i = 0; i < cmpLevel; i++) {
        result = "$parent." + result;
      }
    } else {
      var scopeLevel = getScopePropLevel(token, context);
      if (angular.isDefined(scopeLevel)) {
        for (var i = 0; i < scopeLevel; i++) {
          result = "$parent." + result;
        }
      } else {
        result = "$$cmp." + result;
      }
    }
    return result;
  }
  function parseExpression(exp, context) {
    "use strict";
    var tokens = _lexer.lex(exp);
    var parsedTokens = [];
    var changed = false;
    var firstIdentifier = true;
    angular.forEach(tokens, function(token) {
      if (firstIdentifier && token.identifier === true) {
        var parsedToken = parseToken(token.text, context);
        if (parsedToken !== token.text) {
          changed = true;
        }
        parsedTokens.push(parsedToken);
        firstIdentifier = false;
      } else {
        parsedTokens.push(token.text);
        if (token.identifier !== true && token.text !== ".") {
          firstIdentifier = true;
        }
      }
    });
    var parsedExp = parsedTokens.join("");
    return changed ? parsedExp : exp;
  }
  exports_1("parseExpression", parseExpression);
  return {
    setters: [function(Lexer_1_1) {
      Lexer_1 = Lexer_1_1;
    }, function(Angular1Wrapper_1_1) {
      Angular1Wrapper_1 = Angular1Wrapper_1_1;
    }],
    execute: function() {
      _lexer = new Lexer_1.Lexer();
    }
  };
});

System.register("Core/ParseDecorator.js", ["../Expressions/ExpressionParser"], function(exports_1) {
  var ExpressionParser_1;
  function decorateParse(app) {
    "use strict";
    app.config(["$provide", function($provide) {
      $provide.decorator("$parse", ["$delegate", function($delegate) {
        var origParseDelegate = $delegate;
        var customDelegate = function() {
          var origResult = origParseDelegate.apply(this, arguments);
          if (typeof arguments[0] === "function") {
            return origResult;
          }
          var expression = arguments[0];
          var customResult = function() {
            var finalResult = origResult;
            var expression = customResult.$$expression,
                newExpression;
            if (expression && arguments[0]) {
              newExpression = ExpressionParser_1.parseExpression(expression, arguments[0]);
              if (newExpression && newExpression !== expression) {
                finalResult = origParseDelegate(newExpression);
              }
            }
            var newScope = arguments[0];
            arguments[0] = newScope;
            return finalResult.apply(this, arguments);
          };
          customResult.$$expression = expression;
          customResult.liteal = origResult.liteal;
          customResult.constant = origResult.constant;
          customResult.assign = origResult.assign;
          return (!origResult ? origResult : customResult);
        };
        return customDelegate;
      }]);
    }]);
  }
  return {
    setters: [function(ExpressionParser_1_1) {
      ExpressionParser_1 = ExpressionParser_1_1;
    }],
    execute: function() {
      exports_1("default", decorateParse);
    }
  };
});

System.register("Templates/HtmlParser/rules/NgContentRule.js", ["../ParserRule"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ParserRule_1;
  var NgContentRule;
  return {
    setters: [function(ParserRule_1_1) {
      ParserRule_1 = ParserRule_1_1;
    }],
    execute: function() {
      NgContentRule = (function(_super) {
        __extends(NgContentRule, _super);
        function NgContentRule() {
          _super.apply(this, arguments);
        }
        NgContentRule.prototype.startTag = function(tagName, attributes, unary) {
          if (attributes.hasOwnProperty("ngContent")) {
            attributes["ng-transcude"] = angular.extend({}, attributes["ngContent"]);
            delete attributes["ngContent"];
          }
          return tagName;
        };
        NgContentRule.prototype.end = function(tagName) {
          return tagName;
        };
        NgContentRule.prototype.chars = function(text) {
          return text;
        };
        NgContentRule.prototype.comment = function(text) {
          return text;
        };
        return NgContentRule;
      })(ParserRule_1.ParserRule);
      exports_1("default", NgContentRule);
    }
  };
});

System.register("Templates/HtmlParser/rules/NgModelRule.js", ["../ParserRule"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ParserRule_1;
  var NgModelRule;
  return {
    setters: [function(ParserRule_1_1) {
      ParserRule_1 = ParserRule_1_1;
    }],
    execute: function() {
      NgModelRule = (function(_super) {
        __extends(NgModelRule, _super);
        function NgModelRule() {
          _super.apply(this, arguments);
        }
        NgModelRule.prototype.startTag = function(tagName, attributes, unary) {
          if (attributes.hasOwnProperty("[(ngModel)]")) {
            attributes["ng-model"] = angular.extend({}, attributes["[(ngModel)]"]);
            attributes["ng-model"].value = "$$cmp." + attributes["ng-model"].value;
            delete attributes["[(ngModel)]"];
          }
          return tagName;
        };
        NgModelRule.prototype.end = function(tagName) {
          return tagName;
        };
        NgModelRule.prototype.chars = function(text) {
          return text;
        };
        NgModelRule.prototype.comment = function(text) {
          return text;
        };
        return NgModelRule;
      })(ParserRule_1.ParserRule);
      exports_1("default", NgModelRule);
    }
  };
});

System.register("Templates/HtmlParser/rules/NgPropertyRule.js", ["../ParserRule"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ParserRule_1;
  var NgPropertyRule;
  return {
    setters: [function(ParserRule_1_1) {
      ParserRule_1 = ParserRule_1_1;
    }],
    execute: function() {
      NgPropertyRule = (function(_super) {
        __extends(NgPropertyRule, _super);
        function NgPropertyRule() {
          _super.apply(this, arguments);
        }
        NgPropertyRule.prototype.startTag = function(tagName, attributes, unary) {
          var removeAttrs = [];
          for (var name_1 in attributes) {
            if (attributes.hasOwnProperty(name_1)) {
              var variable = void 0;
              if (name_1[0] === "#")
                variable = name_1.substr(1, name_1.length);
              if (name_1.length > 4 && name_1.substr(0, 4) === "var-")
                variable = name_1.substr(4);
              if (variable) {
                removeAttrs.push(name_1);
                attributes["ng-property"] = attributes["ng-property"] || {
                  value: "",
                  quoted: true
                };
                attributes["ng-property"].value += variable + ";";
              }
            }
          }
          removeAttrs.forEach(function(attrName) {
            delete attributes[attrName];
          });
          return tagName;
        };
        NgPropertyRule.prototype.end = function(tagName) {
          return tagName;
        };
        NgPropertyRule.prototype.chars = function(text) {
          return text;
        };
        NgPropertyRule.prototype.comment = function(text) {
          return text;
        };
        return NgPropertyRule;
      })(ParserRule_1.ParserRule);
      exports_1("default", NgPropertyRule);
    }
  };
});

System.register("Templates/HtmlParser/rules/EventBindingRule.js", ["../ParserRule"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ParserRule_1;
  var BindingRule;
  return {
    setters: [function(ParserRule_1_1) {
      ParserRule_1 = ParserRule_1_1;
    }],
    execute: function() {
      BindingRule = (function(_super) {
        __extends(BindingRule, _super);
        function BindingRule() {
          _super.apply(this, arguments);
        }
        BindingRule.prototype.startTag = function(tagName, attributes, unary) {
          var removeAttrs = [];
          for (var name_1 in attributes) {
            if (attributes.hasOwnProperty(name_1)) {
              var value = attributes[name_1].value;
              var event_1 = void 0;
              if (name_1[0] === "(" && name_1[name_1.length - 1] === ")")
                event_1 = name_1.substr(1, name_1.length - 2);
              if (name_1.length > 3 && name_1.substr(0, 3) === "on-")
                event_1 = name_1.substr(3);
              if (event_1) {
                removeAttrs.push(name_1);
                attributes["ng-event-binding"] = attributes["ng-event-binding"] || {
                  value: "",
                  quoted: true
                };
                if (attributes["ng-event-binding"].value)
                  attributes["ng-event-binding"].value += "[&&]";
                attributes["ng-event-binding"].value += event_1 + "=>" + value;
              }
            }
          }
          removeAttrs.forEach(function(attrName) {
            delete attributes[attrName];
          });
          return tagName;
        };
        BindingRule.prototype.end = function(tagName) {
          return tagName;
        };
        BindingRule.prototype.chars = function(text) {
          return text;
        };
        BindingRule.prototype.comment = function(text) {
          return text;
        };
        return BindingRule;
      })(ParserRule_1.ParserRule);
      exports_1("default", BindingRule);
    }
  };
});

System.register("Templates/HtmlParser/rules/PropertyBindingRule.js", ["../ParserRule"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ParserRule_1;
  var BindingRule;
  return {
    setters: [function(ParserRule_1_1) {
      ParserRule_1 = ParserRule_1_1;
    }],
    execute: function() {
      BindingRule = (function(_super) {
        __extends(BindingRule, _super);
        function BindingRule() {
          _super.apply(this, arguments);
        }
        BindingRule.prototype.startTag = function(tagName, attributes, unary) {
          var removeAttrs = [];
          for (var name_1 in attributes) {
            if (attributes.hasOwnProperty(name_1)) {
              var value = attributes[name_1].value;
              var property = void 0;
              if (name_1[0] === "[" && name_1[name_1.length - 1] === "]")
                property = name_1.substr(1, name_1.length - 2);
              if (name_1.length > 5 && name_1.substr(0, 5) === "bind-")
                property = name_1.substr(5);
              if (property) {
                removeAttrs.push(name_1);
                attributes["ng-property-binding"] = attributes["ng-property-binding"] || {
                  value: "",
                  quoted: true
                };
                if (attributes["ng-property-binding"].value)
                  attributes["ng-property-binding"].value += "[&&]";
                attributes["ng-property-binding"].value += property + "=>" + value;
              }
            }
          }
          removeAttrs.forEach(function(attrName) {
            delete attributes[attrName];
          });
          return tagName;
        };
        BindingRule.prototype.end = function(tagName) {
          return tagName;
        };
        BindingRule.prototype.chars = function(text) {
          return text;
        };
        BindingRule.prototype.comment = function(text) {
          return text;
        };
        return BindingRule;
      })(ParserRule_1.ParserRule);
      exports_1("default", BindingRule);
    }
  };
});

System.register("Templates/HtmlParser/rules/TwoWayBindingRule.js", ["../ParserRule"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ParserRule_1;
  var BindingRule;
  return {
    setters: [function(ParserRule_1_1) {
      ParserRule_1 = ParserRule_1_1;
    }],
    execute: function() {
      BindingRule = (function(_super) {
        __extends(BindingRule, _super);
        function BindingRule() {
          _super.apply(this, arguments);
        }
        BindingRule.prototype.startTag = function(tagName, attributes, unary) {
          var removeAttrs = [];
          for (var name_1 in attributes) {
            if (attributes.hasOwnProperty(name_1)) {
              var value = attributes[name_1].value;
              var property = void 0;
              if (name_1.length > 4 && name_1.substr(0, 2) === "[(" && name_1.substr(name_1.length - 2, 2) === ")]")
                property = name_1.substr(2, name_1.length - 4);
              if (name_1.length > 7 && name_1.substr(0, 7) === "bindon-")
                property = name_1.substr(7);
              if (property) {
                removeAttrs.push(name_1);
                attributes["ng-two-way-binding"] = attributes["ng-two-way-binding"] || {
                  value: "",
                  quoted: true
                };
                if (attributes["ng-two-way-binding"].value)
                  attributes["ng-two-way-binding"].value += "[&&]";
                attributes["ng-two-way-binding"].value += property + "=>" + value;
              }
            }
          }
          removeAttrs.forEach(function(attrName) {
            delete attributes[attrName];
          });
          return tagName;
        };
        BindingRule.prototype.end = function(tagName) {
          return tagName;
        };
        BindingRule.prototype.chars = function(text) {
          return text;
        };
        BindingRule.prototype.comment = function(text) {
          return text;
        };
        return BindingRule;
      })(ParserRule_1.ParserRule);
      exports_1("default", BindingRule);
    }
  };
});

System.register("Templates/HtmlParser/rules/NgForRule.js", ["../ParserRule"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ParserRule_1;
  var NgModelRule;
  return {
    setters: [function(ParserRule_1_1) {
      ParserRule_1 = ParserRule_1_1;
    }],
    execute: function() {
      NgModelRule = (function(_super) {
        __extends(NgModelRule, _super);
        function NgModelRule() {
          _super.apply(this, arguments);
        }
        NgModelRule.prototype.startTag = function(tagName, attributes, unary) {
          if (attributes.hasOwnProperty("*ngFor")) {
            var value = attributes["*ngFor"].value;
            var regex = /#([a-zA-Z0-9-]+) of ([a-zA-Z0-9.]+)(?:,(.*)?)?/;
            var _a = regex.exec(value),
                variable = _a[1],
                list = _a[2],
                more = _a[3];
            if (more) {
              var ngInit = "";
              var assigments = more.split(",");
              var regex2 = /#([a-zA-Z0-9-]+)\s?=\s?(.*)/;
              for (var i = 0; i < assigments.length; i++) {
                var m = regex2.exec(assigments[i]);
                if (m != null && m[1]) {
                  m[2] = m[2].replace("index", "$index");
                  if (m[2] === "index")
                    m[2] = "$index";
                  ngInit += m[1] + "=" + m[2] + ";";
                }
              }
              if (ngInit !== "") {
                attributes["ng-init"] = attributes["ng-init"] || {
                  value: "",
                  quoted: true
                };
                attributes["ng-init"].value = ngInit + attributes["ng-init"].value;
              }
            }
            attributes["ng-repeat"] = {
              value: variable + " in $$cmp." + list,
              quoted: true
            };
            delete attributes["*ngFor"];
          }
          return tagName;
        };
        NgModelRule.prototype.end = function(tagName) {
          return tagName;
        };
        NgModelRule.prototype.chars = function(text) {
          return text;
        };
        NgModelRule.prototype.comment = function(text) {
          return text;
        };
        return NgModelRule;
      })(ParserRule_1.ParserRule);
      exports_1("default", NgModelRule);
    }
  };
});

System.register("Templates/HtmlParser/ParserRule.js", [], function(exports_1) {
  var ParserRule;
  return {
    setters: [],
    execute: function() {
      ParserRule = (function() {
        function ParserRule() {}
        return ParserRule;
      })();
      exports_1("ParserRule", ParserRule);
    }
  };
});

System.register("Templates/HtmlParser/rules/NgIfRule.js", ["../ParserRule"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ParserRule_1;
  var NgIfRule;
  return {
    setters: [function(ParserRule_1_1) {
      ParserRule_1 = ParserRule_1_1;
    }],
    execute: function() {
      NgIfRule = (function(_super) {
        __extends(NgIfRule, _super);
        function NgIfRule() {
          _super.apply(this, arguments);
        }
        NgIfRule.prototype.startTag = function(tagName, attributes, unary) {
          if (attributes.hasOwnProperty("*ngIf")) {
            attributes["ng-if"] = angular.extend({}, attributes["*ngIf"]);
            delete attributes["*ngIf"];
          }
          return tagName;
        };
        NgIfRule.prototype.end = function(tagName) {
          return tagName;
        };
        NgIfRule.prototype.chars = function(text) {
          return text;
        };
        NgIfRule.prototype.comment = function(text) {
          return text;
        };
        return NgIfRule;
      })(ParserRule_1.ParserRule);
      exports_1("default", NgIfRule);
    }
  };
});

System.register("Templates/HtmlParser/Parser.js", ["./rules/NgContentRule", "./rules/NgModelRule", "./rules/NgPropertyRule", "./rules/EventBindingRule", "./rules/PropertyBindingRule", "./rules/TwoWayBindingRule", "./rules/NgForRule", "./rules/NgIfRule", "HTML5Tokenizer"], function(exports_1) {
  var NgContentRule_1,
      NgModelRule_1,
      NgPropertyRule_1,
      EventBindingRule_1,
      PropertyBindingRule_1,
      TwoWayBindingRule_1,
      NgForRule_1,
      NgIfRule_1,
      HTML5Tokenizer_1;
  var Parser;
  return {
    setters: [function(NgContentRule_1_1) {
      NgContentRule_1 = NgContentRule_1_1;
    }, function(NgModelRule_1_1) {
      NgModelRule_1 = NgModelRule_1_1;
    }, function(NgPropertyRule_1_1) {
      NgPropertyRule_1 = NgPropertyRule_1_1;
    }, function(EventBindingRule_1_1) {
      EventBindingRule_1 = EventBindingRule_1_1;
    }, function(PropertyBindingRule_1_1) {
      PropertyBindingRule_1 = PropertyBindingRule_1_1;
    }, function(TwoWayBindingRule_1_1) {
      TwoWayBindingRule_1 = TwoWayBindingRule_1_1;
    }, function(NgForRule_1_1) {
      NgForRule_1 = NgForRule_1_1;
    }, function(NgIfRule_1_1) {
      NgIfRule_1 = NgIfRule_1_1;
    }, function(HTML5Tokenizer_1_1) {
      HTML5Tokenizer_1 = HTML5Tokenizer_1_1;
    }],
    execute: function() {
      Parser = (function() {
        function Parser() {}
        Parser.processTemplate = function(template) {
          var tokens = HTML5Tokenizer_1.tokenize(template);
          var results = "";
          for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            var result;
            if (token.type === "StartTag") {
              var attributes = token.attributes;
              var tagName = token.tagName;
              var selfClosing = token.selfClosing;
              var attrs = {};
              for (var i_1 = 0; i_1 < attributes.length; i_1++) {
                var _a = attributes[i_1],
                    attrName = _a[0],
                    attrValue = _a[1],
                    attrQuoted = _a[2];
                attrs[attrName] = {
                  value: attrValue,
                  quoted: attrQuoted
                };
              }
              this.rules.forEach(function(rule) {
                return tagName = rule.startTag(tagName, attrs, selfClosing);
              });
              results += "<" + tagName;
              for (var name_1 in attrs) {
                if (attrs.hasOwnProperty(name_1)) {
                  results += attrs[name_1].quoted ? " " + name_1 + "=\"" + attrs[name_1].value + "\"" : " " + name_1 + "=" + attrs[name_1].value;
                }
              }
              results += selfClosing ? "/>" : ">";
            } else if (token.type === "EndTag") {
              result = token.tagName;
              this.rules.forEach(function(rule) {
                return result = rule.end(result);
              });
              results += "</" + result + ">";
            } else if (token.type === "Chars") {
              result = token.chars;
              this.rules.forEach(function(rule) {
                return result = rule.chars(result);
              });
              results += result;
            } else if (token.type === "Comment") {
              result = token.chars;
              this.rules.forEach(function(rule) {
                return result = rule.chars(result);
              });
              results += result;
            } else {
              results += token.chars;
            }
          }
          return results;
        };
        Parser.rules = [new NgModelRule_1.default(), new NgContentRule_1.default(), new NgPropertyRule_1.default(), new TwoWayBindingRule_1.default(), new PropertyBindingRule_1.default(), new EventBindingRule_1.default(), new NgForRule_1.default(), new NgIfRule_1.default()];
        return Parser;
      })();
      exports_1("default", Parser);
    }
  };
});

System.register("Core/Angular1Wrapper.js", ["../Utils/AngularHelpers", "../Templates/HtmlParser/Parser"], function(exports_1) {
  var AngularHelpers,
      Parser_1;
  var APPLICATION_MODULE_NAME,
      DEFAULT_CONTROLLER_AS,
      Angular1Wrapper;
  return {
    setters: [function(AngularHelpers_1) {
      AngularHelpers = AngularHelpers_1;
    }, function(Parser_1_1) {
      Parser_1 = Parser_1_1;
    }],
    execute: function() {
      APPLICATION_MODULE_NAME = "app";
      exports_1("DEFAULT_CONTROLLER_AS", DEFAULT_CONTROLLER_AS = "$$cmp");
      Angular1Wrapper = (function() {
        function Angular1Wrapper() {}
        Angular1Wrapper.registerDirectiveInternal = function(directiveName, ddo, component) {
          var directiveFactory = function() {
            return ddo;
          };
          if (component["$routeConfig"])
            directiveFactory.$routeConfig = component["$routeConfig"];
          this.app.directive(directiveName, function() {
            return ddo;
          });
        };
        Angular1Wrapper.registerDirective = function(directive) {
          var ddo = {controller: directive};
          var metaData = directive["$directiveMetadata"];
          angular.extend(ddo, metaData);
          var directiveName = AngularHelpers.directiveNormalize(metaData["selector"]);
          this.registerDirectiveInternal(directiveName, ddo, directive);
        };
        Angular1Wrapper.registerComponent = function(component) {
          var ddo = {
            controller: component,
            controllerAs: DEFAULT_CONTROLLER_AS,
            scope: {}
          };
          var cmpMetaData = component["$componentMetadata"];
          if (cmpMetaData.styles && cmpMetaData.styles.length > 0) {
            var style = cmpMetaData.styles.join(",");
            var sheet = document.createElement("style");
            sheet.innerHTML = style;
            document.body.appendChild(sheet);
          }
          if (cmpMetaData.directives) {
            for (var i = 0; i < cmpMetaData.directives.length; i++) {
              this.registerComponent(cmpMetaData.directives[i]);
            }
          }
          angular.extend(ddo, cmpMetaData);
          if (ddo.template)
            ddo.template = Parser_1.default.processTemplate(ddo.template);
          var directiveName = AngularHelpers.directiveNormalize(cmpMetaData["selector"]);
          this.registerDirectiveInternal(directiveName, ddo, component);
        };
        Angular1Wrapper.createModule = function(dependencies) {
          this.app = angular.module(APPLICATION_MODULE_NAME, dependencies || []);
        };
        Angular1Wrapper.registerService = function(service) {
          var nameOfService = AngularHelpers.serviceNormalize(service.name);
          this.app.service(nameOfService, service);
        };
        Angular1Wrapper.registerServices = function(services) {
          if (!services)
            return;
          for (var i = 0; i < services.length; i++) {
            this.registerService(services[i]);
          }
        };
        Angular1Wrapper.bootstrap = function() {
          angular.bootstrap(document, [APPLICATION_MODULE_NAME]);
        };
        return Angular1Wrapper;
      })();
      exports_1("Angular1Wrapper", Angular1Wrapper);
    }
  };
});

System.register("Directives/NgProperty.js", ["../Ng2Emulation", "../Core/Angular1Wrapper"], function(exports_1) {
  var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var __metadata = (this && this.__metadata) || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
  var __param = (this && this.__param) || function(paramIndex, decorator) {
    return function(target, key) {
      decorator(target, key, paramIndex);
    };
  };
  var Ng2Emulation_1,
      Angular1Wrapper_1;
  var NgProperty;
  return {
    setters: [function(Ng2Emulation_1_1) {
      Ng2Emulation_1 = Ng2Emulation_1_1;
    }, function(Angular1Wrapper_1_1) {
      Angular1Wrapper_1 = Angular1Wrapper_1_1;
    }],
    execute: function() {
      NgProperty = (function() {
        function NgProperty($element, $attrs, $scope) {
          this.$element = $element;
          this.$scope = $scope;
          var newScope = $scope[Angular1Wrapper_1.DEFAULT_CONTROLLER_AS];
          var parts = $attrs["ngProperty"].split(";");
          for (var i = 0; i < parts.length; i++) {
            var property = parts[i].trim();
            if (property)
              newScope[property] = $element[0];
          }
        }
        NgProperty = __decorate([Ng2Emulation_1.Directive({
          selector: "ng-property",
          priority: -1000
        }), __param(0, Ng2Emulation_1.Inject("$element")), __param(1, Ng2Emulation_1.Inject("$attrs")), __param(2, Ng2Emulation_1.Inject("$scope")), __metadata('design:paramtypes', [Object, Object, Object])], NgProperty);
        return NgProperty;
      })();
      exports_1("NgProperty", NgProperty);
    }
  };
});

System.register("Events/ElementEvents.js", [], function(exports_1) {
  var events;
  function add() {
    var customEvents = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      customEvents[_i - 0] = arguments[_i];
    }
    customEvents.forEach(function(event) {
      return events.push(event);
    });
  }
  function exists(eventName) {
    return events.indexOf(eventName) >= 0;
  }
  return {
    setters: [],
    execute: function() {
      events = ["click", "dblclick", "mousedown", "mouseup", "mouseover", "mouseout", "mousemove", "mouseenter", "mouseleave", "keydown", "keyup", "keypress", "submit", "focus", "blur", "copy", "cut", "paste", "change", "dragstart", "drag", "dragenter", "dragleave", "dragover", "drop", "dragend", "error", "input", "load", "wheel", "scroll"];
      exports_1("default", {
        add: add,
        exists: exists
      });
    }
  };
});

System.register("Directives/NgEventBinding.js", ["../Ng2Emulation", "../Events/ElementEvents", "../Utils/AngularHelpers", "../Core/ChangeDetection"], function(exports_1) {
  var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var __metadata = (this && this.__metadata) || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
  var __param = (this && this.__param) || function(paramIndex, decorator) {
    return function(target, key) {
      decorator(target, key, paramIndex);
    };
  };
  var Ng2Emulation_1,
      ElementEvents_1,
      AngularHelpers_1,
      ChangeDetection_1;
  var NgEventBinding;
  return {
    setters: [function(Ng2Emulation_1_1) {
      Ng2Emulation_1 = Ng2Emulation_1_1;
    }, function(ElementEvents_1_1) {
      ElementEvents_1 = ElementEvents_1_1;
    }, function(AngularHelpers_1_1) {
      AngularHelpers_1 = AngularHelpers_1_1;
    }, function(ChangeDetection_1_1) {
      ChangeDetection_1 = ChangeDetection_1_1;
    }],
    execute: function() {
      NgEventBinding = (function() {
        function NgEventBinding($parse, $element, $attrs, $scope) {
          this.$element = $element;
          this.$scope = $scope;
          var parts = $attrs["ngEventBinding"].split("[&&]");
          for (var i = 0; i < parts.length; i++) {
            var binding = parts[i];
            if (binding) {
              this.createBinding(binding, $parse, $element, $scope);
            }
          }
        }
        NgEventBinding.prototype.createBinding = function(binding, $parse, $element, $scope) {
          var _this = this;
          var attrValues = binding.split("=>");
          var event = attrValues[0];
          this.expression = $parse(attrValues[1]);
          var component = $element.controller(AngularHelpers_1.directiveNormalize($element[0].localName));
          if (component && component.constructor.$componentMetadata) {
            if (component.constructor.$componentMetadata.outputs && component.constructor.$componentMetadata.outputs.indexOf(event) >= 0)
              component[event].subscribe(function(eventEmitted) {
                _this.eventHandler(eventEmitted);
                ChangeDetection_1.registerChange(component, event, new ChangeDetection_1.SimpleChange(undefined, eventEmitted));
              });
            else
              console.log("Error processing " + binding);
            return;
          }
          if (ElementEvents_1.default.exists(event)) {
            $element.on(event, function(e) {
              return _this.eventHandler(e);
            });
            $scope.$on("$destroy", function() {
              return _this.onDestroy();
            });
            return;
          }
        };
        NgEventBinding.prototype.eventHandler = function($event) {
          if ($event === void 0) {
            $event = {};
          }
          var parameters = {$event: $event};
          if (typeof $event === "object") {
            var detail = $event.detail;
            if (!detail && $event.originalEvent && $event.originalEvent.detail) {
              detail = $event.originalEvent.detail;
            } else if (!detail || typeof detail !== "object") {
              detail = {};
            }
            parameters = {$event: angular.extend($event, {detail: detail})};
          }
          var newScope = this.$scope;
          this.expression(newScope, parameters);
          this.$scope.$applyAsync();
        };
        NgEventBinding.prototype.onDestroy = function() {
          this.$element.off(event);
        };
        NgEventBinding = __decorate([Ng2Emulation_1.Directive({
          selector: "ng-event-binding",
          priority: -1000
        }), __param(0, Ng2Emulation_1.Inject("$parse")), __param(1, Ng2Emulation_1.Inject("$element")), __param(2, Ng2Emulation_1.Inject("$attrs")), __param(3, Ng2Emulation_1.Inject("$scope")), __metadata('design:paramtypes', [Function, Object, Object, Object])], NgEventBinding);
        return NgEventBinding;
      })();
      exports_1("NgEventBinding", NgEventBinding);
    }
  };
});

System.register("Decorators/Component.js", ["../Utils/AngularHelpers"], function(exports_1) {
  var AngularHelpers_1;
  function Component(componentMetadata) {
    return function(target) {
      target.$componentMetadata = target.$componentMetadata || {};
      target.$componentMetadata = angular.extend(target.$componentMetadata, componentMetadata);
      if (componentMetadata.providers) {
        var $inject = target.$inject = target.$inject || [];
        for (var i = 0; i < componentMetadata.providers.length; i++) {
          var token = componentMetadata.providers[i];
          var name_1 = typeof token === "string" ? token : AngularHelpers_1.serviceNormalize(token.name);
          if ($inject.length === i)
            $inject.push();
          $inject[i] = name_1;
        }
      }
      return target;
    };
  }
  exports_1("Component", Component);
  return {
    setters: [function(AngularHelpers_1_1) {
      AngularHelpers_1 = AngularHelpers_1_1;
    }],
    execute: function() {}
  };
});

System.register("Decorators/Directive.js", [], function(exports_1) {
  function Directive(directiveMetadata) {
    return function(target) {
      target.$directiveMetadata = directiveMetadata;
      return target;
    };
  }
  exports_1("Directive", Directive);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("Decorators/Inject.js", ["../Utils/AngularHelpers"], function(exports_1) {
  var AngularHelpers_1;
  function Inject(token) {
    return function(target, key, index) {
      var $inject = target.$inject = target.$inject || [];
      var name = typeof token === "string" ? token : AngularHelpers_1.serviceNormalize(token.name);
      while ($inject.length < index) {
        $inject.push("");
      }
      $inject[index] = name;
    };
  }
  exports_1("Inject", Inject);
  return {
    setters: [function(AngularHelpers_1_1) {
      AngularHelpers_1 = AngularHelpers_1_1;
    }],
    execute: function() {}
  };
});

System.register("Decorators/Injectable.js", ["../Core/Bootstrap"], function(exports_1) {
  var Bootstrap_1;
  function Injectable() {
    return function(target) {
      Bootstrap_1.BootStrapper.AddService(target);
      return target;
    };
  }
  exports_1("Injectable", Injectable);
  return {
    setters: [function(Bootstrap_1_1) {
      Bootstrap_1 = Bootstrap_1_1;
    }],
    execute: function() {}
  };
});

System.register("Events/EventEmitter.js", [], function(exports_1) {
  var EventEmiter;
  return {
    setters: [],
    execute: function() {
      EventEmiter = (function() {
        function EventEmiter() {
          this.observers = [];
        }
        EventEmiter.prototype.subscribe = function(handler) {
          this.observers.push(handler);
        };
        EventEmiter.prototype.emit = function(event) {
          this.observers.forEach(function(observer) {
            return observer(event);
          });
        };
        return EventEmiter;
      })();
      exports_1("EventEmiter", EventEmiter);
    }
  };
});

System.register("Decorators/Output.js", [], function(exports_1) {
  function Output(outputName) {
    return function(target, key) {
      if (!outputName)
        outputName = key;
      var constructr = target.constructor;
      if (!constructr.$componentMetadata || !constructr.$componentMetadata.outputs) {
        constructr.$componentMetadata = constructr.$componentMetadata || {};
        constructr.$componentMetadata.outputs = constructr.$componentMetadata.outputs || [];
      }
      if (constructr.$componentMetadata.outputs.indexOf(outputName) < 0)
        constructr.$componentMetadata.outputs.push(outputName);
    };
  }
  exports_1("Output", Output);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("Decorators/Input.js", [], function(exports_1) {
  function Input(inputName) {
    return function(target, key) {
      if (!inputName)
        inputName = key;
      var constructr = target.constructor;
      if (!constructr.$componentMetadata || !constructr.$componentMetadata.inputs) {
        constructr.$componentMetadata = constructr.$componentMetadata || {};
        constructr.$componentMetadata.inputs = constructr.$componentMetadata.inputs || [];
      }
      if (constructr.$componentMetadata.inputs.indexOf(inputName) < 0)
        constructr.$componentMetadata.inputs.push(inputName);
    };
  }
  exports_1("Input", Input);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("Ng2Emulation.js", ["./Decorators/Component", "./Decorators/Directive", "./Decorators/Inject", "./Decorators/Injectable", "./Events/EventEmitter", "./Core/Bootstrap", "./Decorators/Output", "./Decorators/Input"], function(exports_1) {
  function exportStar_1(m) {
    var exports = {};
    for (var n in m) {
      if (n !== "default")
        exports[n] = m[n];
    }
    exports_1(exports);
  }
  return {
    setters: [function(Component_1_1) {
      exportStar_1(Component_1_1);
    }, function(Directive_1_1) {
      exportStar_1(Directive_1_1);
    }, function(Inject_1_1) {
      exportStar_1(Inject_1_1);
    }, function(Injectable_1_1) {
      exportStar_1(Injectable_1_1);
    }, function(EventEmitter_1_1) {
      exportStar_1(EventEmitter_1_1);
    }, function(Bootstrap_1_1) {
      exportStar_1(Bootstrap_1_1);
    }, function(Output_1_1) {
      exportStar_1(Output_1_1);
    }, function(Input_1_1) {
      exportStar_1(Input_1_1);
    }],
    execute: function() {}
  };
});

System.register("Utils/AngularHelpers.js", [], function(exports_1) {
  var SPECIAL_CHARS_REGEXP,
      MOZ_HACK_REGEXP,
      PREFIX_REGEXP,
      SNAKE_CASE_REGEXP;
  function camelCase(name) {
    return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
      return (offset ? letter.toUpperCase() : letter);
    }).replace(MOZ_HACK_REGEXP, "Moz$1");
  }
  function directiveNormalize(name) {
    return camelCase(name.replace(PREFIX_REGEXP, ""));
  }
  exports_1("directiveNormalize", directiveNormalize);
  function serviceNormalize(name) {
    return name[0].toLowerCase() + name.substr(1);
  }
  exports_1("serviceNormalize", serviceNormalize);
  function dasherize(name, separator) {
    if (separator === void 0) {
      separator = '-';
    }
    return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
      return "" + (pos ? separator : '') + letter.toLowerCase();
    });
  }
  exports_1("dasherize", dasherize);
  function parseSelector(selector) {
    var selectorArray;
    var type;
    if (selector.match(/\[(.*?)\]/) !== null) {
      selectorArray = selector.slice(1, selector.length - 1).split('-');
      type = 'A';
    } else if (selector[0] === '.') {
      selectorArray = selector.slice(1, selector.length).split('-');
      type = 'C';
    } else {
      selectorArray = selector.split('-');
      type = 'E';
    }
    var first = selectorArray.shift();
    var name;
    if (selectorArray.length > 0) {
      for (var i = 0; i < selectorArray.length; i++) {
        var s = selectorArray[i];
        s = s.slice(0, 1).toUpperCase() + s.slice(1, s.length);
        selectorArray[i] = s;
      }
      name = [first].concat(selectorArray).join('');
    } else {
      name = first;
    }
    return {
      name: name,
      type: type
    };
  }
  exports_1("parseSelector", parseSelector);
  return {
    setters: [],
    execute: function() {
      SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
      MOZ_HACK_REGEXP = /^moz([A-Z])/;
      PREFIX_REGEXP = /^((?:x|data)[\:\-_])/i;
      SNAKE_CASE_REGEXP = /[A-Z]/g;
    }
  };
});

System.register("Directives/NgPropertyBinding.js", ["../Ng2Emulation", "../Utils/AngularHelpers", "../Core/ChangeDetection"], function(exports_1) {
  var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if (d = decorators[i])
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
  var __metadata = (this && this.__metadata) || function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
  var __param = (this && this.__param) || function(paramIndex, decorator) {
    return function(target, key) {
      decorator(target, key, paramIndex);
    };
  };
  var Ng2Emulation_1,
      AngularHelpers_1,
      ChangeDetection_1;
  var NgPropertyBinding;
  return {
    setters: [function(Ng2Emulation_1_1) {
      Ng2Emulation_1 = Ng2Emulation_1_1;
    }, function(AngularHelpers_1_1) {
      AngularHelpers_1 = AngularHelpers_1_1;
    }, function(ChangeDetection_1_1) {
      ChangeDetection_1 = ChangeDetection_1_1;
    }],
    execute: function() {
      NgPropertyBinding = (function() {
        function NgPropertyBinding($parse, $element, $attrs, $scope, $interpolate) {
          this.$element = $element;
          this.$scope = $scope;
          this.$interpolate = $interpolate;
          var parts = $attrs["ngPropertyBinding"].split("[&&]");
          for (var i = 0; i < parts.length; i++) {
            var binding = parts[i];
            if (binding) {
              this.createBinding(binding, $parse, $element);
            }
          }
        }
        NgPropertyBinding.prototype.createBinding = function(binding, $parse, $element) {
          var attrValues = binding.split("=>");
          var property = attrValues[0];
          this.expression = $parse(attrValues[1]);
          if (property.substr(0, 5) === "attr.") {
            var attributeName = property.substr(5);
            this.$scope.$watch(this.expression, function(newValue, oldValue) {
              if (newValue !== $element[0].getAttribute(attributeName))
                $element[0].setAttribute(attributeName, newValue);
            });
            return;
          }
          if (property.substr(0, 6) === "class.") {
            var className = property.substr(6);
            this.$scope.$watch(this.expression, function(newValue, oldValue) {
              if (newValue)
                $element[0].classList.add(className);
              else
                $element[0].classList.remove(className);
            });
            return;
          }
          if (property.substr(0, 6) === "style.") {
            var _a = property.substr(6).split("."),
                styleName = _a[0],
                units = _a[1];
            this.$scope.$watch(this.expression, function(newValue, oldValue) {
              if (units)
                newValue = newValue + units;
              if (newValue !== $element[0].style[styleName])
                $element[0].style[styleName] = newValue;
            });
            return;
          }
          var component = $element.controller(AngularHelpers_1.directiveNormalize($element[0].localName));
          if (component && component.constructor.$componentMetadata) {
            if (component.constructor.$componentMetadata.inputs && component.constructor.$componentMetadata.inputs.indexOf(property) >= 0) {
              this.$scope.$watch(this.expression, function(newValue, oldValue) {
                var propertyExpression = $parse(property);
                if (newValue !== propertyExpression(component)) {
                  propertyExpression.assign(component, newValue);
                  ChangeDetection_1.registerChange(component, property, new ChangeDetection_1.SimpleChange(oldValue, newValue));
                }
              });
            } else
              console.log("Error processing property binding " + binding);
            return;
          } else {
            this.$scope.$watch(this.expression, function(newValue, oldValue) {
              if (newValue !== $element[0][property])
                $element[0][property] = newValue;
            });
            return;
          }
        };
        NgPropertyBinding = __decorate([Ng2Emulation_1.Directive({
          selector: "ng-property-binding",
          priority: -1000
        }), __param(0, Ng2Emulation_1.Inject("$parse")), __param(1, Ng2Emulation_1.Inject("$element")), __param(2, Ng2Emulation_1.Inject("$attrs")), __param(3, Ng2Emulation_1.Inject("$scope")), __param(4, Ng2Emulation_1.Inject("$interpolate")), __metadata('design:paramtypes', [Function, Object, Object, Object, Function])], NgPropertyBinding);
        return NgPropertyBinding;
      })();
      exports_1("NgPropertyBinding", NgPropertyBinding);
    }
  };
});

System.register("Core/ControllerDecorator.js", ["./ChangeDetection"], function(exports_1) {
  var ChangeDetection_1;
  function decorateController(app) {
    app.config(["$provide", function($provide) {
      $provide.decorator("$controller", ["$delegate", function($delegate) {
        var origDelegate = $delegate;
        return function(_class, scope) {
          var component = origDelegate.apply(this, arguments);
          if (typeof component.ngOnDestroy === 'function')
            scope.$on("$destroy", component.ngOnDestroy.bind(component));
          ChangeDetection_1.registerComponentInstance(component.instance);
          return component;
        };
      }]);
    }]);
  }
  return {
    setters: [function(ChangeDetection_1_1) {
      ChangeDetection_1 = ChangeDetection_1_1;
    }],
    execute: function() {
      exports_1("default", decorateController);
    }
  };
});

System.register("Core/ChangeDetection.js", [], function(exports_1) {
  var SimpleChange,
      componentChanges,
      componentInstances;
  function getComponentChanges(component) {
    for (var i = 0; i < componentChanges.length; i++) {
      if (componentChanges[i].component === component)
        return componentChanges[i];
    }
    var newComponentChanges = {
      component: component,
      changes: {}
    };
    componentChanges.push(newComponentChanges);
    return newComponentChanges;
  }
  exports_1("getComponentChanges", getComponentChanges);
  function registerChange(component, propertyName, simpleChange) {
    var changes = getComponentChanges(component);
    changes[propertyName] = simpleChange;
  }
  exports_1("registerChange", registerChange);
  function removeChanges() {
    exports_1("componentChanges", componentChanges = []);
  }
  exports_1("removeChanges", removeChanges);
  function registerComponentInstance(component) {
    componentInstances.push(component);
  }
  exports_1("registerComponentInstance", registerComponentInstance);
  return {
    setters: [],
    execute: function() {
      SimpleChange = (function() {
        function SimpleChange(previousValue, currentValue) {
          this.previousValue = previousValue;
          this.currentValue = currentValue;
        }
        SimpleChange.prototype.isFirstChange = function() {
          return typeof this.previousValue === "undefined";
        };
        return SimpleChange;
      })();
      exports_1("SimpleChange", SimpleChange);
      exports_1("componentChanges", componentChanges = []);
      exports_1("componentInstances", componentInstances = []);
    }
  };
});

System.register("Core/LifeCycle/LifeCycleHooks.js", ["../ChangeDetection"], function(exports_1) {
  var ChangeDetection_1;
  var onEndDigestPhase;
  function initLifeCycleHooks(app) {
    app.run(["$rootScope", function($rootScope) {
      var hasRegistered = false;
      $rootScope.$watch(function() {
        if (onEndDigestPhase) {
          onEndDigestPhase = false;
          return;
        }
        if (hasRegistered)
          return;
        hasRegistered = true;
        $rootScope.$$postDigest(function() {
          hasRegistered = false;
          onEndDigestPhase = true;
          onEndDigest();
          $rootScope.$applyAsync();
        });
      });
    }]);
  }
  exports_1("initLifeCycleHooks", initLifeCycleHooks);
  function callOnInit(component) {
    if (component && !component.$$ng2emu$Init && typeof component.ngOnInit === "function") {
      component.ngOnInit();
      component.$$ng2emu$Init = true;
    }
  }
  function onEndDigest() {
    for (var i = 0; i < ChangeDetection_1.componentChanges.length; i++) {
      var cmpChanges = ChangeDetection_1.componentChanges[i];
      var component = cmpChanges.component;
      if (typeof component.ngOnChanges === "function") {
        component.ngOnChanges(cmpChanges);
      }
      callOnInit(component);
    }
    ChangeDetection_1.removeChanges();
    for (var i = 0; i < ChangeDetection_1.componentInstances.length; i++) {
      var cmp = ChangeDetection_1.componentInstances[i];
      callOnInit(cmp);
    }
  }
  return {
    setters: [function(ChangeDetection_1_1) {
      ChangeDetection_1 = ChangeDetection_1_1;
    }],
    execute: function() {
      onEndDigestPhase = false;
    }
  };
});

System.register("Core/Bootstrap.js", ["./Angular1Wrapper", "../Templates/HttpInterceptor", "./ParseDecorator", "../Directives/NgProperty", "../Directives/NgEventBinding", "../Directives/NgPropertyBinding", "./ControllerDecorator", "./LifeCycle/LifeCycleHooks"], function(exports_1) {
  var Angular1Wrapper_1,
      HttpInterceptor_1,
      ParseDecorator_1,
      NgProperty_1,
      NgEventBinding_1,
      NgPropertyBinding_1,
      ControllerDecorator_1,
      LifeCycleHooks_1;
  var BootStrapper;
  function bootstrap(component, angular1DependendModules) {
    BootStrapper.BootStrap(component, angular1DependendModules);
  }
  exports_1("bootstrap", bootstrap);
  return {
    setters: [function(Angular1Wrapper_1_1) {
      Angular1Wrapper_1 = Angular1Wrapper_1_1;
    }, function(HttpInterceptor_1_1) {
      HttpInterceptor_1 = HttpInterceptor_1_1;
    }, function(ParseDecorator_1_1) {
      ParseDecorator_1 = ParseDecorator_1_1;
    }, function(NgProperty_1_1) {
      NgProperty_1 = NgProperty_1_1;
    }, function(NgEventBinding_1_1) {
      NgEventBinding_1 = NgEventBinding_1_1;
    }, function(NgPropertyBinding_1_1) {
      NgPropertyBinding_1 = NgPropertyBinding_1_1;
    }, function(ControllerDecorator_1_1) {
      ControllerDecorator_1 = ControllerDecorator_1_1;
    }, function(LifeCycleHooks_1_1) {
      LifeCycleHooks_1 = LifeCycleHooks_1_1;
    }],
    execute: function() {
      BootStrapper = (function() {
        function BootStrapper() {}
        BootStrapper.AddService = function(service) {
          this.services.push(service);
        };
        BootStrapper.BootStrap = function(component, angular1DependendModules) {
          Angular1Wrapper_1.Angular1Wrapper.createModule(angular1DependendModules);
          HttpInterceptor_1.default(Angular1Wrapper_1.Angular1Wrapper.app);
          ParseDecorator_1.default(Angular1Wrapper_1.Angular1Wrapper.app);
          ControllerDecorator_1.default(Angular1Wrapper_1.Angular1Wrapper.app);
          Angular1Wrapper_1.Angular1Wrapper.registerDirective(NgEventBinding_1.NgEventBinding);
          Angular1Wrapper_1.Angular1Wrapper.registerDirective(NgPropertyBinding_1.NgPropertyBinding);
          Angular1Wrapper_1.Angular1Wrapper.registerDirective(NgProperty_1.NgProperty);
          Angular1Wrapper_1.Angular1Wrapper.registerServices(BootStrapper.services);
          Angular1Wrapper_1.Angular1Wrapper.registerComponent(component);
          LifeCycleHooks_1.initLifeCycleHooks(Angular1Wrapper_1.Angular1Wrapper.app);
          Angular1Wrapper_1.Angular1Wrapper.bootstrap();
        };
        BootStrapper.services = [];
        return BootStrapper;
      })();
      exports_1("BootStrapper", BootStrapper);
    }
  };
});
