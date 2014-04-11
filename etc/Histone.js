module.exports = (function (O) {
    var e =
        function () {
            function e(a) {
                var a = a.split("/"),
                    g = "" === a[0],
                    f = [],
                    i = "";
                for (g && a.shift(); a.length;) i = a.shift(), ".." === i ? f.pop() : "." !== i && f.push(i);
                g && f.unshift("");
                ("." === i || ".." === i) && f.push("");
                return f.join("/")
            }

            function o(a) {
                return "string" === typeof a
            }

            function n(a) {
                return a instanceof Array
            }

            function a(a) {
                return a instanceof Object
            }

            function i(a) {
                a = a.match(k);
                return {
                    scheme: a[1] || "",
                    authority: a[2] || "",
                    path: a[3] || "",
                    query: a[4] || "",
                    fragment: a[5] || ""
                }
            }

            function g() {
                return null !== r ? r : "object" === typeof process &&
                    (r = "node") || "object" === typeof Packages && "function" === typeof JavaImporter && (r = "rhino") || "undefined" !== typeof window && (r = "browser") || (r = "unknown")
            }
            var f = 0,
                v = 0,
                r = null,
                h = null,
                j = /^(.*)\//,
                k = /^(?:([^:\/?\#]+):)?(?:\/\/([^\/?\#]*))?([^?\#]*)(?:\?([^\#]*))?(?:\#(.*))?/;
            return {
                T_UNDEFINED: 1,
                T_NULL: 2,
                T_BOOLEAN: 3,
                T_NUMBER: 4,
                T_STRING: 5,
                T_FUNCTION: 6,
                T_ARRAY: 7,
                T_OBJECT: 8,
                isUndefined: function (a) {
                    return void 0 === a
                },
                isNull: function (a) {
                    return null === a
                },
                isBoolean: function (a) {
                    return "boolean" === typeof a
                },
                isNumber: function (a) {
                    return "number" ===
                        typeof a
                },
                isString: o,
                isArray: n,
                isObject: a,
                isFunction: function (a) {
                    return a instanceof Function
                },
                isNumeric: function (a) {
                    return !isNaN(parseFloat(a)) && isFinite(a)
                },
                isDOMElement: function (a) {
                    try {
                        return a instanceof HTMLElement
                    } catch (e) {
                        return "object" === typeof a && 1 === a.nodeType
                    }
                },
                getBaseType: function (a) {
                    if (null === a) return 2;
                    if (a instanceof Array) return 7;
                    switch (typeof a) {
                    case "undefined":
                        return 1;
                    case "boolean":
                        return 3;
                    case "number":
                        return 4;
                    case "string":
                        return 5;
                    case "function":
                        return 6;
                    case "object":
                        return 8
                    }
                },
                uniqueId: function (a) {
                    o(a) || (a = "");
                    var e = (new Date).getTime();
                    e > f ? v = 0 : e += ++v;
                    f = e;
                    return a + e.toString(36) + (1 + Math.floor(32767 * Math.random())).toString(36) + (1 + Math.floor(32767 * Math.random())).toString(36)
                },
                getEnvType: g,
                getEnvInfo: function () {
                    if (null !== h) return h;
                    var a = g();
                    if ("node" === a) return h = process.versions;
                    if ("browser" === a) return h = window.navigator.userAgent;
                    if ("rhino" === a) return a = java.lang.System, h = {
                        "os.arch": "" + a.getProperty("os.arch"),
                        "os.name": "" + a.getProperty("os.name"),
                        "os.version": "" + a.getProperty("os.version"),
                        "java.vendor": "" + a.getProperty("java.vendor"),
                        "java.version": "" + a.getProperty("java.version"),
                        "java.vendor.url": "" + a.getProperty("java.vendor.url")
                    }
                },
                forEachAsync: function (a, e, g) {
                    a instanceof Object || g();
                    var f, i, h, v, k = -1,
                        r = 0,
                        o = !1;
                    a instanceof Array ? h = a.length : (f = Object.keys(a), h = f.length);
                    v = h - 1;
                    var n = function () {
                        r += 1;
                        if (!o) {
                            for (o = !0; 0 < r;) {
                                r -= 1;
                                k += 1;
                                if (k === h) return g();
                                i = f ? f[k] : k;
                                e(a[i], function (a) {
                                    !0 === a ? g() : n()
                                }, i, k, v)
                            }
                            o = !1
                        }
                    };
                    n()
                },
                objectFlatten: function (e) {
                    function g(e, q) {
                        if (a(q)) i.push(e), f(q), i.pop();
                        else {
                            var e = i.concat(e),
                                k = e.shift();
                            e.length && (k = k + "[" + e.join("]["), k += "]");
                            h[k] = q
                        }
                    }

                    function f(e) {
                        if (n(e))
                            for (var i = 0; i < e.length; i++) g(i, e[i]);
                        else if (a(e))
                            for (i in e) e.hasOwnProperty(i) && g(i, e[i]);
                        else return e
                    }
                    var i = [],
                        h = {};
                    f(e);
                    return h
                },
                uri: {
                    parse: i,
                    resolve: function (a, g, f) {
                        var a = i(a),
                            g = i(g),
                            h = "",
                            k = "";
                        if (a.scheme) {
                            h += a.scheme + ":";
                            if (k = a.authority) h += "//" + k;
                            if (k = e(a.path)) h += k;
                            if (k = a.query) h += "?" + k
                        } else {
                            if (k = g.scheme) h += k + ":";
                            if (k = a.authority) {
                                h += "//" + k;
                                if (k = e(a.path || "")) h += k;
                                if (k = a.query) h += "?" +
                                    k
                            } else {
                                if (k = g.authority) h += "//" + k;
                                if (k = a.path) {
                                    if (k = e("/" === k.charAt(0) ? k : (g.authority && !g.path ? "/" : (g.path.match(j) || [""])[0]) + k)) h += k;
                                    if (k = a.query) h += "?" + k
                                } else {
                                    if (k = g.path) h += k;
                                    if ((k = a.query) || (k = g.query)) h += "?" + k
                                }
                            }
                        }
                        f && (h += f);
                        if (k = a.fragment) h += "#" + k;
                        return h
                    },
                    parseQuery: function (a) {
                        var e = {};
                        if (!o(a)) return {};
                        for (var a = a.split("&"), g, f = a.length, h = 0; h < f; h++) g = a[h].split("=", 2), e[g[0]] = g[1];
                        return e
                    }
                }
            }
    }(),
    x = function () {
        var e = -1,
            o = 0,
            n = 2,
            a = 3,
            i = function () {
                function g() {
                    if (p !== F)
                        if (s = k[z], K = s[0].exec(q)) {
                            E =
                                K.length;
                            for (J = 1; J < E; J++)
                                if (P = K[J]) {
                                    H = K.index;
                                    if (B = H - p) I = u.push({
                                        type: o,
                                        pos: p,
                                        value: q.substr(p, B)
                                    }), p += B;
                                    B = P.length;
                                    p = H + B;
                                    C = s[1][J - 1];
                                    switch (C[0]) {
                                    case n:
                                        I = u.push({
                                            type: C[1],
                                            pos: H,
                                            value: P
                                        });
                                        break;
                                    case a:
                                        I = u.push({
                                            type: C[1],
                                            pos: H,
                                            len: B
                                        });
                                        break;
                                    default:
                                        g()
                                    }
                                    break
                                }
                        } else {
                            if (B = F - p) I = u.push({
                                type: o,
                                pos: p,
                                value: q.substr(p, B)
                            }), p += B
                        } else I = u.push({
                            type: e,
                            value: "EOF",
                            pos: F
                        })
                }

                function f() {
                    I || g();
                    I--;
                    A = u.shift();
                    x = A.type;
                    if (h.hasOwnProperty(x)) {
                        var a = h[x];
                        "function" === typeof a && (a = a());
                        z !== a && (k[a][0].lastIndex =
                            k[z][0].lastIndex, z = a)
                    }
                }

                function i(a, e, g) {
                    "object" !== typeof a && (a = [a]);
                    void 0 === g && (g = 0);
                    g instanceof Array || (g = [g]);
                    r++;
                    for (var f = 0; f < g.length; f++) {
                        var h = g[f];
                        j[h] || (j[h] = []);
                        k[h] || (k[h] = [
                            [],
                            []
                        ]);
                        j[h].push("(" + a.join("|") + ")");
                        k[h][1].push([e, r])
                    }
                    return r
                }
                var r = 0,
                    h = {}, j = {}, k = {}, q, F, p, u, I, A, x, z, K, E, J, H, P, B, s, C;
                this.addToken = function (a, e) {
                    return i(a, n, e)
                };
                this.addLiteral = function (e, g) {
                    return i(e, a, g)
                };
                this.addIgnore = function (a, e) {
                    return i(a, 1, e)
                };
                this.tokenize = function (a, e) {
                    p = 0;
                    u = [];
                    I = 0;
                    x = A = null;
                    q =
                        a;
                    F = a.length;
                    void 0 === e && (e = 0);
                    z = e;
                    for (e in k) k[e][0] = RegExp(j[e].join("|"), "g");
                    f()
                };
                this.addTransition = function (a, e) {
                    void 0 === e && (e = 0);
                    h[a] = e
                };
                this.getLineNumber = function () {
                    for (var a = -1, e = 1, g, f = A.pos; ++a < f;) g = q.charCodeAt(a), (10 === g || 13 === g) && e++;
                    return e
                };
                this.getFragment = function () {
                    return A.value ? A.value : q.substr(A.pos, A.len)
                };
                this.test = function (a) {
                    return A.type === a
                };
                this.next = function (a) {
                    if (void 0 === a || this.test(a)) return a = A, f(), a
                }
            };
        i.T_EOF = e;
        i.T_FRAGMENT = o;
        return i
    }(),
    z = {
        version: "1.0.6"
    }, j =
        function () {
            function e() {
                a = new x;
                h = a.addLiteral("{{\\*", g);
                j = a.addLiteral("\\*}}", v);
                k = a.addLiteral("{{%", g);
                q = a.addLiteral("%}}", r);
                F = a.addToken("{{", [g, f]);
                p = a.addToken("}}", [g, f]);
                u = a.addLiteral("is\\b", f);
                z = a.addLiteral("or\\b", f);
                A = a.addLiteral("and\\b", f);
                O = a.addLiteral("not\\b", f);
                aa = a.addLiteral("mod\\b", f);
                E = a.addLiteral("this\\b", f);
                J = a.addLiteral("self\\b", f);
                H = a.addLiteral("global\\b", f);
                K = a.addLiteral("null\\b", f);
                P = a.addLiteral("true\\b", f);
                B = a.addLiteral("false\\b", f);
                s = a.addLiteral("call\\b",
                    f);
                C = a.addLiteral("import\\b", f);
                T = a.addLiteral("if\\b", f);
                U = a.addLiteral("elseif\\b", f);
                L = a.addLiteral("else\\b", f);
                S = a.addLiteral("for\\b", f);
                V = a.addLiteral("in\\b", f);
                W = a.addLiteral("var\\b", f);
                Q = a.addLiteral("macro\\b", f);
                ba = a.addToken(["(?:[0-9]*\\.)?[0-9]+[eE][\\+\\-]?[0-9]+", "[0-9]*\\.[0-9]+"], f);
                ca = a.addToken("[0-9]+", f);
                X = a.addLiteral("isNot\\b", f);
                w = a.addLiteral("<=", f);
                c = a.addLiteral(">=", f);
                b = a.addLiteral("<", f);
                d = a.addLiteral(">", f);
                l = a.addLiteral("\\[", f);
                t = a.addLiteral("\\]", f);
                y = a.addLiteral("\\(",
                    f);
                M = a.addLiteral("\\)", f);
                ja = a.addLiteral("\\?", f);
                ka = a.addLiteral("=", f);
                da = a.addLiteral(":", f);
                Y = a.addLiteral(",", f);
                la = a.addLiteral("\\.", f);
                ea = a.addLiteral("\\+", f);
                fa = a.addLiteral("\\-", f);
                ma = a.addLiteral("\\*", f);
                D = a.addLiteral("\\/", f);
                ga = a.addToken(["'(?:[^'\\\\]|\\\\.)*'", '"(?:[^"\\\\]|\\\\.)*"'], f);
                N = a.addToken("[a-zA-Z_$][a-zA-Z0-9_$]*", f);
                a.addIgnore("[\t\n\r ]+", f);
                a.addTransition(h, v);
                a.addTransition(j, g);
                a.addTransition(k, r);
                a.addTransition(q, g);
                a.addTransition(F, function () {
                    var c =
                        i % 2 ? g : f;
                    i++;
                    return c
                });
                a.addTransition(p, function () {
                    if (0 === i) return g;
                    var c = i % 2 ? g : f;
                    i--;
                    return c
                })
            }

            function o(c) {
                c = c.slice(1, -1);
                return c.replace(n || (n = RegExp("\\\\(t|b|n|r|f|'|\"|\\\\|\\x[0-9A-F]{2}|\\u[0-9A-F]{4})", "g")), function (c, a) {
                    switch (a[0]) {
                    case "'":
                        return "'";
                    case '"':
                        return '"';
                    case "\\":
                        return "\\";
                    case "b":
                        return String.fromCharCode(8);
                    case "t":
                        return String.fromCharCode(9);
                    case "n":
                        return String.fromCharCode(10);
                    case "f":
                        return String.fromCharCode(12);
                    case "r":
                        return String.fromCharCode(13);
                    case "u":
                        return String.fromCharCode(parseInt(a.substr(1), 16));
                    case "x":
                        return String.fromCharCode(parseInt(a.substr(1), 16))
                    }
                })
            }
            var n, a, i, g = 0,
                f = 1,
                v = 2,
                r = 3,
                h, j, k, q, F, p, u, z, A, O, aa, K, E, J, H, P, B, s, C, T, U, L, S, V, W, Q, ba, ca, X, w, c, b, d, l, t, y, M, ja, ka, da, Y, la, ea, fa, ma, D, ga, N, m = function () {
                    function f(c, b) {
                        var b = b || a.getFragment(),
                            d = a.getLineNumber(),
                            e = ha + "(" + d + ') Syntax error, "' + c + '" expected, but "' + b + '" found';
                        return {
                            file: ha,
                            line: d,
                            expected: c,
                            found: b,
                            toString: function () {
                                return e
                            }
                        }
                    }

                    function r() {
                        if (a.next(K)) return [m.T_NULL];
                        if (a.next(P)) return [m.T_TRUE];
                        if (a.next(B)) return [m.T_FALSE];
                        if (a.test(ca)) {
                            var c = a.next(),
                                c = parseInt(c.value, 10);
                            return [m.T_INT, c]
                        }
                        if (a.test(ba)) return c = a.next(), c = parseFloat(c.value, 10), [m.T_DOUBLE, c];
                        if (a.test(ga)) return c = a.next(), c = o(c.value), [m.T_STRING, c];
                        if (a.next(l)) {
                            var c = [],
                                b, d;
                            if (!a.test(t))
                                for (;;) {
                                    b = null;
                                    d = G();
                                    if (a.next(da)) {
                                        if (d[0] !== m.T_STRING && d[0] !== m.T_INT && (d[0] !== m.T_SELECTOR || 1 !== d[1].length)) throw new f("identifier, string, number");
                                        b = d[0] !== m.T_SELECTOR ? "" + d[1] : "" + d[1][0];
                                        d = G()
                                    }
                                    c.push([b, d]);
                                    if (!a.next(Y)) break
                                }
                            if (!a.next(t)) throw new f("]");
                            return [m.T_MAP, c]
                        }
                        if (a.test(N)) return c = a.next(), [m.T_SELECTOR, [c.value]];
                        if (a.next(E)) return [m.T_SELECTOR, ["this"]];
                        if (a.next(J)) return [m.T_SELECTOR, ["self"]];
                        if (a.next(H)) return [m.T_SELECTOR, ["global"]];
                        if (a.next(y)) {
                            if (a.next(M)) throw new f("expression", "()");
                            try {
                                c = G()
                            } finally {
                                if (!a.next(M)) throw new f(")");
                            }
                            return c
                        }
                        if (a.next(F)) {
                            for (c = []; !a.next(x.T_EOF);)
                                if (a.next(F)) c.push(na());
                                else {
                                    if (a.next(p)) return [m.T_STATEMENTS, c];
                                    a.test(x.T_EOF) || c.push(a.next().value)
                                }
                            throw new f("}}");
                        }
                        throw new f("expression");
                    }

                    function v() {
                        var c;
                        if (!(c = a.next(O) && [m.T_NOT, v()])) {
                            a.next(ea);
                            for (c = a.next(fa) ? [m.T_NEGATE, r()] : r();;)
                                if (a.next(la)) {
                                    if (!a.test(N)) throw new f("identifier");
                                    c[0] !== m.T_SELECTOR && (c = [m.T_SELECTOR, [c]]);
                                    c[1].push(a.next().value)
                                } else if (a.next(l)) {
                                if (a.next(t)) throw new f("expression", "[]");
                                c[0] !== m.T_SELECTOR && (c = [m.T_SELECTOR, [c]]);
                                c[1].push(G());
                                if (!a.next(t)) throw new f("]");
                            } else if (c[0] === m.T_SELECTOR && a.next(y)) {
                                var b =
                                    null,
                                    d;
                                if (!a.next(M)) {
                                    for (b = []; !(b.push(G()), !a.next(Y)););
                                    if (!a.next(M)) throw new f(")");
                                }
                                d = c[1].pop();
                                c = [m.T_CALL, c[1].length ? c : null, d, b]
                            } else break
                        }
                        return c
                    }

                    function n() {
                        for (var c = v(); a.next(ma) && (c = [m.T_MUL, c, v()]) || a.next(D) && (c = [m.T_DIV, c, v()]) || a.next(aa) && (c = [m.T_MOD, c, v()]););
                        return c
                    }

                    function Z() {
                        for (var c = n(); a.next(ea) && (c = [m.T_ADD, c, n()]) || a.next(fa) && (c = [m.T_SUB, c, n()]););
                        return c
                    }

                    function ia() {
                        var e = Z();
                        return a.next(w) && [m.T_LESS_OR_EQUAL, e, Z()] || a.next(b) && [m.T_LESS_THAN, e, Z()] ||
                            a.next(c) && [m.T_GREATER_OR_EQUAL, e, Z()] || a.next(d) && [m.T_GREATER_THAN, e, Z()] || e
                    }

                    function $() {
                        for (var c = ia(); a.next(u) && (c = [m.T_EQUAL, c, ia()]) || a.next(X) && (c = [m.T_NOT_EQUAL, c, ia()]););
                        return c
                    }

                    function oa() {
                        for (var c = $(); a.next(A) && (c = [m.T_AND, c, $()]););
                        return c
                    }

                    function G() {
                        var c;
                        for (c = oa(); a.next(z) && (c = [m.T_OR, c, oa()]););
                        for (; a.next(ja);) c = [m.T_TERNARY, c, G()], a.next(da) && c.push(G());
                        return c
                    }

                    function na() {
                        var c;
                        if (a.next(T)) {
                            c = [];
                            for (var b, d;;) {
                                b = G();
                                if (!a.next(p)) throw new f("}}");
                                d = R(D, L, U);
                                c.push([b,
                                    d
                                ]);
                                if (!a.next(U)) break
                            }
                            if (a.next(L)) {
                                if (!a.next(p)) throw new f("}}");
                                d = R(D);
                                c.push([
                                    [m.T_TRUE], d
                                ])
                            }
                            if (!a.next(D) || !a.next(T) || !a.next(p)) throw new f("{{/if}}");
                            c = [m.T_IF, c]
                        } else c = void 0; if (!c) {
                            if (a.next(S)) {
                                c = a.next(N);
                                if (!c) throw new f("identifier");
                                c = [c.value];
                                if (a.next(da)) {
                                    b = a.next(N);
                                    if (!b) throw new f("identifier");
                                    c.unshift(b.value)
                                }
                                if (!a.next(V)) throw new f("in");
                                b = G();
                                if (!a.next(p)) throw new f("}}");
                                d = [R(D, L)];
                                if (a.next(L)) {
                                    if (!a.next(p)) throw new f("}}");
                                    d.push(R(D))
                                }
                                if (!a.next(D) || !a.next(S) || !a.next(p)) throw new f("{{/for}}");
                                c = [m.T_FOR, c, b, d]
                            } else c = void 0; if (!c) {
                                if (a.next(W)) {
                                    c = a.next(N);
                                    if (!c) throw new f("identifier");
                                    if (a.next(ka)) {
                                        if (b = G(), !a.next(p)) throw new f("}}");
                                    } else {
                                        if (!a.next(p)) throw new f("}}");
                                        b = [m.T_STATEMENTS, R(D)];
                                        if (!a.next(D) || !a.next(W) || !a.next(p)) throw new f("{{/var}}");
                                    }
                                    c = [m.T_VAR, c.value, b]
                                } else c = void 0; if (!c) {
                                    if (a.next(Q)) {
                                        c = a.next(N);
                                        if (!c) throw new f("identifier");
                                        b = [];
                                        if (a.next(y) && !a.next(M)) {
                                            for (;;) {
                                                d = a.next(N);
                                                if (!d) throw new f("identifier");
                                                b.push(d.value);
                                                if (!a.next(Y)) break
                                            }
                                            if (!a.next(M)) throw new f(")");
                                        }
                                        if (!a.next(p)) throw new f("}}");
                                        d = R(D);
                                        if (!a.next(D) || !a.next(Q) || !a.next(p)) throw new f("{{/macro}}");
                                        c = [m.T_MACRO, c.value, b, d]
                                    } else c = void 0; if (!c) {
                                        if (a.next(s)) {
                                            c = a.next(N);
                                            if (!c) throw new f("identifier");
                                            b = [];
                                            if (a.next(y) && !a.next(M)) {
                                                for (; !(b.push(G()), !a.next(Y)););
                                                if (!a.next(M)) throw new f(")");
                                            }
                                            if (!a.next(p)) throw new f("}}");
                                            b.push([m.T_STATEMENTS, R(D)]);
                                            if (!a.next(D) || !a.next(s) || !a.next(p)) throw new f("{{/call}}");
                                            c = [m.T_CALL, null, c.value,
                                                b
                                            ]
                                        } else c = void 0; if (!c) {
                                            if (a.next(C)) {
                                                c = a.next(ga);
                                                if (!c) throw new f("string");
                                                c = o(c.value);
                                                if (!a.next(p)) throw new f("}}");
                                                c = [m.T_IMPORT, c]
                                            } else c = void 0; if (!c && (c = G(), !a.next(p))) throw new f("}}");
                                        }
                                    }
                                }
                            }
                        }
                        return c
                    }

                    function R() {
                        for (var c = -1, b = []; !a.next(x.T_EOF);) {
                            for (; a.next(h);) {
                                for (; !a.test(j) && !a.next(x.T_EOF);) a.next();
                                if (!a.next(j)) throw new f("*}}");
                            }
                            for (; a.next(k);) {
                                for (var d = ""; !a.test(q) && !a.next(x.T_EOF);) d += a.next().value;
                                if (!a.next(q)) throw new f("%}}"); - 1 === c ? (c = b.length, b.push(d)) : b[c] +=
                                    d
                            }
                            if (a.next(F)) {
                                if (d = Array.prototype.slice.call(arguments)) {
                                    for (var e = !1; d.length;)
                                        if (a.test(d.shift())) {
                                            e = !0;
                                            break
                                        }
                                    if (e) break
                                }
                                a.next(p) || (c = -1, b.push(na()))
                            } else a.test(x.T_EOF) || (-1 === c ? (c = b.length, b.push(a.next().value)) : b[c] += a.next().value)
                        }
                        return b
                    }
                    var ha;
                    this.parse = function (c, b) {
                        i = 0;
                        ha = b || "template";
                        a || e();
                        a.tokenize(c, g);
                        return R()
                    }
                };
            m.T_OR = 1;
            m.T_AND = 2;
            m.T_EQUAL = 3;
            m.T_NOT_EQUAL = 4;
            m.T_LESS_OR_EQUAL = 5;
            m.T_LESS_THAN = 6;
            m.T_GREATER_OR_EQUAL = 7;
            m.T_GREATER_THAN = 8;
            m.T_ADD = 9;
            m.T_SUB = 10;
            m.T_MUL = 11;
            m.T_DIV = 12;
            m.T_MOD = 13;
            m.T_NEGATE = 14;
            m.T_NOT = 15;
            m.T_TRUE = 16;
            m.T_FALSE = 17;
            m.T_NULL = 100;
            m.T_INT = 101;
            m.T_DOUBLE = 102;
            m.T_STRING = 103;
            m.T_TERNARY = 104;
            m.T_SELECTOR = 105;
            m.T_CALL = 106;
            m.T_MAP = 107;
            m.T_STATEMENTS = 109;
            m.T_IMPORT = 110;
            m.T_IF = 1E3;
            m.T_VAR = 1001;
            m.T_FOR = 1002;
            m.T_MACRO = 1003;
            return m
    }(),
    $ = function () {
        function e(o) {
            this.baseURI = "";
            this.vars = [{}];
            this.macros = [{}];
            this.stackPointer = 0;
            this.context = o
        }
        e.prototype.setBaseURI = function (e) {
            this.baseURI = e
        };
        e.prototype.getBaseURI = function () {
            return this.baseURI
        };
        e.prototype.putVar =
            function (e, n) {
                this.vars[this.stackPointer][e] = n
        };
        e.prototype.getVar = function (e, n) {
            var a = this.vars,
                i, g = this.stackPointer;
            do
                if (i = a[g], i.hasOwnProperty(e)) return n(i[e], !0); while (g--);
            n()
        };
        e.prototype.putMacro = function (e, n, a, i) {
            this.macros[this.stackPointer][e] = [n, a, i]
        };
        e.prototype.getMacro = function (e) {
            var n = this.macros,
                a, i = this.stackPointer;
            do
                if (a = n[i], a.hasOwnProperty(e)) return a[e]; while (i--)
        };
        e.prototype.save = function () {
            this.vars.push({});
            this.macros.push({});
            this.stackPointer++
        };
        e.prototype.restore =
            function () {
                this.vars.pop();
                this.macros.pop();
                this.stackPointer--
        };
        e.prototype.clone = function () {
            for (var j = new e(this.context), n, a = this.stackPointer + 1, i = this.vars, g = this.macros, f = Array(a), v = Array(a); a--;) {
                f[a] = {};
                v[a] = {};
                for (n in i[a]) f[a][n] = i[a][n];
                for (n in g[a]) v[a][n] = g[a][n]
            }
            j.vars = f;
            j.macros = v;
            return j
        };
        return e
    }(),
    u = function () {
        function j(e, a, i) {
            if (Array.prototype.indexOf) return e.indexOf(a, i);
            void 0 === i && (i = 0);
            0 > i && (i += e.length);
            0 > i && (i = 0);
            for (var g = e.length; i < g; i++)
                if (i in e && e[i] === a) return i;
            return -1
        }
        var o = function () {
            var n = -1,
                a = [],
                i = [];
            this.concat = function (g) {
                if (!(g instanceof this.constructor)) return this;
                n = 0;
                for (var f = [], v = [], r = g.keys(), g = g.values(), h = 0; h < i.length; h++) {
                    var j = a[h];
                    e.isNumeric(j) ? f.push(n++) : f.push(j);
                    v.push(i[h])
                }
                for (h = 0; h < g.length; h++) j = r[h], e.isNumeric(j) ? f.push(n++) : f.push(j), v.push(g[h]);
                n--;
                a = f;
                i = v;
                return this
            };
            this.length = function () {
                return i.length
            };
            this.keys = function () {
                return a
            };
            this.values = function () {
                return i
            };
            this.hasKey = function (g) {
                return !e.isString(g) && !e.isNumber(g) ? !1 : -1 !== j(a, "" + g)
            };
            this.join = function (a) {
                e.isString(a) || (a = "");
                return i.join(a)
            };
            this.get = function (g) {
                if (e.isString(g) || e.isNumber(g)) return g = j(a, "" + g), -1 === g ? void 0 : i[g]
            };
            this.set = function (g, f) {
                if (e.isString(g) || e.isNumber(g)) {
                    var g = "" + g,
                        v = j(a, g); - 1 === v ? (e.isNumeric(g) && g > n && (n = parseInt(g)), a.push(g), i.push(f)) : i[v] = f
                } else g = "" + ++n, a.push(g), i.push(f);
                return this
            };
            this.remove = function (g) {
                if (!e.isString(g) && !e.isNumber(g)) return this;
                g = j(a, "" + g);
                if (-1 === g) return this;
                a.splice(g, 1);
                i.splice(g, 1);
                return this
            };
            this.clone = function () {
                var e, f, j, r = a.length,
                    h = new o;
                for (j = 0; j < r; j++) e = a[j], f = i[j], h.set(e, f);
                return h
            };
            this.slice = function (g, f) {
                var j = i.length;
                e.isNumber(g) || (g = 0);
                0 > g && (g = j + g);
                0 > g && (g = 0);
                if (g >= j) return a = [], i = [], this;
                e.isNumber(f) || (f = 0);
                0 === f && (f = j - g);
                0 > f && (f = j - g + f);
                if (0 >= f) return a = [], i = [], this;
                a = a.slice(g, g + f);
                i = i.slice(g, g + f);
                return this
            };
            this.toObject = function () {
                var g, f = a.length,
                    j, r, h = 0,
                    n = !0;
                for (j = 0; j < f; j++) {
                    r = a[j];
                    if (!e.isNumeric(r) || h !== parseInt(r)) {
                        n = !1;
                        break
                    }
                    h++
                }
                g = n ? [] : {};
                for (j =
                    0; j < f; j++) h = i[j], h instanceof this.constructor && (h = h.toObject()), n ? g.push(h) : (r = a[j], g[r] = h);
                return g
            }
        };
        return o
    }(),
    sa = function () {
        function j() {
            for (var a = !1, e = 0; e < i.length; e++) {
                try {
                    a = i[e]()
                } catch (n) {
                    continue
                }
                break
            }
            return a
        }

        function o(a, f, i, r) {
            var h = j();
            if (!h) return i();
            e.isObject(r) || (r = {});
            var n = r.hasOwnProperty("method") && e.isString(r.method) && r.method || "GET",
                k = r.hasOwnProperty("headers") && e.isObject(r.headers) && r.headers || {}, q = null;
            r.hasOwnProperty("data") && !e.isUndefined(r.data) && (q = r.data, e.isObject(q) ||
                (q = "" + q));
            try {
                h.open(n, a, !0);
                for (var o in k) k.hasOwnProperty(o) && h.setRequestHeader(o, k[o]);
                h.onreadystatechange = function () {
                    if (4 === h.readyState) {
                        var a = h.status;
                        if (399 < a && 600 > a) return i();
                        f(h.responseText)
                    }
                };
                if (e.isObject(q)) {
                    var a = [],
                        p;
                    for (p in q) q.hasOwnProperty(p) && a.push(p + "=" + encodeURIComponent(q[p]));
                    q = a.join("&");
                    h.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
                }
                h.send(q)
            } catch (u) {
                i()
            }
        }

        function n(a) {
            delete window[a];
            a = document.getElementById(a);
            a.parentNode.removeChild(a)
        }

        function a(a, f, i) {
            var j = [],
                a = e.uri.parse(a),
                h = e.uri.parseQuery(a.query),
                o = e.uniqueId("callback");
            h.callback = o;
            for (var k in h) h.hasOwnProperty(k) && j.push(k + "=" + h[k]);
            var a = (a.scheme ? a.scheme + "://" : "") + (a.authority ? a.authority : "") + (a.path ? a.path : "") + (j.length ? "?" + j.join("&") : "") + (a.fragment ? "#" + a.fragment : ""),
                q = n.bind(this, o);
            window[o] = function (a) {
                q();
                f(a)
            };
            j = document.createElement("script");
            j.setAttribute("id", o);
            j.setAttribute("src", a);
            j.setAttribute("type", "text/javascript");
            j.onerror = function () {
                q();
                i()
            };
            document.getElementsByTagName("head")[0].appendChild(j)
        }
        var i = [
            function () {
                return new XMLHttpRequest
            },
            function () {
                return new ActiveXObject("Msxml2.XMLHTTP")
            },
            function () {
                return new ActiveXObject("Msxml3.XMLHTTP")
            },
            function () {
                return new ActiveXObject("Microsoft.XMLHTTP")
            }
        ];
        return function (e, f, i, j, h) {
            h ? a(e, f, i, j) : o(e, f, i, j)
        }
    }(),
    ta = function () {
        function j(a, g, i, h, o, k) {
            if (300 < k.statusCode && 400 > k.statusCode && k.headers.location) return k = e.uri.parse(k.headers.location), k.authority || (k.authority = a.authority),
            n((k.scheme ? k.scheme + "://" : "") + (k.authority ? k.authority : "") + (k.path ? k.path : "") + (k.query ? "?" + k.query : "") + (k.fragment ? "#" + k.fragment : ""), g, i, h, o);
            var q = "";
            k.on("end", function () {
                g(q)
            });
            k.on("data", function (a) {
                q += a
            })
        }

        function o(a, n, r, h, o) {
            var k = "",
                q = a.query;
            e.isObject(h) || (h = {});
            o && (q && (q += "&"), q = q + "callback=" + e.uniqueId("callback"));
            q && (q = "?" + q);
            q = {
                host: a.authority,
                path: a.path + q,
                method: h.hasOwnProperty("method") && e.isString(h.method) && h.method || "GET",
                headers: h.hasOwnProperty("headers") && e.isObject(h.headers) &&
                    h.headers || {}
            };
            if (h.hasOwnProperty("data") && !e.isUndefined(h.data))
                if (k = h.data, e.isObject(k)) {
                    var u = [],
                        p;
                    for (p in k) k.hasOwnProperty(p) && u.push(p + "=" + encodeURIComponent(k[p]));
                    k = u.join("&");
                    q.headers["Content-type"] = "application/x-www-form-urlencoded"
                } else k = "" + k;
            p = ("http" === a.scheme && (i = i || require("http")) || "https" === a.scheme && (g = g || require("https"))).request(q, Function.prototype.bind.apply(j, Array.prototype.concat.apply(this, arguments)));
            p.on("error", function () {
                r()
            });
            p.write(k);
            p.end()
        }

        function n(f,
            g, i, h, j) {
            var k = e.uri.parse(f);
            try {
                "http" === k.scheme || "https" === k.scheme ? o(k, g, i, h, j) : "" === k.scheme ? (a = a || require("fs"), a.readFile(f, function (a, e) {
                    if (a) return i();
                    g(e.toString())
                })) : i()
            } catch (n) {
                i()
            }
        }
        var a = null,
            i = null,
            g = null;
        return n
    }(),
    ua = function () {
        return function (j, o, n) {
            var a = e.uri.parse(j);
            try {
                if ("http" === a.scheme || "https" === a.scheme) {
                    var i = readUrl(j);
                    o(i)
                } else "" === a.scheme ? (i = readFile(j), o(i)) : n()
            } catch (g) {
                n()
            }
        }
    }();
    return function () {
        function x(c) {
            switch (e.getBaseType(c)) {
            case e.T_BOOLEAN:
                return c;
            case e.T_NUMBER:
                return 0 !== c;
            case e.T_STRING:
                return 0 < c.length;
            case e.T_OBJECT:
                return c instanceof u;
            default:
                return !1
            }
        }

        function o(c) {
            switch (e.getBaseType(c)) {
            case e.T_UNDEFINED:
                return "";
            case e.T_NULL:
            case e.T_STRING:
            case e.T_BOOLEAN:
                return "" + c;
            case e.T_NUMBER:
                c = ("" + c).toLowerCase();
                if (-1 === c.indexOf("e")) return c;
                var c = c.split("e"),
                    a = c[0],
                    d = c[1],
                    c = a[0],
                    l = d[0];
                "+" === c || "-" === c ? a = a.substr(1) : c = "";
                "+" === l || "-" === l ? d = d.substr(1) : l = "+";
                var t, y;
                t = a.indexOf("."); - 1 === t ? (y = 0, t = a.length) : (y = a.substr(t + 1).length,
                    t = a.substr(0, t).length, a = a.replace(/\./g, ""));
                t = d - t;
                "+" === l && (t = d - y);
                y = "";
                for (d = 0; d < t; d++) y += "0";
                return "+" === l ? c + a + y : c + "0." + y + a
            }
            if (e.isObject(c) && c instanceof u) {
                a = [];
                l = c.values();
                for (d = 0; d < l.length; d++) c = l[d], e.isUndefined(c) || a.push(o(c));
                return a.join(" ")
            }
            return ""
        }

        function n(c, a, d, l, t) {
            var y = e.uri.resolve(c, a);
            L.hasOwnProperty(y) ? d(L[y], y) : X(y, function (c) {
                c = d(c, y);
                e.isUndefined(c) || (L[y] = c)
            }, function () {
                d(void 0, y)
            }, l, t)
        }

        function a(c) {
            if (e.isString(c) && c.match(/^\s*\[\s*\[\s*"HISTONE"/)) try {
                c =
                    JSON.parse(c)
            } catch (a) {}
            return c
        }

        function i(c, a, d, l, t) {
            try {
                if (e.isFunction(S) && !0 === S(c, a, function (a, b) {
                    e.isString(b) || (b = c);
                    d(a, b)
                }, l)) return
            } catch (y) {}
            n(c, a, d, l, t)
        }

        function g(c) {
            if (!e.isFunction(c)) {
                if (!e.isObject(c) || c instanceof u) return c;
                var a = new u,
                    d;
                for (d in c) Object.prototype.hasOwnProperty.call(c, d) && a.set(d, g(c[d]));
                return a
            }
        }

        function f(c) {
            if (e.isObject(c)) {
                if (c instanceof u) return c.toObject();
                for (var a in c) c[a] = f(c[a])
            }
            return c
        }

        function v(c, a, d) {
            var l = c;
            switch (e.getBaseType(c)) {
            case e.T_NULL:
                l =
                    w.Type;
                break;
            case e.T_BOOLEAN:
                l = w.Type;
                break;
            case e.T_UNDEFINED:
                l = w.Type;
                break;
            case e.T_NUMBER:
                l = w.Number;
                break;
            case e.T_STRING:
                l = w.String
            }
            e.isObject(c) && c instanceof u && (l = w.Map);
            if (Object.prototype.hasOwnProperty.call(l, a)) return l[a];
            if (w.Type.hasOwnProperty(a)) return w.Type[a];
            if (d && l.hasOwnProperty("")) return l[""]
        }

        function r(c, a, d) {
            var l = new u;
            e.forEachAsync(c, function (c, d) {
                s(c[1], a, function (a) {
                    l.set(c[0], a);
                    d()
                })
            }, function () {
                d(l)
            })
        }

        function h(c, a, d) {
            s(c, a, function (c) {
                d(!x(c))
            })
        }

        function qa(c,
            a, d, e) {
            s(c, d, function (c) {
                x(c) ? e(c) : s(a, d, e)
            })
        }

        function k(c, a, d, e) {
            s(c, d, function (c) {
                x(c) ? s(a, d, e) : e(c)
            })
        }

        function q(c, a, d, e, t) {
            s(c, e, function (c) {
                x(c) ? s(a, e, t) : d ? s(d, e, t) : t()
            })
        }

        function F(c, a, d, l) {
            s(c, d, function (c) {
                s(a, d, function (a) {
                    e.isString(c) && e.isNumber(a) ? e.isNumeric(c) ? a = o(a) : c = parseFloat(c, 10) : e.isNumber(c) && e.isString(a) && (e.isNumeric(a) ? c = o(c) : a = parseFloat(a, 10));
                    if (!e.isString(c) || !e.isString(a)) e.isNumber(c) && e.isNumber(a) ? (c = parseFloat(c), a = parseFloat(a)) : (c = x(c), a = x(a));
                    l(c === a)
                })
            })
        }

        function p(c, a, d, l, t) {
            s(a, l, function (a) {
                s(d, l, function (b) {
                    e.isString(a) && e.isNumber(b) ? e.isNumeric(a) ? a = parseFloat(a, 10) : b = o(b) : e.isNumber(a) && e.isString(b) && (e.isNumeric(b) ? b = parseFloat(b, 10) : a = o(a));
                    if (!e.isNumber(a) || !e.isNumber(b)) e.isString(a) && e.isString(b) ? (a = a.length, b = b.length) : (a = x(a), b = x(b));
                    switch (c) {
                    case j.T_LESS_THAN:
                        t(a < b);
                        break;
                    case j.T_GREATER_THAN:
                        t(a > b);
                        break;
                    case j.T_LESS_OR_EQUAL:
                        t(a <= b);
                        break;
                    case j.T_GREATER_OR_EQUAL:
                        t(a >= b)
                    }
                })
            })
        }

        function pa(c, a, d, l) {
            s(c, d, function (c) {
                s(a, d,
                    function (a) {
                        if (!e.isString(c) && !e.isString(a)) {
                            if (e.isNumber(c) || e.isNumber(a)) {
                                e.isNumeric(c) && (c = parseFloat(c, 10));
                                if (!e.isNumber(c)) return l();
                                e.isNumeric(a) && (a = parseFloat(a, 10));
                                return !e.isNumber(a) ? l() : l(c + a)
                            }
                            if (c instanceof u && a instanceof u) {
                                var b = c.clone(),
                                    b = b.concat(a);
                                return l(b)
                            }
                        }
                        c = o(c);
                        a = o(a);
                        l(c + a)
                    })
            })
        }

        function I(c, a, d, l, f) {
            s(a, l, function (a) {
                e.isNumeric(a) && (a = parseFloat(a, 10));
                if (!e.isNumber(a)) return f();
                if (c === j.T_NEGATE) return f(-a);
                s(d, l, function (b) {
                    e.isNumeric(b) && (b = parseFloat(b,
                        10));
                    if (!e.isNumber(b)) return f();
                    switch (c) {
                    case j.T_SUB:
                        f(a - b);
                        break;
                    case j.T_MUL:
                        f(a * b);
                        break;
                    case j.T_DIV:
                        f(a / b);
                        break;
                    case j.T_MOD:
                        f(a % b)
                    }
                })
            })
        }

        function A(c, a, d, e) {
            d.save();
            s(a, d, function (a) {
                d.restore();
                d.putVar(c, a);
                e("")
            })
        }

        function ra(c, a, d, e, f) {
            e.putMacro(c, a, d, e.getBaseURI());
            f("")
        }

        function aa(c, a, d) {
            var l = "";
            e.forEachAsync(c, function (c, d) {
                s(c[0], a, function (e) {
                    if (!x(e)) return d();
                    a.save();
                    C(c[1], a, function (c) {
                        l = c;
                        a.restore();
                        d(!0)
                    })
                })
            }, function () {
                d(l)
            })
        }

        function K(c, a, d, l, f) {
            s(a, l, function (a) {
                if (a instanceof u && a.length()) {
                    var b = "",
                        h, i = a.keys(),
                        a = a.values();
                    e.forEachAsync(a, function (a, e, f, t, j) {
                        l.save();
                        l.putVar(c[0], g(a));
                        c[1] && l.putVar(c[1], i[t]);
                        h = {
                            last: j,
                            index: t
                        };
                        l.putVar("self", g(h));
                        C(d[0], l, function (c) {
                            b += c;
                            l.restore();
                            e()
                        })
                    }, function () {
                        f(b)
                    })
                } else d[1] ? (l.save(), C(d[1], l, function (c) {
                    l.restore();
                    f(c)
                })) : f("")
            })
        }

        function E(c, a, d, l) {
            var f, h;
            e.forEachAsync(a, function (a, b) {
                s(a, d, function (a) {
                    f = c;
                    if (h = v(c, a, !0))
                        if (e.isFunction(h)) try {
                            h.call(d, f, [a], function (a) {
                                c = g(a);
                                b()
                            })
                        } catch (l) {
                            c = void 0, b()
                        } else c =
                            g(h), b();
                        else return c = void 0, b(!0)
                })
            }, function () {
                l(c)
            })
        }

        function J(c, a, d) {
            var l, f = c.slice(1),
                g = c[0];
            if (!e.isString(g)) return s(g, a, function (c) {
                E(c, f, a, d)
            });
            if ("global" === g) return E(w.Global, f, a, d);
            if ("this" === g) return E(a.context, f, a, d);
            a.getVar(g, function (c, h) {
                if (h) return E(c, f, a, d);
                if (w.Global.hasOwnProperty(g)) return E(w.Global, [g].concat(f), a, d);
                l = a.context;
                if (e.isObject(l) && l instanceof u && l.hasKey(g)) return E(l, [g].concat(f), a, d);
                E(void 0, f, a, d)
            })
        }

        function H(c, a, d, e) {
            var f = c[0],
                h = c[1],
                c = c[2],
                i = d.getBaseURI(),
                j = {
                    arguments: a
                };
            d.save();
            d.setBaseURI(c);
            d.putVar("self", g(j));
            c = 0;
            for (j = f.length; c < j; c++) c >= a.length ? d.putVar(f[c], void 0) : d.putVar(f[c], g(a[c]));
            return C(h, d, function (a) {
                d.setBaseURI(i);
                d.restore();
                e(a)
            })
        }

        function P(a, b, d, l, h) {
            s(b, l, function (b) {
                var i = [];
                e.isArray(d) || (d = []);
                e.forEachAsync(d, function (a, c) {
                    s(a, l, function (a) {
                        i.push(a);
                        c()
                    })
                }, function () {
                    var d = null;
                    if (e.isNull(a)) {
                        if (d = l.getMacro(b)) return H(d, i, l, h);
                        a = w.Global
                    }
                    s(a, l, function (a) {
                        if (d = v(a, b))
                            if (e.isFunction(d)) try {
                                d.call(l,
                                    a, f(i), function (a) {
                                        h(g(a))
                                    })
                            } catch (c) {
                                h()
                            } else h(g(d));
                            else return h()
                    })
                })
            })
        }

        function B(c, b, d) {
            var e = b.getBaseURI();
            b.imports || (b.imports = {});
            var f = c + "#" + e;
            if (b.imports.hasOwnProperty(f)) return d();
            b.imports[f] = !0;
            i(c, e, function (c, f) {
                try {
                    return c = a(c), c = w(c, f), b.setBaseURI(f), T(c.getAST(), b, function () {
                        b.setBaseURI(e);
                        d("")
                    }), c
                } catch (g) {
                    d()
                }
            })
        }

        function s(a, b, d) {
            if (!e.isArray(a)) return d(a);
            var f = a[0];
            switch (f) {
            case j.T_INT:
            case j.T_STRING:
            case j.T_DOUBLE:
                d(a[1]);
                break;
            case j.T_SELECTOR:
                J(a[1], b, d);
                break;
            case j.T_VAR:
                A(a[1], a[2], b, d);
                break;
            case j.T_IF:
                aa(a[1], b, d);
                break;
            case j.T_CALL:
                P(a[1], a[2], a[3], b, d);
                break;
            case j.T_TERNARY:
                q(a[1], a[2], a[3], b, d);
                break;
            case j.T_IMPORT:
                B(a[1], b, d);
                break;
            case j.T_EQUAL:
            case j.T_NOT_EQUAL:
                F(a[1], a[2], b, function (a) {
                    d(f === j.T_EQUAL ? a : !a)
                });
                break;
            case j.T_STATEMENTS:
                C(a[1], b, d);
                break;
            case j.T_MACRO:
                ra(a[1], a[2], a[3], b, d);
                break;
            case j.T_MAP:
                r(a[1], b, d);
                break;
            case j.T_ADD:
                pa(a[1], a[2], b, d);
                break;
            case j.T_FOR:
                K(a[1], a[2], a[3], b, d);
                break;
            case j.T_TRUE:
                d(!0);
                break;
            case j.T_FALSE:
                d(!1);
                break;
            case j.T_OR:
                qa(a[1], a[2], b, d);
                break;
            case j.T_AND:
                k(a[1], a[2], b, d);
                break;
            case j.T_NULL:
                d(null);
                break;
            case j.T_NOT:
                h(a[1], b, d);
                break;
            case j.T_SUB:
            case j.T_MUL:
            case j.T_DIV:
            case j.T_MOD:
            case j.T_NEGATE:
                I(f, a[1], a[2], b, d);
                break;
            case j.T_LESS_THAN:
            case j.T_GREATER_THAN:
            case j.T_LESS_OR_EQUAL:
            case j.T_GREATER_OR_EQUAL:
                p(f, a[1], a[2], b, d);
                break;
            default:
                throw d(), 'unsupported template instruction "' + o(a) + '"';
            }
        }

        function C(a, b, d) {
            var f = "";
            e.forEachAsync(a, function (a, c) {
                e.isArray(a) ?
                    s(a, b, function (a) {
                        f += o(a);
                        c()
                    }) : (f += a, c())
            }, function () {
                d(f)
            })
        }

        function T(a, b, d) {
            C(a[1], b, d)
        }

        function U(a, b) {
            e.isString(b) || (b = ".");
            this.getAST = function () {
                return a
            };
            this.render = function () {
                var d = void 0,
                    l = null,
                    h = null,
                    i = [],
                    j = null,
                    d = Array.prototype.slice.call(arguments);
                e.isString(d[0]) && (j = d.shift());
                null !== j && !e.isFunction(d[0]) && (i = d.shift(), e.isArray(i) || (i = [i]));
                e.isFunction(d[0]) && (l = d.shift());
                d[0] instanceof $ ? h = d.shift() : (d = g(d[0]), h = new $(d));
                h.setBaseURI(b);
                T(a, h, function (a) {
                    if (null !== j) {
                        a = h.getMacro(j);
                        if (!a) return l(void 0, h);
                        H(a, i, h, function (a) {
                            l(f(a), h)
                        })
                    } else l(a, h)
                })
            }
        }
        var L = {}, S = null,
            V = null,
            W = ["HISTONE", z],
            Q = e.getEnvType(),
            ba = "javascript/" + Q,
            ca = e.getEnvInfo(),
            X = "node" === Q && ta || "rhino" === Q && ua || "browser" === Q && sa,
            w = function (a, b) {
                if (e.isString(a)) V || (V = new j), a = V.parse(a, b), a = [W, a];
                else if (a instanceof U) a = a.getAST();
                else {
                    if (e.isDOMElement(a)) return a = a.text || a.textContent, w(a, b);
                    if (!e.isArray(a)) throw '"' + a + '" is not a string';
                }
                return new U(a, b)
            };
        w.OrderedMap = u;
        w.Type = {
            isUndefined: function (a,
                b, d) {
                d(e.isUndefined(a))
            },
            isNull: function (a, b, d) {
                d(e.isNull(a))
            },
            isBoolean: function (a, b, d) {
                d(e.isBoolean(a))
            },
            isNumber: function (a, b, d) {
                d(e.isNumber(a))
            },
            isString: function (a, b, d) {
                d(e.isString(a))
            },
            isMap: function (a, b, d) {
                d(e.isObject(a) && a instanceof u)
            },
            toJSON: function (a, b, d) {
                if (e.isUndefined(a)) return d("null");
                d(JSON.stringify(a))
            },
            toMap: function (a, b, d) {
                if (a instanceof u) return d(a);
                d((new u).set(null, a))
            },
            toString: function (a, b, d) {
                d(o(a))
            },
            toBoolean: function (a, b, d) {
                d(x(a))
            }
        };
        w.Number = {
            isInteger: function (a,
                b, d) {
                d(0 === a % 1)
            },
            isFloat: function (a, b, d) {
                d(0 !== a % 1)
            },
            toChar: function (a, b, d) {
                d(String.fromCharCode(a))
            },
            toFixed: function (a, b, d) {
                b = b[0];
                e.isNumber(b) && 0 <= b ? (b = Math.pow(10, b || 0), d(Math.round(a * b) / b)) : d(a)
            },
            abs: function (a, b, d) {
                d(Math.abs(a))
            },
            floor: function (a, b, d) {
                d(Math.floor(a))
            },
            ceil: function (a, b, d) {
                d(Math.ceil(a))
            },
            round: function (a, b, d) {
                d(Math.round(a))
            },
            pow: function (a, b, d) {
                b = b[0];
                if (!e.isNumber(b)) return d();
                a = Math.pow(a, b);
                if (isNaN(a)) return d();
                d(a)
            },
            log: function (a, b, d) {
                if (0 >= a) return d();
                b = b[0];
                a = e.isNumber(b) && 0 < b ? Math.log(a) / Math.log(b) : Math.log(a);
                if (isNaN(a) || !isFinite(a)) return d();
                d(a)
            }
        };
        w.String = {
            "": function (a, b, d) {
                b = parseFloat(b[0], 10);
                if (isNaN(b)) return d();
                var e = a.length;
                0 > b && (b = e + b);
                if (0 !== b % 1 || 0 > b || b >= e) return d();
                d(a[b])
            },
            size: function (a, b, d) {
                d(a.length)
            },
            strip: function (a, b, d) {
                for (var f = "", g; b.length;) g = b.shift(), e.isString(g) && (f += g);
                0 === f.length && (f = " \n\r\t");
                b = -1;
                for (g = a.length; b < g && -1 !== f.indexOf(a.charAt(++b)););
                for (; 0 <= g && -1 !== f.indexOf(a.charAt(--g)););
                d(a.slice(b, g +
                    1))
            },
            slice: function (a, b, d) {
                var f = b[0],
                    b = b[1],
                    g = a.length;
                e.isNumber(f) || (f = 0);
                0 > f && (f = g + f);
                0 > f && (f = 0);
                f < g ? (e.isNumber(b) || (b = 0), 0 === b && (b = g - f), 0 > b && (b = g - f + b), 0 >= b ? d("") : d(a.substr(f, b))) : d("")
            },
            test: function (a, b, d) {
                b = b[0];
                d(e.isString(b) && null !== a.match(b))
            },
            match: function (a, b, d) {
                b = b[0];
                if (!e.isString(b)) return d(!1);
                a = a.match(b);
                if (e.isNull(a)) return d(!1);
                d(Array.prototype.slice.call(a, 0))
            },
            toLowerCase: function (a, b, d) {
                d(a.toLowerCase())
            },
            toUpperCase: function (a, b, d) {
                d(a.toUpperCase())
            },
            split: function (a,
                b, d) {
                b = b[0];
                d(a.split(e.isString(b) ? b : ""))
            },
            charCodeAt: function (a, b, d) {
                b = parseFloat(b[0], 10);
                if (isNaN(b)) return d();
                var e = a.length;
                0 > b && (b = e + b);
                if (0 !== b % 1 || 0 > b || b >= e) return d();
                d(a.charCodeAt(b))
            },
            toNumber: function (a, b, d) {
                e.isNumeric(a) ? d(parseFloat(a, 10)) : d()
            }
        };
        w.Map = {
            "": function (a, b, d) {
                d(a.get(b[0]))
            },
            size: function (a, b, d) {
                d(a.length())
            },
            join: function (a, b, d) {
                d(a.join(b[0]))
            },
            resize: function (a, b, d) {
                var f = b[0],
                    b = b[1],
                    a = a.clone(),
                    g = a.keys(),
                    h = g.length;
                if (!e.isNumber(f) || f === h) return d(a);
                if (f > h)
                    for (g =
                        0; g < f - h; g++) a.set(null, b);
                else if (f < h)
                    for (f = h - f; f--;) a.remove(g.pop());
                return d(a)
            },
            search: function (a, b, d) {
                var f = b[0],
                    g = b[1],
                    b = a.keys(),
                    a = a.values();
                e.isNumber(g) || (g = 0);
                if (0 <= g && g > a.length || 0 > g && Math.abs(g) > a.length) return d(void 0);
                if (0 <= g)
                    for (; g < a.length; g++) {
                        if (a[g] === f) return d(b[g])
                    } else if (0 > g)
                        for (g = a.length + g; 0 <= g; g--)
                            if (a[g] === f) return d(b[g]);
                d(void 0)
            },
            set: function (a, b, d) {
                var f = b[0],
                    b = b[1],
                    a = a.clone();
                if (!e.isString(f) && !e.isNumeric(f)) return d(a);
                a.set(f, b);
                d(a)
            },
            keys: function (a, b, d) {
                d(a.keys())
            },
            values: function (a, b, d) {
                d(a.values())
            },
            hasKey: function (a, b, d) {
                d(a.hasKey(b[0]))
            },
            remove: function (a, b, d) {
                for (var e = a.clone(); b.length;) a = b.shift(), e.remove(a);
                d(e)
            },
            slice: function (a, b, d) {
                var e = b[0],
                    b = b[1],
                    a = a.clone();
                a.slice(e, b);
                d(a)
            },
            toQueryString: function (a, b, d) {
                var f, g = [],
                    h = b[0],
                    i = b[1],
                    a = a.toObject(),
                    a = e.objectFlatten(a);
                e.isString(h) || (h = "");
                e.isString(i) || (i = "&");
                if (e.isArray(a))
                    for (f = 0; f < a.length; f++) b = a[f], e.isUndefined(b) || (b = o(b), b = encodeURIComponent(b), g.push(h + f + "=" + b));
                else if (e.isObject(a))
                    for (f in a) a.hasOwnProperty(f) &&
                        (b = a[f], e.isUndefined(b) || (b = o(b), b = encodeURIComponent(b), e.isNumeric(f) && (f = h + f), g.push(f + "=" + b)));
                d(g.join(i))
            },
            toJSON: function (a, b, d) {
                d(JSON.stringify(a.toObject()))
            }
        };
        w.Global = {
            clientType: ba,
            clientInfo: z,
            userAgent: ca,
            baseURI: function (a, b, d) {
                d(this.getBaseURI())
            },
            resolveURI: function (a, b, d) {
                d(e.uri.resolve(b[0], b[1]))
            },
            isMap: function (a, b, d) {
                d(!0)
            },
            uniqueId: function (a, b, d) {
                d(e.uniqueId())
            },
            loadJSON: function (a, b, d) {
                var a = b.shift(),
                    f = !e.isBoolean(b[0]) && b.shift(),
                    h = e.isBoolean(b[0]) && b[0],
                    b = this.getBaseURI();
                i(a, b, function (a) {
                    if (!e.isString(a)) return a = g(a), d(a);
                    h && (a = a.replace(/^\s*[$A-Z_][0-9A-Z_$]*\(\s*/i, ""), a = a.replace(/\s*\);?\s*$/, ""));
                    try {
                        a = JSON.parse(a), a = g(a), d(a)
                    } catch (c) {
                        d()
                    }
                }, f, h)
            },
            loadText: function (a, b, d) {
                var a = b[0],
                    b = b[1],
                    f = this.getBaseURI();
                i(a, f, function (a) {
                    d(e.isString(a) ? a : void 0)
                }, b)
            },
            include: function (c, b, d) {
                var c = b[0],
                    e = b[1],
                    b = this.getBaseURI();
                i(c, b, function (c, b) {
                    try {
                        return c = a(c), c = w(c, b), c.render(d, g(e)), c
                    } catch (f) {
                        d()
                    }
                })
            },
            rand: function (a, b, d) {
                a = parseFloat(b[0]);
                b = parseFloat(b[1]);
                if (!e.isNumber(a) || 0 !== a % 1) a = 0;
                if (!e.isNumber(b) || 0 !== b % 1) b = Math.pow(2, 32) - 1;
                d(Math.floor(Math.random() * (b - a + 1)) + a)
            },
            min: function (a, b, d) {
                function f(a) {
                    for (var c, b, d = a.length, g, h = void 0, i = 0; i < d; i++) {
                        g = a[i];
                        if (e.isObject(g)) {
                            if (!e.isArray(g)) {
                                b = [];
                                for (c in g) b.push(g[c]);
                                g = b
                            }
                            g = f(g)
                        }
                        if (e.isNumber(g) && (e.isUndefined(h) || g < h)) h = g
                    }
                    return h
                }
                d(f(b))
            },
            max: function (a, b, d) {
                function f(a) {
                    for (var c, b, d = a.length, g, h = void 0, i = 0; i < d; i++) {
                        g = a[i];
                        if (e.isObject(g)) {
                            if (!e.isArray(g)) {
                                b = [];
                                for (c in g) b.push(g[c]);
                                g = b
                            }
                            g =
                                f(g)
                        }
                        if (e.isNumber(g) && (e.isUndefined(h) || g > h)) h = g
                    }
                    return h
                }
                d(f(b))
            },
            range: function (a, b, d) {
                var a = [],
                    f = parseFloat(b[0]),
                    b = parseFloat(b[1]);
                if (!e.isNumber(f) || !e.isNumber(b) || 0 !== f % 1 || 0 !== b % 1) return d();
                if (f > b)
                    for (; f >= b; f -= 1) a.push(f);
                else if (f < b)
                    for (; f <= b; f += 1) a.push(f);
                else a.push(f);
                d(a)
            },
            dayOfWeek: function (a, b, d) {
                var a = parseFloat(b[0]),
                    f = parseFloat(b[1]),
                    b = parseFloat(b[2]);
                if (!e.isNumber(a) || !e.isNumber(f) || !e.isNumber(b) || 0 !== a % 1 || 0 !== f % 1 || 0 !== b % 1) return d();
                var g = new Date(a, f -= 1, b);
                g.getFullYear() ==
                    a && g.getMonth() == f && g.getDate() == b ? (b = g.getDay(), d(b ? b : 7)) : d()
            },
            daysInMonth: function (a, b, d) {
                a = parseFloat(b[0]);
                b = parseFloat(b[1]);
                if (!e.isNumber(a) || !e.isNumber(b) || 0 !== a % 1 || 0 !== b % 1 || 1 > b || 12 < b) return d();
                d((new Date(a, b, 0)).getDate())
            }
        };


        w.krang = function(baseURI, pluginURI, load, krang) {
        	var resourceURI = e.uri.resolve(pluginURI, baseURI);
			X(resourceURI, function (b) {
				b = a(b);
				load(w(b, f))
			});

			// 	krang({aliases: {
			// 		'histone': Module.uri
			// 	}}).require(Utils.uri.resolve(pluginURI, baseURI), load);
			// } else Network({
			// 	key: 'tpl',
			// 	uri: pluginURI,
			// 	base: baseURI
			// }, function(templateAST, templateURI) {
			// 	load(Histone(templateAST, templateURI));
			// }, Parser);
        };


        w.setURIResolver = function (a) {
            S = e.isFunction(a) ? a : null
        };
        return w
    }()
})();