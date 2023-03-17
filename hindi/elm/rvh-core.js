(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});


// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.multiline) { flags += 'm'; }
	if (options.caseInsensitive) { flags += 'i'; }

	try
	{
		return $elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return $elm$core$Maybe$Nothing;
	}
});


// USE

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		out.push(A4($elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		return replacer(A4($elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Basics$GT = {$: 'GT'};
var $author$project$RVHCore$GenericPoem = function (a) {
	return {$: 'GenericPoem', a: a};
};
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Array$branchFactor = 32;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $author$project$RVHCore$emptyPoem = $author$project$RVHCore$GenericPoem(
	{lines: $elm$core$Array$empty, maxLineLen: 0});
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$RVHCore$init = function (flags) {
	return _Utils_Tuple2(
		{lastAction: '', poem: '', processedPoem: $author$project$RVHCore$emptyPoem},
		$elm$core$Platform$Cmd$none);
};
var $author$project$RVHCore$AdjustMaatraa = function (a) {
	return {$: 'AdjustMaatraa', a: a};
};
var $author$project$RVHCore$ProcessPoem = function (a) {
	return {$: 'ProcessPoem', a: a};
};
var $author$project$RVHCore$SetBase = function (a) {
	return {$: 'SetBase', a: a};
};
var $author$project$RVHCore$SetComposite = function (a) {
	return {$: 'SetComposite', a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$RVHCore$getMaatraaChange = _Platform_incomingPort('getMaatraaChange', $elm$json$Json$Decode$string);
var $author$project$RVHCore$getPoem = _Platform_incomingPort('getPoem', $elm$json$Json$Decode$string);
var $author$project$RVHCore$setBase = _Platform_incomingPort('setBase', $elm$json$Json$Decode$string);
var $author$project$RVHCore$setComposite = _Platform_incomingPort('setComposite', $elm$json$Json$Decode$string);
var $author$project$RVHCore$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$author$project$RVHCore$getPoem($author$project$RVHCore$ProcessPoem),
				$author$project$RVHCore$getMaatraaChange($author$project$RVHCore$AdjustMaatraa),
				$author$project$RVHCore$setComposite($author$project$RVHCore$SetComposite),
				$author$project$RVHCore$setBase($author$project$RVHCore$SetBase)
			]));
};
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Array$foldl = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldl, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldl,
			func,
			A3($elm$core$Elm$JsArray$foldl, helper, baseCase, tree),
			tail);
	});
var $elm$json$Json$Encode$array = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$Array$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $author$project$RVHFreeVerse$encodeComposite = function (c) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'originalLineIdx',
				$elm$json$Json$Encode$int(c.originalLineI)),
				_Utils_Tuple2(
				'rhythmAmtCumulative',
				$elm$json$Json$Encode$int(c.rhythm)),
				_Utils_Tuple2(
				'remainder',
				$elm$json$Json$Encode$int(c.remainder)),
				_Utils_Tuple2(
				'multipleOfBaseCount',
				$elm$json$Json$Encode$bool(c.multipleOfBase))
			]));
};
var $author$project$Akshar$Half = {$: 'Half'};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Akshar$encodeAkshar = function (a) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'txt',
				$elm$json$Json$Encode$string(a.str)),
				_Utils_Tuple2(
				'systemRhythmAmt',
				$elm$json$Json$Encode$int(a.rhythm)),
				_Utils_Tuple2(
				'rhythmAmt',
				$elm$json$Json$Encode$int(a.userRhythm)),
				_Utils_Tuple2(
				'isHalfLetter',
				_Utils_eq(a.aksharType, $author$project$Akshar$Half) ? $elm$json$Json$Encode$bool(true) : $elm$json$Json$Encode$bool(false))
			]));
};
var $author$project$RVHFreeVerse$encodeLine = function (fvl) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'rhythmAmtCumulative',
				$elm$json$Json$Encode$int(fvl.line.rhythmTotal)),
				_Utils_Tuple2(
				'subUnits',
				A2($elm$json$Json$Encode$array, $author$project$Akshar$encodeAkshar, fvl.line.units)),
				_Utils_Tuple2(
				'isComposite',
				$elm$json$Json$Encode$bool(fvl.isComposite))
			]));
};
var $author$project$RVHCore$encodeFreeVerse = F3(
	function (m, l, c) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'maxLineLen',
					$elm$json$Json$Encode$int(m)),
					_Utils_Tuple2(
					'lines',
					A2($elm$json$Json$Encode$array, $author$project$RVHFreeVerse$encodeLine, l)),
					_Utils_Tuple2(
					'compositeLines',
					A2($elm$json$Json$Encode$array, $author$project$RVHFreeVerse$encodeComposite, c)),
					_Utils_Tuple2(
					'poemType',
					$elm$json$Json$Encode$string('FREEVERSE'))
				]));
	});
var $author$project$RVHLine$encodeLine = function (al) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'rhythmAmtCumulative',
				$elm$json$Json$Encode$int(al.rhythmTotal)),
				_Utils_Tuple2(
				'subUnits',
				A2($elm$json$Json$Encode$array, $author$project$Akshar$encodeAkshar, al.units))
			]));
};
var $author$project$RVHCore$encodeGeneric = F2(
	function (m, l) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'maxLineLen',
					$elm$json$Json$Encode$int(m)),
					_Utils_Tuple2(
					'lines',
					A2($elm$json$Json$Encode$array, $author$project$RVHLine$encodeLine, l)),
					_Utils_Tuple2(
					'poemType',
					$elm$json$Json$Encode$string('GENERIC'))
				]));
	});
var $author$project$RVHGhazal$combineAksharRK = F2(
	function (a, rk) {
		return {aksharType: a.aksharType, rhythm: a.rhythm, rk: rk, str: a.str, userRhythm: a.userRhythm};
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $author$project$RVHGhazal$encodeAksharRK = function (a) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'txt',
				$elm$json$Json$Encode$string(a.str)),
				_Utils_Tuple2(
				'systemRhythmAmt',
				$elm$json$Json$Encode$int(a.rhythm)),
				_Utils_Tuple2(
				'rhythmAmt',
				$elm$json$Json$Encode$int(a.userRhythm)),
				_Utils_Tuple2(
				'isHalfLetter',
				_Utils_eq(a.aksharType, $author$project$Akshar$Half) ? $elm$json$Json$Encode$bool(true) : $elm$json$Json$Encode$bool(false)),
				_Utils_Tuple2(
				'rk',
				$elm$json$Json$Encode$string(
					$elm$core$String$fromChar(a.rk)))
			]));
};
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $elm_community$array_extra$Array$Extra$map2 = F3(
	function (combineAb, aArray, bArray) {
		return $elm$core$Array$fromList(
			A3(
				$elm$core$List$map2,
				combineAb,
				$elm$core$Array$toList(aArray),
				$elm$core$Array$toList(bArray)));
	});
var $author$project$RVHGhazal$encodeMisraa = function (m) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'rhythmAmtCumulative',
				$elm$json$Json$Encode$int(m.line.rhythmTotal)),
				_Utils_Tuple2(
				'subUnits',
				A2(
					$elm$json$Json$Encode$array,
					$author$project$RVHGhazal$encodeAksharRK,
					A3($elm_community$array_extra$Array$Extra$map2, $author$project$RVHGhazal$combineAksharRK, m.line.units, m.rkUnits)))
			]));
};
var $author$project$RVHCore$encodeGhazal = F2(
	function (m, l) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'maxLineLen',
					$elm$json$Json$Encode$int(m)),
					_Utils_Tuple2(
					'lines',
					A2($elm$json$Json$Encode$array, $author$project$RVHGhazal$encodeMisraa, l)),
					_Utils_Tuple2(
					'poemType',
					$elm$json$Json$Encode$string('GHAZAL'))
				]));
	});
var $elm$json$Json$Encode$float = _Json_wrap;
var $author$project$RVHMaatrikLine$encodeAkshar = function (a) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'txt',
				$elm$json$Json$Encode$string(a.a.str)),
				_Utils_Tuple2(
				'systemRhythmAmt',
				$elm$json$Json$Encode$int(a.a.rhythm)),
				_Utils_Tuple2(
				'rhythmAmt',
				$elm$json$Json$Encode$int(a.a.userRhythm)),
				_Utils_Tuple2(
				'isHalfLetter',
				$elm$json$Json$Encode$bool(
					_Utils_eq(a.a.aksharType, $author$project$Akshar$Half))),
				_Utils_Tuple2(
				'rhythmPatternValue',
				$elm$json$Json$Encode$float(a.patternValue))
			]));
};
var $author$project$RVHMaatrikLine$encodeLine = function (al) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'rhythmAmtCumulative',
				$elm$json$Json$Encode$int(al.rhythmTotal)),
				_Utils_Tuple2(
				'subUnits',
				A2($elm$json$Json$Encode$array, $author$project$RVHMaatrikLine$encodeAkshar, al.units))
			]));
};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$RVHPattern$encodeMaapneeUnits = function (mu) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'txt',
				(!(!mu)) ? $elm$json$Json$Encode$string(
					$elm$core$String$fromInt(mu)) : $elm$json$Json$Encode$string(' ')),
				_Utils_Tuple2(
				'systemRhythmAmt',
				$elm$json$Json$Encode$int(mu)),
				_Utils_Tuple2(
				'rhythmAmt',
				$elm$json$Json$Encode$int(mu)),
				_Utils_Tuple2(
				'isHalfLetter',
				$elm$json$Json$Encode$bool(false)),
				_Utils_Tuple2(
				'rhythmPatternValue',
				(!(!mu)) ? $elm$json$Json$Encode$int(mu) : $elm$json$Json$Encode$int(-1))
			]));
};
var $author$project$RVHPattern$encodeMaapnee = function (m) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'rhythmAmtCumulative',
				$elm$json$Json$Encode$int(m.len)),
				_Utils_Tuple2(
				'subUnits',
				A2($elm$json$Json$Encode$array, $author$project$RVHPattern$encodeMaapneeUnits, m.units))
			]));
};
var $author$project$RVHCore$encodeMaatrik = function (d) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'maxLineLen',
				$elm$json$Json$Encode$int(d.maxLineLen)),
				_Utils_Tuple2(
				'lines',
				A2($elm$json$Json$Encode$array, $author$project$RVHMaatrikLine$encodeLine, d.lines)),
				_Utils_Tuple2(
				'pattern',
				$author$project$RVHPattern$encodeMaapnee(d.maapnee)),
				_Utils_Tuple2(
				'poemType',
				$elm$json$Json$Encode$string('MAATRIK'))
			]));
};
var $author$project$RVHVarnikLine$encodeAkshar = function (a) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'txt',
				$elm$json$Json$Encode$string(a.a.str)),
				_Utils_Tuple2(
				'systemRhythmAmt',
				$elm$json$Json$Encode$int(a.a.rhythm)),
				_Utils_Tuple2(
				'rhythmAmt',
				$elm$json$Json$Encode$int(a.a.userRhythm)),
				_Utils_Tuple2(
				'isHalfLetter',
				$elm$json$Json$Encode$bool(
					_Utils_eq(a.a.aksharType, $author$project$Akshar$Half))),
				_Utils_Tuple2(
				'belongsToGan',
				$elm$json$Json$Encode$string(a.gan))
			]));
};
var $author$project$RVHVarnikLine$encodeLine = function (al) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'rhythmAmtCumulative',
				$elm$json$Json$Encode$int(al.rhythmTotal)),
				_Utils_Tuple2(
				'subUnits',
				A2($elm$json$Json$Encode$array, $author$project$RVHVarnikLine$encodeAkshar, al.units))
			]));
};
var $author$project$RVHVarnikLine$encodeMaapneeUnits = function (mu) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'txt',
				(!(!mu.u)) ? $elm$json$Json$Encode$string(
					$elm$core$String$fromInt(mu.u)) : $elm$json$Json$Encode$string(' ')),
				_Utils_Tuple2(
				'systemRhythmAmt',
				$elm$json$Json$Encode$int(mu.u)),
				_Utils_Tuple2(
				'rhythmAmt',
				$elm$json$Json$Encode$int(mu.u)),
				_Utils_Tuple2(
				'rhythmPatternValue',
				$elm$json$Json$Encode$float(
					(!mu.u) ? (-1) : mu.u)),
				_Utils_Tuple2(
				'isHalfLetter',
				$elm$json$Json$Encode$bool(false)),
				_Utils_Tuple2(
				'belongsToGan',
				$elm$json$Json$Encode$string(mu.g))
			]));
};
var $author$project$RVHVarnikLine$encodeMaapnee = function (m) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'rhythmAmtCumulative',
				$elm$json$Json$Encode$int(m.len)),
				_Utils_Tuple2(
				'subUnits',
				A2($elm$json$Json$Encode$array, $author$project$RVHVarnikLine$encodeMaapneeUnits, m.units))
			]));
};
var $author$project$RVHCore$encodeVarnik = function (p) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'maxLineLen',
				$elm$json$Json$Encode$int(p.maxLineLen)),
				_Utils_Tuple2(
				'lines',
				A2($elm$json$Json$Encode$array, $author$project$RVHVarnikLine$encodeLine, p.lines)),
				_Utils_Tuple2(
				'pattern',
				$author$project$RVHVarnikLine$encodeMaapnee(p.maapnee)),
				_Utils_Tuple2(
				'poemType',
				$elm$json$Json$Encode$string('VARNIK'))
			]));
};
var $author$project$RVHCore$encodePoem = function (p) {
	switch (p.$) {
		case 'GenericPoem':
			var data = p.a;
			return A2($author$project$RVHCore$encodeGeneric, data.maxLineLen, data.lines);
		case 'Ghazal':
			var data = p.a;
			return A2($author$project$RVHCore$encodeGhazal, data.maxLineLen, data.lines);
		case 'FreeVerse':
			var data = p.a;
			return A3($author$project$RVHCore$encodeFreeVerse, data.maxLineLen, data.lines, data.composite);
		case 'MaatrikPoem':
			var data = p.a;
			return $author$project$RVHCore$encodeMaatrik(data);
		default:
			var data = p.a;
			return $author$project$RVHCore$encodeVarnik(data);
	}
};
var $author$project$RVHCore$encodeModel = function (model) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'poem',
				$elm$json$Json$Encode$string(model.poem)),
				_Utils_Tuple2(
				'processedPoem',
				$author$project$RVHCore$encodePoem(model.processedPoem)),
				_Utils_Tuple2(
				'lastAction',
				$elm$json$Json$Encode$string(model.lastAction))
			]));
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $author$project$RVHCore$givePoemRhythm = _Platform_outgoingPort('givePoemRhythm', $elm$core$Basics$identity);
var $author$project$RVHCore$FreeVerse = function (a) {
	return {$: 'FreeVerse', a: a};
};
var $author$project$RVHCore$Ghazal = function (a) {
	return {$: 'Ghazal', a: a};
};
var $author$project$RVHLine$PoemLine = F3(
	function (str, rhythmTotal, units) {
		return {rhythmTotal: rhythmTotal, str: str, units: units};
	});
var $author$project$Akshar$Consonant = {$: 'Consonant'};
var $author$project$Akshar$PureVowel = {$: 'PureVowel'};
var $author$project$Akshar$adjustMaatraa = function (a) {
	return _Utils_eq(a.aksharType, $author$project$Akshar$Half) ? ((!a.userRhythm) ? _Utils_update(
		a,
		{userRhythm: 1}) : _Utils_update(
		a,
		{userRhythm: 0})) : (((_Utils_eq(a.aksharType, $author$project$Akshar$Consonant) || _Utils_eq(a.aksharType, $author$project$Akshar$PureVowel)) && (a.rhythm === 2)) ? ((a.userRhythm === 2) ? _Utils_update(
		a,
		{userRhythm: 1}) : _Utils_update(
		a,
		{userRhythm: 2})) : a);
};
var $author$project$Akshar$Akshar = F7(
	function (str, code, aksharType, mainChar, vowel, rhythm, userRhythm) {
		return {aksharType: aksharType, code: code, mainChar: mainChar, rhythm: rhythm, str: str, userRhythm: userRhythm, vowel: vowel};
	});
var $author$project$Akshar$Empty = {$: 'Empty'};
var $author$project$Akshar$emptyAkshar = A7(
	$author$project$Akshar$Akshar,
	' ',
	0,
	$author$project$Akshar$Empty,
	_Utils_chr(' '),
	_Utils_chr(' '),
	0,
	0);
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (_v0.$ === 'SubTree') {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$RVHLine$adjustMaatraa = F2(
	function (oldLine, aI) {
		var a = A2(
			$elm$core$Maybe$withDefault,
			$author$project$Akshar$emptyAkshar,
			A2($elm$core$Array$get, aI, oldLine.units));
		var aNew = $author$project$Akshar$adjustMaatraa(a);
		var newAkshars = A3($elm$core$Array$set, aI, aNew, oldLine.units);
		var diff = aNew.userRhythm - a.userRhythm;
		var newRhythm = oldLine.rhythmTotal + diff;
		return A3($author$project$RVHLine$PoemLine, oldLine.str, newRhythm, newAkshars);
	});
var $author$project$RVHFreeVerse$CompositeLine = F4(
	function (originalLineI, rhythm, remainder, multipleOfBase) {
		return {multipleOfBase: multipleOfBase, originalLineI: originalLineI, remainder: remainder, rhythm: rhythm};
	});
var $author$project$RVHFreeVerse$Line = F2(
	function (line, isComposite) {
		return {isComposite: isComposite, line: line};
	});
var $author$project$RVHLine$emptyLine = A3($author$project$RVHLine$PoemLine, '', 0, $elm$core$Array$empty);
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (value.$ === 'SubTree') {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $author$project$RVHFreeVerse$fvAddComposite = F4(
	function (compsiteLines, li, r0, r1) {
		var c1 = A4($author$project$RVHFreeVerse$CompositeLine, li, r0 + r1, 0, true);
		var c = A4($author$project$RVHFreeVerse$CompositeLine, li, r0, 0, true);
		return A2($elm$core$Array$push, c1, compsiteLines);
	});
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $elm$core$Basics$not = _Basics_not;
var $author$project$RVHFreeVerse$calcCompositeRhythm = F4(
	function (lines, li, compsiteLines, inProgress) {
		calcCompositeRhythm:
		while (true) {
			var line0 = A2(
				$elm$core$Maybe$withDefault,
				A2($author$project$RVHFreeVerse$Line, $author$project$RVHLine$emptyLine, false),
				A2($elm$core$Array$get, li - 1, lines));
			var line = A2(
				$elm$core$Maybe$withDefault,
				A2($author$project$RVHFreeVerse$Line, $author$project$RVHLine$emptyLine, false),
				A2($elm$core$Array$get, li, lines));
			var compositesLastI = $elm$core$Array$length(compsiteLines) - 1;
			var composite = A2(
				$elm$core$Maybe$withDefault,
				A4($author$project$RVHFreeVerse$CompositeLine, -1, 0, 0, true),
				A2($elm$core$Array$get, compositesLastI, compsiteLines));
			var newComposite = A4($author$project$RVHFreeVerse$CompositeLine, composite.originalLineI, composite.rhythm + line.line.rhythmTotal, 0, true);
			var updatedComposites = A3($elm$core$Array$set, compositesLastI, newComposite, compsiteLines);
			var addedComposites = A4($author$project$RVHFreeVerse$fvAddComposite, compsiteLines, li - 1, line0.line.rhythmTotal, line.line.rhythmTotal);
			if (_Utils_cmp(
				li,
				$elm$core$Array$length(lines)) > 0) {
				return compsiteLines;
			} else {
				if (line.isComposite) {
					if (!inProgress) {
						var $temp$lines = lines,
							$temp$li = li + 1,
							$temp$compsiteLines = addedComposites,
							$temp$inProgress = true;
						lines = $temp$lines;
						li = $temp$li;
						compsiteLines = $temp$compsiteLines;
						inProgress = $temp$inProgress;
						continue calcCompositeRhythm;
					} else {
						var $temp$lines = lines,
							$temp$li = li + 1,
							$temp$compsiteLines = updatedComposites,
							$temp$inProgress = true;
						lines = $temp$lines;
						li = $temp$li;
						compsiteLines = $temp$compsiteLines;
						inProgress = $temp$inProgress;
						continue calcCompositeRhythm;
					}
				} else {
					var $temp$lines = lines,
						$temp$li = li + 1,
						$temp$compsiteLines = compsiteLines,
						$temp$inProgress = false;
					lines = $temp$lines;
					li = $temp$li;
					compsiteLines = $temp$compsiteLines;
					inProgress = $temp$inProgress;
					continue calcCompositeRhythm;
				}
			}
		}
	});
var $author$project$RVHLine$biggerLine = F2(
	function (line1, line2) {
		return (_Utils_cmp(line1.rhythmTotal, line2.rhythmTotal) > 0) ? line1 : line2;
	});
var $author$project$RVHLine$calcMaxLineLen = function (lines) {
	return A3($elm$core$Array$foldl, $author$project$RVHLine$biggerLine, $author$project$RVHLine$emptyLine, lines).rhythmTotal;
};
var $author$project$RVHFreeVerse$fvCalcRemainderSingle = F2(
	function (compositeLine, baseCount) {
		var rhy = compositeLine.rhythm;
		var quo = rhy / baseCount;
		var intQuo = (rhy / baseCount) | 0;
		var r = quo - intQuo;
		var useR = (r < 0.5) ? (rhy - (intQuo * baseCount)) : ((((intQuo + 1) * baseCount) - rhy) * (-1));
		return (!(!useR)) ? _Utils_update(
			compositeLine,
			{multipleOfBase: false, remainder: useR}) : _Utils_update(
			compositeLine,
			{multipleOfBase: true, remainder: useR});
	});
var $author$project$RVHFreeVerse$calcRemainderWhole = F3(
	function (composites, baseCount, i) {
		calcRemainderWhole:
		while (true) {
			var line = A2(
				$elm$core$Maybe$withDefault,
				A4($author$project$RVHFreeVerse$CompositeLine, 0, 0, 0, false),
				A2($elm$core$Array$get, i, composites));
			var newLine = A2($author$project$RVHFreeVerse$fvCalcRemainderSingle, line, baseCount);
			var newComposites = A3($elm$core$Array$set, i, newLine, composites);
			if (baseCount === 1) {
				return composites;
			} else {
				if (_Utils_eq(
					i,
					$elm$core$Array$length(composites))) {
					return composites;
				} else {
					var $temp$composites = newComposites,
						$temp$baseCount = baseCount,
						$temp$i = i + 1;
					composites = $temp$composites;
					baseCount = $temp$baseCount;
					i = $temp$i;
					continue calcRemainderWhole;
				}
			}
		}
	});
var $author$project$RVHFreeVerse$fromLine = function (l) {
	return A2($author$project$RVHFreeVerse$Line, l, false);
};
var $author$project$RVHFreeVerse$fromLineWFlag = F2(
	function (l, f) {
		return A2($author$project$RVHFreeVerse$Line, l, f);
	});
var $author$project$RVHCore$MaatrikPoem = function (a) {
	return {$: 'MaatrikPoem', a: a};
};
var $author$project$RVHMaatrikLine$PoemLine = F3(
	function (str, rhythmTotal, units) {
		return {rhythmTotal: rhythmTotal, str: str, units: units};
	});
var $author$project$RVHMaatrikLine$Akshar = F2(
	function (a, patternValue) {
		return {a: a, patternValue: patternValue};
	});
var $author$project$RVHMaatrikLine$aksharFrmBA = function (a) {
	return A2($author$project$RVHMaatrikLine$Akshar, a, a.rhythm);
};
var $elm$core$Elm$JsArray$map = _JsArray_map;
var $elm$core$Array$map = F2(
	function (func, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = function (node) {
			if (node.$ === 'SubTree') {
				var subTree = node.a;
				return $elm$core$Array$SubTree(
					A2($elm$core$Elm$JsArray$map, helper, subTree));
			} else {
				var values = node.a;
				return $elm$core$Array$Leaf(
					A2($elm$core$Elm$JsArray$map, func, values));
			}
		};
		return A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A2($elm$core$Elm$JsArray$map, helper, tree),
			A2($elm$core$Elm$JsArray$map, func, tail));
	});
var $author$project$RVHMaatrikLine$fromBasicL = function (lineP) {
	return A3(
		$author$project$RVHMaatrikLine$PoemLine,
		lineP.str,
		lineP.rhythmTotal,
		A2($elm$core$Array$map, $author$project$RVHMaatrikLine$aksharFrmBA, lineP.units));
};
var $author$project$RVHMaatrikLine$emptyLine = $author$project$RVHMaatrikLine$fromBasicL($author$project$RVHLine$emptyLine);
var $author$project$RVHMaatrikLine$emptyAkshar = A2($author$project$RVHMaatrikLine$Akshar, $author$project$Akshar$emptyAkshar, 0);
var $author$project$RVHMaatrikLine$maatrikSetAksharMaapnee = F3(
	function (ac, mc, an) {
		switch (mc) {
			case 1:
				return (ac.a.userRhythm === 1) ? {
					a1: _Utils_update(
						ac,
						{patternValue: 1}),
					a2: an,
					set: 1
				} : {a1: ac, a2: an, set: 0};
			case 2:
				return (ac.a.userRhythm === 2) ? {
					a1: _Utils_update(
						ac,
						{patternValue: 2}),
					a2: an,
					set: 1
				} : (((ac.a.userRhythm === 1) && (an.a.userRhythm === 1)) ? {
					a1: _Utils_update(
						ac,
						{patternValue: 1.5}),
					a2: _Utils_update(
						an,
						{patternValue: 1.5}),
					set: 2
				} : {a1: ac, a2: an, set: 0});
			case 0:
				var _v1 = ac.a.aksharType;
				switch (_v1.$) {
					case 'Other':
						return {
							a1: _Utils_update(
								ac,
								{patternValue: -1}),
							a2: an,
							set: 1
						};
					case 'ChandraBindu':
						return {a1: ac, a2: an, set: 0};
					case 'Half':
						return (!ac.a.userRhythm) ? {a1: ac, a2: an, set: 0} : {a1: ac, a2: an, set: -1};
					default:
						return {a1: ac, a2: an, set: -1};
				}
			default:
				return {a1: ac, a2: an, set: 0};
		}
	});
var $author$project$RVHMaatrikLine$maatrikSetAksharPattern = F2(
	function (ac, an) {
		return ((ac.a.userRhythm === 1) && (an.a.userRhythm === 1)) ? {
			a1: _Utils_update(
				ac,
				{patternValue: 1.5}),
			a2: _Utils_update(
				an,
				{patternValue: 1.5}),
			changed: true
		} : {a1: ac, a2: an, changed: false};
	});
var $author$project$RVHMaatrikLine$maatrikSetLineUnitsPattern = F2(
	function (lineUnits, i) {
		maatrikSetLineUnitsPattern:
		while (true) {
			var an = A2(
				$elm$core$Maybe$withDefault,
				$author$project$RVHMaatrikLine$emptyAkshar,
				A2($elm$core$Array$get, i + 1, lineUnits));
			var ac = A2(
				$elm$core$Maybe$withDefault,
				$author$project$RVHMaatrikLine$emptyAkshar,
				A2($elm$core$Array$get, i, lineUnits));
			var result = A2($author$project$RVHMaatrikLine$maatrikSetAksharPattern, ac, an);
			var lineUnits1 = A3($elm$core$Array$set, i, result.a1, lineUnits);
			var newLineUnits = A3($elm$core$Array$set, i + 1, result.a2, lineUnits1);
			if (_Utils_cmp(
				i,
				$elm$core$Array$length(lineUnits) - 1) > 0) {
				return lineUnits;
			} else {
				if (result.changed) {
					var $temp$lineUnits = newLineUnits,
						$temp$i = i + 2;
					lineUnits = $temp$lineUnits;
					i = $temp$i;
					continue maatrikSetLineUnitsPattern;
				} else {
					var $temp$lineUnits = newLineUnits,
						$temp$i = i + 1;
					lineUnits = $temp$lineUnits;
					i = $temp$i;
					continue maatrikSetLineUnitsPattern;
				}
			}
		}
	});
var $author$project$RVHMaatrikLine$maatrikSetLineUnitsMaapnee = F4(
	function (lineUnits, i, maapnee, mi) {
		maatrikSetLineUnitsMaapnee:
		while (true) {
			var mc = A2(
				$elm$core$Maybe$withDefault,
				2,
				A2($elm$core$Array$get, mi, maapnee));
			var an = A2(
				$elm$core$Maybe$withDefault,
				$author$project$RVHMaatrikLine$emptyAkshar,
				A2($elm$core$Array$get, i + 1, lineUnits));
			var ac = A2(
				$elm$core$Maybe$withDefault,
				$author$project$RVHMaatrikLine$emptyAkshar,
				A2($elm$core$Array$get, i, lineUnits));
			var result = A3($author$project$RVHMaatrikLine$maatrikSetAksharMaapnee, ac, mc, an);
			var lineUnits1 = A3($elm$core$Array$set, i, result.a1, lineUnits);
			var newLineUnits = A3($elm$core$Array$set, i + 1, result.a2, lineUnits1);
			if (_Utils_cmp(
				i,
				$elm$core$Array$length(lineUnits) - 1) > 0) {
				return newLineUnits;
			} else {
				var _v0 = result.set;
				switch (_v0) {
					case 2:
						var $temp$lineUnits = newLineUnits,
							$temp$i = i + 2,
							$temp$maapnee = maapnee,
							$temp$mi = mi + 1;
						lineUnits = $temp$lineUnits;
						i = $temp$i;
						maapnee = $temp$maapnee;
						mi = $temp$mi;
						continue maatrikSetLineUnitsMaapnee;
					case 1:
						var $temp$lineUnits = newLineUnits,
							$temp$i = i + 1,
							$temp$maapnee = maapnee,
							$temp$mi = mi + 1;
						lineUnits = $temp$lineUnits;
						i = $temp$i;
						maapnee = $temp$maapnee;
						mi = $temp$mi;
						continue maatrikSetLineUnitsMaapnee;
					default:
						if (_Utils_eq(result.set, -1)) {
							var $temp$lineUnits = newLineUnits,
								$temp$i = i,
								$temp$maapnee = maapnee,
								$temp$mi = mi + 1;
							lineUnits = $temp$lineUnits;
							i = $temp$i;
							maapnee = $temp$maapnee;
							mi = $temp$mi;
							continue maatrikSetLineUnitsMaapnee;
						} else {
							if (!ac.a.userRhythm) {
								var $temp$lineUnits = newLineUnits,
									$temp$i = i + 1,
									$temp$maapnee = maapnee,
									$temp$mi = mi;
								lineUnits = $temp$lineUnits;
								i = $temp$i;
								maapnee = $temp$maapnee;
								mi = $temp$mi;
								continue maatrikSetLineUnitsMaapnee;
							} else {
								return A2($author$project$RVHMaatrikLine$maatrikSetLineUnitsPattern, newLineUnits, i);
							}
						}
				}
			}
		}
	});
var $author$project$RVHMaatrikLine$setLineMaapnee = F2(
	function (line, maapnee) {
		return _Utils_update(
			line,
			{
				units: A4($author$project$RVHMaatrikLine$maatrikSetLineUnitsMaapnee, line.units, 0, maapnee, 0)
			});
	});
var $author$project$RVHMaatrikLine$toBasicL = function (lineM) {
	return A3(
		$author$project$RVHLine$PoemLine,
		lineM.str,
		lineM.rhythmTotal,
		A2(
			$elm$core$Array$map,
			function ($) {
				return $.a;
			},
			lineM.units));
};
var $author$project$RVHCore$maatrikAdjustMaatraa = F3(
	function (poemData, li, ci) {
		var oldLine = A2(
			$elm$core$Maybe$withDefault,
			$author$project$RVHMaatrikLine$emptyLine,
			A2($elm$core$Array$get, li, poemData.lines));
		var newBasicLine = A2(
			$author$project$RVHLine$adjustMaatraa,
			$author$project$RVHMaatrikLine$toBasicL(oldLine),
			ci);
		var newLine = A2(
			$author$project$RVHMaatrikLine$setLineMaapnee,
			$author$project$RVHMaatrikLine$fromBasicL(newBasicLine),
			poemData.maapnee.units);
		var newLines = A3($elm$core$Array$set, li, newLine, poemData.lines);
		var newMaxLineLen = (_Utils_cmp(newLine.rhythmTotal, poemData.maxLineLen) > 0) ? newLine.rhythmTotal : poemData.maxLineLen;
		return $author$project$RVHCore$MaatrikPoem(
			{lines: newLines, maapnee: poemData.maapnee, maxLineLen: newMaxLineLen});
	});
var $author$project$RVHGhazal$Misraa = F2(
	function (line, rkUnits) {
		return {line: line, rkUnits: rkUnits};
	});
var $author$project$RVHGhazal$misraaFromLineWRK = F2(
	function (line, rk) {
		return A2($author$project$RVHGhazal$Misraa, line, rk);
	});
var $author$project$RVHVarnikLine$toBasicL = function (lineV) {
	return A3(
		$author$project$RVHLine$PoemLine,
		lineV.str,
		lineV.rhythmTotal,
		A2(
			$elm$core$Array$map,
			function ($) {
				return $.a;
			},
			lineV.units));
};
var $author$project$RVHCore$VarnikPoem = function (a) {
	return {$: 'VarnikPoem', a: a};
};
var $author$project$RVHVarnikLine$PoemLine = F3(
	function (str, rhythmTotal, units) {
		return {rhythmTotal: rhythmTotal, str: str, units: units};
	});
var $author$project$RVHVarnikLine$emptyLine = A3($author$project$RVHVarnikLine$PoemLine, '', 0, $elm$core$Array$empty);
var $author$project$RVHVarnikLine$Akshar = F3(
	function (a, gan, idx) {
		return {a: a, gan: gan, idx: idx};
	});
var $author$project$RVHVarnikLine$aksharFrmBA = function (a) {
	return A3($author$project$RVHVarnikLine$Akshar, a, '', -1);
};
var $author$project$RVHVarnikLine$fromBasicL = function (lineP) {
	return A3(
		$author$project$RVHVarnikLine$PoemLine,
		lineP.str,
		lineP.rhythmTotal,
		A2($elm$core$Array$map, $author$project$RVHVarnikLine$aksharFrmBA, lineP.units));
};
var $author$project$RVHVarnikLine$emptyAkshar = $author$project$RVHVarnikLine$aksharFrmBA($author$project$Akshar$emptyAkshar);
var $author$project$RVHVarnikLine$aReInsert0RAs = F5(
	function (la1, i1, lan, i2, la2) {
		aReInsert0RAs:
		while (true) {
			var a2 = A2(
				$elm$core$Maybe$withDefault,
				$author$project$RVHVarnikLine$emptyAkshar,
				A2($elm$core$Array$get, i2, la2));
			var a1 = A2(
				$elm$core$Maybe$withDefault,
				$author$project$RVHVarnikLine$emptyAkshar,
				A2($elm$core$Array$get, i1, la1));
			if (_Utils_cmp(
				i1,
				$elm$core$Array$length(la1)) > -1) {
				return lan;
			} else {
				if (_Utils_eq(a1.idx, a2.idx)) {
					var $temp$la1 = la1,
						$temp$i1 = i1 + 1,
						$temp$lan = A2($elm$core$Array$push, a2, lan),
						$temp$i2 = i2 + 1,
						$temp$la2 = la2;
					la1 = $temp$la1;
					i1 = $temp$i1;
					lan = $temp$lan;
					i2 = $temp$i2;
					la2 = $temp$la2;
					continue aReInsert0RAs;
				} else {
					var $temp$la1 = la1,
						$temp$i1 = i1 + 1,
						$temp$lan = A2($elm$core$Array$push, a1, lan),
						$temp$i2 = i2,
						$temp$la2 = la2;
					la1 = $temp$la1;
					i1 = $temp$i1;
					lan = $temp$lan;
					i2 = $temp$i2;
					la2 = $temp$la2;
					continue aReInsert0RAs;
				}
			}
		}
	});
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.tail)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.tail, tail);
		return (notAppended < 0) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: $elm$core$Elm$JsArray$empty
		} : {nodeList: builder.nodeList, nodeListSize: builder.nodeListSize, tail: appended});
	});
var $elm$core$Array$appendHelpTree = F2(
	function (toAppend, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		var itemsToAppend = $elm$core$Elm$JsArray$length(toAppend);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(tail)) - itemsToAppend;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, tail, toAppend);
		var newArray = A2($elm$core$Array$unsafeReplaceTail, appended, array);
		if (notAppended < 0) {
			var nextTail = A3($elm$core$Elm$JsArray$slice, notAppended, itemsToAppend, toAppend);
			return A2($elm$core$Array$unsafeReplaceTail, nextTail, newArray);
		} else {
			return newArray;
		}
	});
var $elm$core$Array$builderFromArray = function (_v0) {
	var len = _v0.a;
	var tree = _v0.c;
	var tail = _v0.d;
	var helper = F2(
		function (node, acc) {
			if (node.$ === 'SubTree') {
				var subTree = node.a;
				return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
			} else {
				return A2($elm$core$List$cons, node, acc);
			}
		});
	return {
		nodeList: A3($elm$core$Elm$JsArray$foldl, helper, _List_Nil, tree),
		nodeListSize: (len / $elm$core$Array$branchFactor) | 0,
		tail: tail
	};
};
var $elm$core$Array$append = F2(
	function (a, _v0) {
		var aTail = a.d;
		var bLen = _v0.a;
		var bTree = _v0.c;
		var bTail = _v0.d;
		if (_Utils_cmp(bLen, $elm$core$Array$branchFactor * 4) < 1) {
			var foldHelper = F2(
				function (node, array) {
					if (node.$ === 'SubTree') {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, array, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpTree, leaf, array);
					}
				});
			return A2(
				$elm$core$Array$appendHelpTree,
				bTail,
				A3($elm$core$Elm$JsArray$foldl, foldHelper, a, bTree));
		} else {
			var foldHelper = F2(
				function (node, builder) {
					if (node.$ === 'SubTree') {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, builder, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpBuilder, leaf, builder);
					}
				});
			return A2(
				$elm$core$Array$builderToArray,
				true,
				A2(
					$elm$core$Array$appendHelpBuilder,
					bTail,
					A3(
						$elm$core$Elm$JsArray$foldl,
						foldHelper,
						$elm$core$Array$builderFromArray(a),
						bTree)));
		}
	});
var $elm$core$Array$filter = F2(
	function (isGood, array) {
		return $elm$core$Array$fromList(
			A3(
				$elm$core$Array$foldr,
				F2(
					function (x, xs) {
						return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
					}),
				_List_Nil,
				array));
	});
var $author$project$RVHVarnikLine$laFilterZero = function (el) {
	return !(!el.a.userRhythm);
};
var $author$project$RVHVarnikLine$arStr = function (a) {
	return $elm$core$String$fromInt(a.a.userRhythm);
};
var $author$project$RVHVarnikLine$ganSigToGan = function (sig) {
	switch (sig) {
		case '122':
			return 'y';
		case '222':
			return 'm';
		case '221':
			return 't';
		case '212':
			return 'r';
		case '121':
			return 'j';
		case '211':
			return 'b';
		case '111':
			return 'n';
		case '112':
			return 's';
		case '1':
			return 'l';
		case '2':
			return 'g';
		default:
			return '';
	}
};
var $author$project$RVHVarnikLine$laGanSetToGanName = function (ganset) {
	var sig = A3(
		$elm$core$Array$foldr,
		$elm$core$Basics$append,
		'',
		A2($elm$core$Array$map, $author$project$RVHVarnikLine$arStr, ganset));
	return $author$project$RVHVarnikLine$ganSigToGan(sig);
};
var $author$project$RVHVarnikLine$laSetGanameToGanset = F4(
	function (gs, gn, i, ns) {
		laSetGanameToGanset:
		while (true) {
			var len = $elm$core$Array$length(gs);
			var a = A2(
				$elm$core$Maybe$withDefault,
				$author$project$RVHVarnikLine$emptyAkshar,
				A2($elm$core$Array$get, i, gs));
			var newAkshar = _Utils_update(
				a,
				{gan: gn});
			var ns1 = A2($elm$core$Array$push, newAkshar, ns);
			if (_Utils_cmp(i, len) > -1) {
				return ns;
			} else {
				var $temp$gs = gs,
					$temp$gn = gn,
					$temp$i = i + 1,
					$temp$ns = ns1;
				gs = $temp$gs;
				gn = $temp$gn;
				i = $temp$i;
				ns = $temp$ns;
				continue laSetGanameToGanset;
			}
		}
	});
var $author$project$RVHVarnikLine$laGanSetWGaname = F2(
	function (gs, gn) {
		return A4($author$project$RVHVarnikLine$laSetGanameToGanset, gs, gn, 0, $elm$core$Array$empty);
	});
var $author$project$RVHVarnikLine$laWithIdx = F3(
	function (lus, i, lus1) {
		laWithIdx:
		while (true) {
			var u = A2(
				$elm$core$Maybe$withDefault,
				$author$project$RVHVarnikLine$emptyAkshar,
				A2($elm$core$Array$get, i, lus));
			if (_Utils_cmp(
				i,
				$elm$core$Array$length(lus)) > -1) {
				return lus1;
			} else {
				var $temp$lus = lus,
					$temp$i = i + 1,
					$temp$lus1 = A2(
					$elm$core$Array$push,
					_Utils_update(
						u,
						{idx: i}),
					lus1);
				lus = $temp$lus;
				i = $temp$i;
				lus1 = $temp$lus1;
				continue laWithIdx;
			}
		}
	});
var $elm$core$Debug$log = _Debug_log;
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					len - from,
					$elm$core$Array$shiftStep,
					$elm$core$Elm$JsArray$empty,
					A3(
						$elm$core$Elm$JsArray$slice,
						from - $elm$core$Array$tailIndex(len),
						$elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / $elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (node.$ === 'SubTree') {
							var subTree = node.a;
							return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2($elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					$elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2($elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return $elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * $elm$core$Array$branchFactor);
					var initialBuilder = {
						nodeList: _List_Nil,
						nodeListSize: 0,
						tail: A3(
							$elm$core$Elm$JsArray$slice,
							firstSlice,
							$elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						$elm$core$Array$builderToArray,
						true,
						A3($elm$core$List$foldl, $elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var $elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = $elm$core$Array$bitMask & (treeEnd >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var sub = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _v0.a;
				return A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, values);
			}
		}
	});
var $elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!$elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (_v0.$ === 'SubTree') {
					var sub = _v0.a;
					var $temp$oldShift = oldShift - $elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var $elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = $elm$core$Array$bitMask & (endIdx >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (_v0.$ === 'SubTree') {
			var sub = _v0.a;
			var newSub = A3($elm$core$Array$sliceTree, shift - $elm$core$Array$shiftStep, endIdx, sub);
			return (!$elm$core$Elm$JsArray$length(newSub)) ? A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				$elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				$elm$core$Array$SubTree(newSub),
				A3($elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var $elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = $elm$core$Array$tailIndex(end);
				var depth = $elm$core$Basics$floor(
					A2(
						$elm$core$Basics$logBase,
						$elm$core$Array$branchFactor,
						A2($elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep);
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						$elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3($elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4($elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var $elm$core$Array$translateIndex = F2(
	function (index, _v0) {
		var len = _v0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var $elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2($elm$core$Array$translateIndex, to, array);
		var correctFrom = A2($elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? $elm$core$Array$empty : A2(
			$elm$core$Array$sliceLeft,
			correctFrom,
			A2($elm$core$Array$sliceRight, correctTo, array));
	});
var $elm_community$array_extra$Array$Extra$sliceFrom = function (lengthDropped) {
	return function (array) {
		return A3(
			$elm$core$Array$slice,
			lengthDropped,
			$elm$core$Array$length(array),
			array);
	};
};
var $elm_community$array_extra$Array$Extra$sliceUntil = function (lengthNew) {
	return function (array) {
		return A3(
			$elm$core$Array$slice,
			0,
			(lengthNew >= 0) ? lengthNew : ($elm$core$Array$length(array) + lengthNew),
			array);
	};
};
var $elm_community$array_extra$Array$Extra$splitAt = function (index) {
	return function (array) {
		return (index > 0) ? _Utils_Tuple2(
			A2($elm_community$array_extra$Array$Extra$sliceUntil, index, array),
			A2($elm_community$array_extra$Array$Extra$sliceFrom, index, array)) : _Utils_Tuple2($elm$core$Array$empty, array);
	};
};
var $author$project$RVHVarnikLine$toGanSets = F2(
	function (a, na) {
		toGanSets:
		while (true) {
			var na3a3 = A2($elm_community$array_extra$Array$Extra$splitAt, 3, a);
			var na3 = na3a3.a;
			var na1a1 = A2($elm_community$array_extra$Array$Extra$splitAt, 1, a);
			var na1 = na1a1.a;
			var len = $elm$core$Array$length(a);
			var a3 = na3a3.b;
			var a1 = na1a1.b;
			if (!len) {
				return na;
			} else {
				if (len >= 3) {
					var $temp$a = a3,
						$temp$na = A2($elm$core$Array$push, na3, na);
					a = $temp$a;
					na = $temp$na;
					continue toGanSets;
				} else {
					var $temp$a = a1,
						$temp$na = A2($elm$core$Array$push, na1, na);
					a = $temp$a;
					na = $temp$na;
					continue toGanSets;
				}
			}
		}
	});
var $author$project$RVHVarnikLine$lineProcess = function (l) {
	var laWIdx = A2(
		$elm$core$Debug$log,
		'lawi ',
		A3($author$project$RVHVarnikLine$laWithIdx, l.units, 0, $elm$core$Array$empty));
	var len = A2(
		$elm$core$Debug$log,
		'len ',
		$elm$core$Array$length(laWIdx));
	var lWOZero = A2($elm$core$Array$filter, $author$project$RVHVarnikLine$laFilterZero, laWIdx);
	var lGanSets = A2($author$project$RVHVarnikLine$toGanSets, lWOZero, $elm$core$Array$empty);
	var gans = A2($elm$core$Array$map, $author$project$RVHVarnikLine$laGanSetToGanName, lGanSets);
	var lGanSetsWGan = A3($elm_community$array_extra$Array$Extra$map2, $author$project$RVHVarnikLine$laGanSetWGaname, lGanSets, gans);
	var l1 = A2(
		$elm$core$Debug$log,
		'l1 ',
		A5(
			$author$project$RVHVarnikLine$aReInsert0RAs,
			laWIdx,
			0,
			$elm$core$Array$empty,
			0,
			A3($elm$core$Array$foldr, $elm$core$Array$append, $elm$core$Array$empty, lGanSetsWGan)));
	var len1 = A2(
		$elm$core$Debug$log,
		'len1 ',
		$elm$core$Array$length(l1));
	return _Utils_update(
		l,
		{units: l1});
};
var $author$project$RVHCore$vaarnikAdjustMaatraa = F3(
	function (poemData, li, ci) {
		var oldLine = A2(
			$elm$core$Maybe$withDefault,
			$author$project$RVHVarnikLine$emptyLine,
			A2($elm$core$Array$get, li, poemData.lines));
		var newBasicLine = A2(
			$author$project$RVHLine$adjustMaatraa,
			$author$project$RVHVarnikLine$toBasicL(oldLine),
			ci);
		var newLine = $author$project$RVHVarnikLine$lineProcess(
			A2(
				$elm$core$Debug$log,
				'vl ',
				$author$project$RVHVarnikLine$fromBasicL(newBasicLine)));
		var newLines = A3($elm$core$Array$set, li, newLine, poemData.lines);
		var newMaxLineLen = (_Utils_cmp(newLine.rhythmTotal, poemData.maxLineLen) > 0) ? newLine.rhythmTotal : poemData.maxLineLen;
		return $author$project$RVHCore$VarnikPoem(
			{lines: newLines, maapnee: poemData.maapnee, maxLineLen: newMaxLineLen});
	});
var $author$project$RVHCore$adjustMaatraaPoem = F3(
	function (poem, li, ci) {
		var lines = function () {
			switch (poem.$) {
				case 'GenericPoem':
					var data = poem.a;
					return data.lines;
				case 'Ghazal':
					var data = poem.a;
					return A2(
						$elm$core$Array$map,
						function ($) {
							return $.line;
						},
						data.lines);
				case 'FreeVerse':
					var data = poem.a;
					return A2(
						$elm$core$Array$map,
						function ($) {
							return $.line;
						},
						data.lines);
				case 'MaatrikPoem':
					var data = poem.a;
					return A2($elm$core$Array$map, $author$project$RVHMaatrikLine$toBasicL, data.lines);
				default:
					var data = poem.a;
					return A2($elm$core$Array$map, $author$project$RVHVarnikLine$toBasicL, data.lines);
			}
		}();
		var oldLine = A2(
			$elm$core$Maybe$withDefault,
			$author$project$RVHLine$emptyLine,
			A2($elm$core$Array$get, li, lines));
		var newLine = A2($author$project$RVHLine$adjustMaatraa, oldLine, ci);
		var newLines = A3($elm$core$Array$set, li, newLine, lines);
		var newMaxLineLen = $author$project$RVHLine$calcMaxLineLen(newLines);
		var finalFVLines = function () {
			if (poem.$ === 'FreeVerse') {
				var data = poem.a;
				return A3(
					$elm_community$array_extra$Array$Extra$map2,
					$author$project$RVHFreeVerse$fromLineWFlag,
					newLines,
					A2(
						$elm$core$Array$map,
						function ($) {
							return $.isComposite;
						},
						data.lines));
			} else {
				return A2($elm$core$Array$map, $author$project$RVHFreeVerse$fromLine, newLines);
			}
		}();
		switch (poem.$) {
			case 'GenericPoem':
				return $author$project$RVHCore$GenericPoem(
					{lines: newLines, maxLineLen: newMaxLineLen});
			case 'Ghazal':
				var data = poem.a;
				return $author$project$RVHCore$Ghazal(
					_Utils_update(
						data,
						{
							lines: A3(
								$elm_community$array_extra$Array$Extra$map2,
								$author$project$RVHGhazal$misraaFromLineWRK,
								newLines,
								A2(
									$elm$core$Array$map,
									function ($) {
										return $.rkUnits;
									},
									data.lines)),
							maxLineLen: newMaxLineLen
						}));
			case 'FreeVerse':
				var data = poem.a;
				return $author$project$RVHCore$FreeVerse(
					{
						baseCount: data.baseCount,
						composite: A3(
							$author$project$RVHFreeVerse$calcRemainderWhole,
							A4($author$project$RVHFreeVerse$calcCompositeRhythm, finalFVLines, 0, $elm$core$Array$empty, false),
							data.baseCount,
							0),
						lines: finalFVLines,
						maxLineLen: newMaxLineLen
					});
			case 'MaatrikPoem':
				var data = poem.a;
				return A3($author$project$RVHCore$maatrikAdjustMaatraa, data, li, ci);
			default:
				var data = poem.a;
				return A3($author$project$RVHCore$vaarnikAdjustMaatraa, data, li, ci);
		}
	});
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {index: index, match: match, number: number, submatches: submatches};
	});
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $elm$regex$Regex$fromString = function (string) {
	return A2(
		$elm$regex$Regex$fromStringWith,
		{caseInsensitive: false, multiline: false},
		string);
};
var $elm$regex$Regex$replace = _Regex_replaceAtMost(_Regex_infinity);
var $author$project$RVHLine$userReplace = F3(
	function (userRegex, replacer, string) {
		var _v0 = $elm$regex$Regex$fromString(userRegex);
		if (_v0.$ === 'Nothing') {
			return string;
		} else {
			var regex = _v0.a;
			return A3($elm$regex$Regex$replace, regex, replacer, string);
		}
	});
var $author$project$RVHLine$cleanMaapnee = function (string) {
	return A3(
		$author$project$RVHLine$userReplace,
		'[^21२१ ]',
		function (_v0) {
			return '';
		},
		string);
};
var $author$project$RVHCore$IncomingPoem = F3(
	function (poem, poemType, maapnee) {
		return {maapnee: maapnee, poem: poem, poemType: poemType};
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$RVHCore$decodeIncomingPoem = A4(
	$elm$json$Json$Decode$map3,
	$author$project$RVHCore$IncomingPoem,
	A2($elm$json$Json$Decode$field, 'poem', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'poemType', $elm$json$Json$Decode$string),
	A2($elm$json$Json$Decode$field, 'maapnee', $elm$json$Json$Decode$string));
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $author$project$RVHCore$WhichChar = F2(
	function (lineI, charI) {
		return {charI: charI, lineI: lineI};
	});
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $author$project$RVHCore$decodeWhichChar = A3(
	$elm$json$Json$Decode$map2,
	$author$project$RVHCore$WhichChar,
	A2($elm$json$Json$Decode$field, 'lineI', $elm$json$Json$Decode$int),
	A2($elm$json$Json$Decode$field, 'charI', $elm$json$Json$Decode$int));
var $author$project$RVHCore$fvGetData = function (p) {
	if (p.$ === 'FreeVerse') {
		var data = p.a;
		return data;
	} else {
		return {baseCount: 1, composite: $elm$core$Array$empty, lines: $elm$core$Array$empty, maxLineLen: 0};
	}
};
var $author$project$RVHCore$fvSetBase = F2(
	function (pom, base) {
		var data = $author$project$RVHCore$fvGetData(pom);
		var compositeWRemainder = A3($author$project$RVHFreeVerse$calcRemainderWhole, data.composite, base, 0);
		return $author$project$RVHCore$FreeVerse(
			_Utils_update(
				data,
				{baseCount: base, composite: compositeWRemainder}));
	});
var $author$project$RVHCore$fvSetComposite = F2(
	function (pom, li) {
		var data = $author$project$RVHCore$fvGetData(pom);
		var line = A2(
			$elm$core$Maybe$withDefault,
			A2($author$project$RVHFreeVerse$Line, $author$project$RVHLine$emptyLine, false),
			A2($elm$core$Array$get, li, data.lines));
		var newLine = A2($author$project$RVHFreeVerse$Line, line.line, !line.isComposite);
		var newLines = A3($elm$core$Array$set, li, newLine, data.lines);
		var composite = A4($author$project$RVHFreeVerse$calcCompositeRhythm, newLines, 0, $elm$core$Array$empty, false);
		var compositeWRemainder = A3($author$project$RVHFreeVerse$calcRemainderWhole, composite, data.baseCount, 0);
		return $author$project$RVHCore$FreeVerse(
			{baseCount: data.baseCount, composite: compositeWRemainder, lines: newLines, maxLineLen: data.maxLineLen});
	});
var $author$project$RVHCore$genericGetData = function (p) {
	switch (p.$) {
		case 'GenericPoem':
			var data = p.a;
			return data;
		case 'Ghazal':
			var data = p.a;
			return {
				lines: A2(
					$elm$core$Array$map,
					function ($) {
						return $.line;
					},
					data.lines),
				maxLineLen: data.maxLineLen
			};
		case 'FreeVerse':
			var data = p.a;
			return {
				lines: A2(
					$elm$core$Array$map,
					function ($) {
						return $.line;
					},
					data.lines),
				maxLineLen: data.maxLineLen
			};
		case 'MaatrikPoem':
			var data = p.a;
			return {
				lines: A2($elm$core$Array$map, $author$project$RVHMaatrikLine$toBasicL, data.lines),
				maxLineLen: data.maxLineLen
			};
		default:
			var data = p.a;
			return {
				lines: A2($elm$core$Array$map, $author$project$RVHVarnikLine$toBasicL, data.lines),
				maxLineLen: data.maxLineLen
			};
	}
};
var $elm$core$String$lines = _String_lines;
var $author$project$Akshar$calcHalfAksharRhythm = F3(
	function (ac, ap, an) {
		return (!_Utils_eq(ac.aksharType, $author$project$Akshar$Half)) ? ac : (((_Utils_eq(
			ac.mainChar,
			_Utils_chr('म')) && _Utils_eq(
			an.mainChar,
			_Utils_chr('ह'))) || (_Utils_eq(
			ac.mainChar,
			_Utils_chr('न')) && _Utils_eq(
			an.mainChar,
			_Utils_chr('ह')))) ? ac : (((ap.rhythm === 1) && (!_Utils_eq(ap.aksharType, $author$project$Akshar$Half))) ? _Utils_update(
			ac,
			{rhythm: 1, userRhythm: 1}) : (((ap.rhythm === 2) && (an.rhythm === 2)) ? _Utils_update(
			ac,
			{rhythm: 1, userRhythm: 1}) : ac)));
	});
var $author$project$RVHLine$calcHalfAksharRhythmLine = F3(
	function (line, i, r) {
		calcHalfAksharRhythmLine:
		while (true) {
			var len = $elm$core$Array$length(line);
			var maxI = len - 1;
			var ap = A2(
				$elm$core$Maybe$withDefault,
				$author$project$Akshar$emptyAkshar,
				A2($elm$core$Array$get, i - 1, line));
			var an = A2(
				$elm$core$Maybe$withDefault,
				$author$project$Akshar$emptyAkshar,
				A2($elm$core$Array$get, i + 1, line));
			var ac = A2(
				$elm$core$Maybe$withDefault,
				$author$project$Akshar$emptyAkshar,
				A2($elm$core$Array$get, i, line));
			var aNew = A3($author$project$Akshar$calcHalfAksharRhythm, ac, ap, an);
			var newline = A3($elm$core$Array$set, i, aNew, line);
			if (_Utils_cmp(i, maxI) > 0) {
				return _Utils_Tuple2(line, r);
			} else {
				var $temp$line = newline,
					$temp$i = i + 1,
					$temp$r = r + aNew.rhythm;
				line = $temp$line;
				i = $temp$i;
				r = $temp$r;
				continue calcHalfAksharRhythmLine;
			}
		}
	});
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $author$project$Akshar$mergeBottomBindi = F3(
	function (aB, aC, aPartlyPrepared) {
		return (aB.rhythm > 0) ? aPartlyPrepared : _Utils_update(
			aPartlyPrepared,
			{rhythm: aC.rhythm, userRhythm: aC.rhythm, vowel: aC.vowel});
	});
var $author$project$Akshar$mrgMaatraaCons = F2(
	function (aM, aC) {
		var aNew = _Utils_update(
			aC,
			{
				rhythm: aM.rhythm,
				str: _Utils_ap(aC.str, aM.str),
				userRhythm: aM.rhythm,
				vowel: aM.vowel
			});
		if (_Utils_eq(aC.aksharType, $author$project$Akshar$Consonant)) {
			var _v0 = aM.aksharType;
			switch (_v0.$) {
				case 'Maatraa':
					return _Utils_Tuple2(true, aNew);
				case 'Halant':
					return _Utils_Tuple2(
						true,
						_Utils_update(
							aNew,
							{aksharType: $author$project$Akshar$Half}));
				case 'BottomBindi':
					return _Utils_Tuple2(
						true,
						A3($author$project$Akshar$mergeBottomBindi, aM, aC, aNew));
				default:
					return _Utils_Tuple2(false, aM);
			}
		} else {
			return _Utils_Tuple2(false, aM);
		}
	});
var $author$project$RVHLine$mrgMChelper = F3(
	function (inAr, iStart, collectAr) {
		mrgMChelper:
		while (true) {
			var iNext = iStart + 1;
			var collectArLen = $elm$core$Array$length(collectAr);
			var aM = A2(
				$elm$core$Maybe$withDefault,
				$author$project$Akshar$emptyAkshar,
				A2($elm$core$Array$get, collectArLen - 1, collectAr));
			var aL = A2(
				$elm$core$Maybe$withDefault,
				$author$project$Akshar$emptyAkshar,
				A2($elm$core$Array$get, iStart, inAr));
			var mrgResult = A2($author$project$Akshar$mrgMaatraaCons, aL, aM);
			var aC = mrgResult.b;
			if (_Utils_eq(
				iStart,
				$elm$core$Array$length(inAr))) {
				return collectAr;
			} else {
				if ($elm$core$Array$length(inAr) === 1) {
					var $temp$inAr = inAr,
						$temp$iStart = iNext,
						$temp$collectAr = A2($elm$core$Array$push, aL, collectAr);
					inAr = $temp$inAr;
					iStart = $temp$iStart;
					collectAr = $temp$collectAr;
					continue mrgMChelper;
				} else {
					if (mrgResult.a) {
						var $temp$inAr = inAr,
							$temp$iStart = iNext,
							$temp$collectAr = A3($elm$core$Array$set, collectArLen - 1, aC, collectAr);
						inAr = $temp$inAr;
						iStart = $temp$iStart;
						collectAr = $temp$collectAr;
						continue mrgMChelper;
					} else {
						var $temp$inAr = inAr,
							$temp$iStart = iNext,
							$temp$collectAr = A2($elm$core$Array$push, aC, collectAr);
						inAr = $temp$inAr;
						iStart = $temp$iStart;
						collectAr = $temp$collectAr;
						continue mrgMChelper;
					}
				}
			}
		}
	});
var $author$project$RVHLine$mrgMCline = function (inputArray) {
	return A3($author$project$RVHLine$mrgMChelper, inputArray, 0, $elm$core$Array$empty);
};
var $author$project$Akshar$BottomBindi = {$: 'BottomBindi'};
var $author$project$Akshar$ChandraBindu = {$: 'ChandraBindu'};
var $author$project$Akshar$Halant = {$: 'Halant'};
var $author$project$Akshar$Maatraa = {$: 'Maatraa'};
var $author$project$Akshar$Other = {$: 'Other'};
var $author$project$Akshar$isBindu = function (c) {
	return $elm$core$Char$toCode(c) === 2306;
};
var $author$project$Akshar$isBottomBindi = function (cd) {
	return cd === 2364;
};
var $author$project$Akshar$isChandraBindu = function (c) {
	return $elm$core$Char$toCode(c) === 2305;
};
var $author$project$Akshar$isHalant = function (cd) {
	return cd === 2381;
};
var $author$project$Akshar$isHindi = function (cd) {
	return (cd >= 2305) && (cd <= 2399);
};
var $author$project$Akshar$isMaatraaVowel = function (cd) {
	return (cd >= 2366) && (cd <= 2380);
};
var $author$project$Akshar$isPureVowel = function (cd) {
	return (cd >= 2309) && (cd <= 2324);
};
var $author$project$Akshar$maatraaToVowel = function (c) {
	switch (c.valueOf()) {
		case 'ा':
			return _Utils_chr('आ');
		case 'ि':
			return _Utils_chr('इ');
		case 'ी':
			return _Utils_chr('ई');
		case 'ु':
			return _Utils_chr('उ');
		case 'ू':
			return _Utils_chr('ऊ');
		case 'े':
			return _Utils_chr('ए');
		case 'ै':
			return _Utils_chr('ऐ');
		case 'ो':
			return _Utils_chr('ओ');
		case 'ौ':
			return _Utils_chr('औ');
		case 'ॉ':
			return _Utils_chr('ऑ');
		case 'ृ':
			return _Utils_chr('ऋ');
		default:
			return c;
	}
};
var $author$project$Akshar$vowelRhythm = function (c) {
	switch (c.valueOf()) {
		case 'अ':
			return 1;
		case 'आ':
			return 2;
		case 'इ':
			return 1;
		case 'ई':
			return 2;
		case 'उ':
			return 1;
		case 'ऊ':
			return 2;
		case 'ए':
			return 2;
		case 'ऐ':
			return 2;
		case 'ओ':
			return 2;
		case 'औ':
			return 2;
		case 'ऑ':
			return 2;
		case 'ऋ':
			return 1;
		default:
			return 0;
	}
};
var $author$project$Akshar$processChar = function (c) {
	var m = 0;
	var cd = $elm$core$Char$toCode(c);
	var aRhythm = $author$project$Akshar$vowelRhythm(
		_Utils_chr('अ'));
	var a = {
		aksharType: $author$project$Akshar$Other,
		code: cd,
		mainChar: c,
		rhythm: 0,
		str: $elm$core$String$fromChar(c),
		userRhythm: 0,
		vowel: c
	};
	var newRhythm = $author$project$Akshar$isPureVowel(cd) ? $author$project$Akshar$vowelRhythm(a.vowel) : ($author$project$Akshar$isMaatraaVowel(cd) ? $author$project$Akshar$vowelRhythm(
		$author$project$Akshar$maatraaToVowel(a.vowel)) : 0);
	return $author$project$Akshar$isHindi(cd) ? ($author$project$Akshar$isPureVowel(cd) ? _Utils_update(
		a,
		{aksharType: $author$project$Akshar$PureVowel, rhythm: newRhythm, userRhythm: newRhythm}) : ($author$project$Akshar$isMaatraaVowel(cd) ? _Utils_update(
		a,
		{aksharType: $author$project$Akshar$Maatraa, rhythm: newRhythm, userRhythm: newRhythm}) : ($author$project$Akshar$isBindu(c) ? _Utils_update(
		a,
		{aksharType: $author$project$Akshar$Half, rhythm: 0, userRhythm: 0}) : ($author$project$Akshar$isHalant(cd) ? _Utils_update(
		a,
		{aksharType: $author$project$Akshar$Halant, rhythm: 0, userRhythm: 0}) : ($author$project$Akshar$isChandraBindu(c) ? _Utils_update(
		a,
		{aksharType: $author$project$Akshar$ChandraBindu, rhythm: 0, userRhythm: 0}) : ($author$project$Akshar$isBottomBindi(cd) ? _Utils_update(
		a,
		{aksharType: $author$project$Akshar$BottomBindi, rhythm: 0, userRhythm: 0}) : _Utils_update(
		a,
		{
			aksharType: $author$project$Akshar$Consonant,
			rhythm: aRhythm,
			userRhythm: aRhythm,
			vowel: _Utils_chr('अ')
		}))))))) : a;
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $author$project$RVHLine$processLine = function (pomLine) {
	var pChars = $elm$core$String$toList(pomLine);
	var pPoem = A2($elm$core$List$map, $author$project$Akshar$processChar, pChars);
	var pPoemA = $elm$core$Array$fromList(pPoem);
	var mergedLine = $author$project$RVHLine$mrgMCline(pPoemA);
	var _final = A3($author$project$RVHLine$calcHalfAksharRhythmLine, mergedLine, 0, 0);
	return A3($author$project$RVHLine$PoemLine, pomLine, _final.b, _final.a);
};
var $author$project$RVHLine$removeExtraSpaces = function (string) {
	return A3(
		$author$project$RVHLine$userReplace,
		'\\s+',
		function (_v0) {
			return ' ';
		},
		string);
};
var $author$project$RVHLine$removeNonDevanagari = function (string) {
	return A3(
		$author$project$RVHLine$userReplace,
		'[^\u0900-\u097F]',
		function (_v0) {
			return ' ';
		},
		string);
};
var $author$project$RVHLine$removePoornviraam = function (string) {
	return A3(
		$author$project$RVHLine$userReplace,
		'।',
		function (_v0) {
			return ' ';
		},
		string);
};
var $elm$core$String$trim = _String_trim;
var $author$project$RVHLine$preProcessLine = F2(
	function (pomLine, oldLine) {
		var pCleaned = $elm$core$String$trim(
			$author$project$RVHLine$removeExtraSpaces(
				$author$project$RVHLine$removePoornviraam(
					$author$project$RVHLine$removeNonDevanagari(pomLine))));
		return _Utils_eq(pCleaned, oldLine.str) ? oldLine : $author$project$RVHLine$processLine(pCleaned);
	});
var $elm$core$Array$repeat = F2(
	function (n, e) {
		return A2(
			$elm$core$Array$initialize,
			n,
			function (_v0) {
				return e;
			});
	});
var $author$project$RVHCore$processPoem = F2(
	function (pom, oldLines) {
		var pLines = $elm$core$Array$fromList(
			$elm$core$String$lines(pom));
		var diff = $elm$core$Array$length(pLines) - $elm$core$Array$length(oldLines);
		var paddedOldPoem = (diff > 0) ? A2(
			$elm$core$Array$append,
			oldLines,
			A2($elm$core$Array$repeat, diff, $author$project$RVHLine$emptyLine)) : oldLines;
		var processedLines = A3($elm_community$array_extra$Array$Extra$map2, $author$project$RVHLine$preProcessLine, pLines, paddedOldPoem);
		var maxLineLen = $author$project$RVHLine$calcMaxLineLen(processedLines);
		return $author$project$RVHCore$GenericPoem(
			{lines: processedLines, maxLineLen: maxLineLen});
	});
var $author$project$RVHCore$fvProcess = F2(
	function (pom, oldPom) {
		var oldFVData = $author$project$RVHCore$fvGetData(oldPom);
		var oldFVFlags = A2(
			$elm$core$Array$map,
			function ($) {
				return $.isComposite;
			},
			oldFVData.lines);
		var basicOldLines = $author$project$RVHCore$genericGetData(oldPom).lines;
		var basicProcessed = $author$project$RVHCore$genericGetData(
			A2($author$project$RVHCore$processPoem, pom, basicOldLines));
		var diff = $elm$core$Array$length(basicProcessed.lines) - $elm$core$Array$length(oldFVData.lines);
		var paddedOldFlags = (diff > 0) ? A2(
			$elm$core$Array$append,
			oldFVFlags,
			A2($elm$core$Array$repeat, diff, false)) : oldFVFlags;
		var newFVLines = A3($elm_community$array_extra$Array$Extra$map2, $author$project$RVHFreeVerse$fromLineWFlag, basicProcessed.lines, paddedOldFlags);
		var composite = A4($author$project$RVHFreeVerse$calcCompositeRhythm, newFVLines, 0, $elm$core$Array$empty, false);
		var compositeWRemainder = A3($author$project$RVHFreeVerse$calcRemainderWhole, composite, oldFVData.baseCount, 0);
		return $author$project$RVHCore$FreeVerse(
			{baseCount: oldFVData.baseCount, composite: compositeWRemainder, lines: newFVLines, maxLineLen: basicProcessed.maxLineLen});
	});
var $author$project$Akshar$unitsLast = function (akshars) {
	return A2(
		$elm$core$Maybe$withDefault,
		$author$project$Akshar$emptyAkshar,
		A2(
			$elm$core$Array$get,
			$elm$core$Array$length(akshars) - 1,
			akshars));
};
var $author$project$Akshar$vowelCompare = F2(
	function (a, b) {
		return _Utils_eq(a.vowel, b.vowel) ? true : false;
	});
var $author$project$RVHGhazal$calcKaafiyaa = F3(
	function (kaafiyaa, line0, line1) {
		calcKaafiyaa:
		while (true) {
			var poppedLine1 = A3($elm$core$Array$slice, 0, -1, line1);
			var poppedLine0 = A3($elm$core$Array$slice, 0, -1, line0);
			var b = $author$project$Akshar$unitsLast(line1);
			var a = $author$project$Akshar$unitsLast(line0);
			var appendArray = A2($elm$core$Array$repeat, 1, a);
			if ((!$elm$core$Array$length(line0)) || (!$elm$core$Array$length(line1))) {
				return kaafiyaa;
			} else {
				if (A2($author$project$Akshar$vowelCompare, a, b)) {
					var $temp$kaafiyaa = A2($elm$core$Array$append, appendArray, kaafiyaa),
						$temp$line0 = poppedLine0,
						$temp$line1 = poppedLine1;
					kaafiyaa = $temp$kaafiyaa;
					line0 = $temp$line0;
					line1 = $temp$line1;
					continue calcKaafiyaa;
				} else {
					return kaafiyaa;
				}
			}
		}
	});
var $author$project$Akshar$compare = F2(
	function (a, b) {
		return _Utils_eq(a.str, b.str) ? true : false;
	});
var $author$project$RVHGhazal$calcRadeef = F3(
	function (radeef, line0, line1) {
		calcRadeef:
		while (true) {
			var poppedLine1 = A3($elm$core$Array$slice, 0, -1, line1);
			var poppedLine0 = A3($elm$core$Array$slice, 0, -1, line0);
			var b = $author$project$Akshar$unitsLast(line1);
			var a = $author$project$Akshar$unitsLast(line0);
			var appendArray = A2($elm$core$Array$repeat, 1, a);
			if ((!$elm$core$Array$length(line0)) || (!$elm$core$Array$length(line1))) {
				return radeef;
			} else {
				if (A2($author$project$Akshar$compare, a, b)) {
					var $temp$radeef = A2($elm$core$Array$append, appendArray, radeef),
						$temp$line0 = poppedLine0,
						$temp$line1 = poppedLine1;
					radeef = $temp$radeef;
					line0 = $temp$line0;
					line1 = $temp$line1;
					continue calcRadeef;
				} else {
					return radeef;
				}
			}
		}
	});
var $author$project$RVHGhazal$setMisraaKaafiyaa = F4(
	function (misraa, radeefLen, kaafiyaa, kaafiyaaI) {
		setMisraaKaafiyaa:
		while (true) {
			var ki = ($elm$core$Array$length(kaafiyaa) - kaafiyaaI) - 1;
			var k = A2(
				$elm$core$Maybe$withDefault,
				$author$project$Akshar$emptyAkshar,
				A2($elm$core$Array$get, ki, kaafiyaa));
			var ai = (($elm$core$Array$length(misraa.line.units) - radeefLen) - kaafiyaaI) - 1;
			var a = A2(
				$elm$core$Maybe$withDefault,
				$author$project$Akshar$emptyAkshar,
				A2($elm$core$Array$get, ai, misraa.line.units));
			if (_Utils_eq(
				$elm$core$Array$length(kaafiyaa),
				kaafiyaaI)) {
				return misraa;
			} else {
				if (A2($author$project$Akshar$vowelCompare, a, k)) {
					var $temp$misraa = _Utils_update(
						misraa,
						{
							rkUnits: A3(
								$elm$core$Array$set,
								ai,
								_Utils_chr('k'),
								misraa.rkUnits)
						}),
						$temp$radeefLen = radeefLen,
						$temp$kaafiyaa = kaafiyaa,
						$temp$kaafiyaaI = kaafiyaaI + 1;
					misraa = $temp$misraa;
					radeefLen = $temp$radeefLen;
					kaafiyaa = $temp$kaafiyaa;
					kaafiyaaI = $temp$kaafiyaaI;
					continue setMisraaKaafiyaa;
				} else {
					return misraa;
				}
			}
		}
	});
var $author$project$RVHCore$ghazalSetKaafiyaa = F4(
	function (misre, radeefLen, kaafiyaa, mi) {
		ghazalSetKaafiyaa:
		while (true) {
			var misraa = A2(
				$elm$core$Maybe$withDefault,
				{line: $author$project$RVHLine$emptyLine, rkUnits: $elm$core$Array$empty},
				A2($elm$core$Array$get, mi, misre));
			var newMisraa = A4($author$project$RVHGhazal$setMisraaKaafiyaa, misraa, radeefLen, kaafiyaa, 0);
			var misre1 = A3($elm$core$Array$set, mi, newMisraa, misre);
			var iNext = (!mi) ? (mi + 1) : (mi + 3);
			if (_Utils_cmp(
				iNext,
				$elm$core$Array$length(misre)) > -1) {
				return misre1;
			} else {
				var $temp$misre = misre1,
					$temp$radeefLen = radeefLen,
					$temp$kaafiyaa = kaafiyaa,
					$temp$mi = iNext;
				misre = $temp$misre;
				radeefLen = $temp$radeefLen;
				kaafiyaa = $temp$kaafiyaa;
				mi = $temp$mi;
				continue ghazalSetKaafiyaa;
			}
		}
	});
var $author$project$RVHGhazal$setMisraaRadeef = F3(
	function (misraa, radeef, radeefI) {
		setMisraaRadeef:
		while (true) {
			var ri = ($elm$core$Array$length(radeef) - radeefI) - 1;
			var r = A2(
				$elm$core$Maybe$withDefault,
				$author$project$Akshar$emptyAkshar,
				A2($elm$core$Array$get, ri, radeef));
			var ai = ($elm$core$Array$length(misraa.line.units) - radeefI) - 1;
			var a = A2(
				$elm$core$Maybe$withDefault,
				$author$project$Akshar$emptyAkshar,
				A2($elm$core$Array$get, ai, misraa.line.units));
			if (_Utils_eq(
				$elm$core$Array$length(radeef),
				radeefI)) {
				return misraa;
			} else {
				if (A2($author$project$Akshar$compare, a, r)) {
					var $temp$misraa = _Utils_update(
						misraa,
						{
							rkUnits: A3(
								$elm$core$Array$set,
								ai,
								_Utils_chr('r'),
								misraa.rkUnits)
						}),
						$temp$radeef = radeef,
						$temp$radeefI = radeefI + 1;
					misraa = $temp$misraa;
					radeef = $temp$radeef;
					radeefI = $temp$radeefI;
					continue setMisraaRadeef;
				} else {
					return misraa;
				}
			}
		}
	});
var $author$project$RVHCore$ghazalSetRadeef = F3(
	function (misre, radeef, mi) {
		ghazalSetRadeef:
		while (true) {
			var misraa = A2(
				$elm$core$Maybe$withDefault,
				{line: $author$project$RVHLine$emptyLine, rkUnits: $elm$core$Array$empty},
				A2($elm$core$Array$get, mi, misre));
			var newMisraa = A3($author$project$RVHGhazal$setMisraaRadeef, misraa, radeef, 0);
			var misre1 = A3($elm$core$Array$set, mi, newMisraa, misre);
			var iNext = (!mi) ? (mi + 1) : (mi + 3);
			if (_Utils_cmp(
				iNext,
				$elm$core$Array$length(misre)) > -1) {
				return misre1;
			} else {
				var $temp$misre = misre1,
					$temp$radeef = radeef,
					$temp$mi = iNext;
				misre = $temp$misre;
				radeef = $temp$radeef;
				mi = $temp$mi;
				continue ghazalSetRadeef;
			}
		}
	});
var $author$project$RVHGhazal$emptyRKUnit = _Utils_chr(' ');
var $author$project$RVHGhazal$misraaFromLine = function (line) {
	var rkUnits = A2(
		$elm$core$Array$repeat,
		$elm$core$Array$length(line.units),
		$author$project$RVHGhazal$emptyRKUnit);
	return A2($author$project$RVHGhazal$Misraa, line, rkUnits);
};
var $elm_community$array_extra$Array$Extra$member = function (needle) {
	return A2(
		$elm$core$Array$foldr,
		F2(
			function (i, res) {
				return _Utils_eq(needle, i) || res;
			}),
		false);
};
var $author$project$Akshar$space = A7(
	$author$project$Akshar$Akshar,
	' ',
	32,
	$author$project$Akshar$Other,
	_Utils_chr(' '),
	_Utils_chr(' '),
	0,
	0);
var $author$project$RVHGhazal$truncRadeef = F2(
	function (radeef, line) {
		truncRadeef:
		while (true) {
			var len = $elm$core$Array$length(radeef);
			var ci = $elm$core$Array$length(line) - len;
			var a = A2(
				$elm$core$Maybe$withDefault,
				$author$project$Akshar$emptyAkshar,
				A2($elm$core$Array$get, ci, line));
			if (A2($elm_community$array_extra$Array$Extra$member, $author$project$Akshar$space, radeef)) {
				if (_Utils_eq(a.aksharType, $author$project$Akshar$Other) || _Utils_eq(a.aksharType, $author$project$Akshar$Empty)) {
					return A3(
						$elm$core$Array$slice,
						1,
						$elm$core$Array$length(radeef),
						radeef);
				} else {
					var $temp$radeef = A3(
						$elm$core$Array$slice,
						1,
						$elm$core$Array$length(radeef),
						radeef),
						$temp$line = line;
					radeef = $temp$radeef;
					line = $temp$line;
					continue truncRadeef;
				}
			} else {
				return radeef;
			}
		}
	});
var $author$project$RVHCore$ghazalProcess = F2(
	function (pom, oldPom) {
		var basic = $author$project$RVHCore$genericGetData(
			A2($author$project$RVHCore$processPoem, pom, oldPom));
		var line0 = A2(
			$elm$core$Maybe$withDefault,
			$author$project$RVHLine$emptyLine,
			A2($elm$core$Array$get, 0, basic.lines));
		var line1 = A2(
			$elm$core$Maybe$withDefault,
			$author$project$RVHLine$emptyLine,
			A2($elm$core$Array$get, 1, basic.lines));
		var preRadeef = A3($author$project$RVHGhazal$calcRadeef, $elm$core$Array$empty, line0.units, line1.units);
		var radeef = A2($author$project$RVHGhazal$truncRadeef, preRadeef, line0.units);
		var l0i = $elm$core$Array$length(line0.units) - $elm$core$Array$length(radeef);
		var cutLine0 = A3($elm$core$Array$slice, 0, l0i, line0.units);
		var l1i = $elm$core$Array$length(line1.units) - $elm$core$Array$length(radeef);
		var cutLine1 = A3($elm$core$Array$slice, 0, l1i, line1.units);
		var kaafiyaa = A3($author$project$RVHGhazal$calcKaafiyaa, $elm$core$Array$empty, cutLine0, cutLine1);
		var misre = A2($elm$core$Array$map, $author$project$RVHGhazal$misraaFromLine, basic.lines);
		var misre1 = A3($author$project$RVHCore$ghazalSetRadeef, misre, radeef, 0);
		var misre2 = A4(
			$author$project$RVHCore$ghazalSetKaafiyaa,
			misre1,
			$elm$core$Array$length(radeef),
			kaafiyaa,
			0);
		return $author$project$RVHCore$Ghazal(
			{kaafiyaa: kaafiyaa, lines: misre2, maxLineLen: basic.maxLineLen, radeef: radeef});
	});
var $author$project$RVHPattern$Maapnee = F3(
	function (units, str, len) {
		return {len: len, str: str, units: units};
	});
var $author$project$RVHPattern$maapneeToInt = function (m) {
	switch (m.valueOf()) {
		case '1':
			return 1;
		case '2':
			return 2;
		case '१':
			return 1;
		case '२':
			return 2;
		default:
			return 0;
	}
};
var $author$project$RVHPattern$process = function (m) {
	var maapneeCharA = $elm$core$Array$fromList(
		$elm$core$String$toList(m));
	var maapneeArray = A2($elm$core$Array$map, $author$project$RVHPattern$maapneeToInt, maapneeCharA);
	var maapneeLen = A3($elm$core$Array$foldl, $elm$core$Basics$add, 0, maapneeArray);
	return A3($author$project$RVHPattern$Maapnee, maapneeArray, m, maapneeLen);
};
var $author$project$RVHCore$maatrikProcessPoem = F3(
	function (pom, oldPom, maapnee) {
		var processedMaapnee = $author$project$RVHPattern$process(maapnee);
		var genericOld = $author$project$RVHCore$genericGetData(oldPom);
		var basic = $author$project$RVHCore$genericGetData(
			A2($author$project$RVHCore$processPoem, pom, genericOld.lines));
		var maatrikLines = A2($elm$core$Array$map, $author$project$RVHMaatrikLine$fromBasicL, basic.lines);
		var maatrikLinesWMaapnee = A3(
			$elm_community$array_extra$Array$Extra$map2,
			$author$project$RVHMaatrikLine$setLineMaapnee,
			maatrikLines,
			A2(
				$elm$core$Array$repeat,
				$elm$core$Array$length(maatrikLines),
				processedMaapnee.units));
		return $author$project$RVHCore$MaatrikPoem(
			{
				lines: maatrikLinesWMaapnee,
				maapnee: processedMaapnee,
				maxLineLen: (_Utils_cmp(processedMaapnee.len, basic.maxLineLen) > 0) ? processedMaapnee.len : basic.maxLineLen
			});
	});
var $author$project$RVHVarnikLine$Maapnee = F3(
	function (units, str, len) {
		return {len: len, str: str, units: units};
	});
var $author$project$RVHVarnikLine$MUwIdx = F3(
	function (u, i, g) {
		return {g: g, i: i, u: u};
	});
var $author$project$RVHVarnikLine$setGanameToGanset = F4(
	function (gs, gn, i, ns) {
		setGanameToGanset:
		while (true) {
			var ui = A2(
				$elm$core$Maybe$withDefault,
				A3($author$project$RVHVarnikLine$MUwIdx, '0', -1, ''),
				A2($elm$core$Array$get, i, gs));
			var newMUwIdx = _Utils_update(
				ui,
				{g: gn});
			var ns1 = A2($elm$core$Array$push, newMUwIdx, ns);
			var len = $elm$core$Array$length(gs);
			if (_Utils_cmp(i, len) > -1) {
				return ns;
			} else {
				var $temp$gs = gs,
					$temp$gn = gn,
					$temp$i = i + 1,
					$temp$ns = ns1;
				gs = $temp$gs;
				gn = $temp$gn;
				i = $temp$i;
				ns = $temp$ns;
				continue setGanameToGanset;
			}
		}
	});
var $author$project$RVHVarnikLine$ganSetWGaname = F2(
	function (gs, gn) {
		return A4($author$project$RVHVarnikLine$setGanameToGanset, gs, gn, 0, $elm$core$Array$empty);
	});
var $author$project$RVHVarnikLine$mGanSetToGanName = function (ganset) {
	var sig = A3(
		$elm$core$Array$foldr,
		$elm$core$Basics$append,
		'',
		A2(
			$elm$core$Array$map,
			function ($) {
				return $.u;
			},
			ganset));
	return $author$project$RVHVarnikLine$ganSigToGan(sig);
};
var $author$project$RVHVarnikLine$mUFilterZero = function (el) {
	return el.u !== '0';
};
var $elm$core$String$toInt = _String_toInt;
var $author$project$RVHVarnikLine$mUReInsertZero = F3(
	function (uia, i, uia1) {
		mUReInsertZero:
		while (true) {
			var ui2 = A2(
				$elm$core$Maybe$withDefault,
				A3($author$project$RVHVarnikLine$MUwIdx, '0', -1, ''),
				A2($elm$core$Array$get, i + 1, uia));
			var ui1 = A2(
				$elm$core$Maybe$withDefault,
				A3($author$project$RVHVarnikLine$MUwIdx, '0', -1, ''),
				A2($elm$core$Array$get, i, uia));
			var u1Int = A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(ui1.u));
			var ui1Int = {g: ui1.g, i: ui1.i, u: u1Int};
			var uia11 = A2($elm$core$Array$push, ui1Int, uia1);
			var len = $elm$core$Array$length(uia);
			if (_Utils_cmp(i, len) > -1) {
				return uia1;
			} else {
				if (_Utils_eq(i, len - 1)) {
					return uia11;
				} else {
					if (_Utils_eq(ui1.i, ui2.i - 1)) {
						var $temp$uia = uia,
							$temp$i = i + 1,
							$temp$uia1 = uia11;
						uia = $temp$uia;
						i = $temp$i;
						uia1 = $temp$uia1;
						continue mUReInsertZero;
					} else {
						var $temp$uia = uia,
							$temp$i = i + 1,
							$temp$uia1 = A2(
							$elm$core$Array$push,
							{g: '', i: i + 1, u: 0},
							uia11);
						uia = $temp$uia;
						i = $temp$i;
						uia1 = $temp$uia1;
						continue mUReInsertZero;
					}
				}
			}
		}
	});
var $author$project$RVHVarnikLine$mUtoUwIx = F3(
	function (a, i, a1) {
		mUtoUwIx:
		while (true) {
			var u = A2(
				$elm$core$Maybe$withDefault,
				-100,
				A2($elm$core$Array$get, i, a));
			if (_Utils_eq(u, -100)) {
				return a1;
			} else {
				var $temp$a = a,
					$temp$i = i + 1,
					$temp$a1 = A2(
					$elm$core$Array$push,
					A3(
						$author$project$RVHVarnikLine$MUwIdx,
						$elm$core$String$fromInt(u),
						i,
						''),
					a1);
				a = $temp$a;
				i = $temp$i;
				a1 = $temp$a1;
				continue mUtoUwIx;
			}
		}
	});
var $author$project$RVHVarnikLine$mProcess = function (bmaapnee) {
	var muWOZero = A2(
		$elm$core$Array$filter,
		$author$project$RVHVarnikLine$mUFilterZero,
		A3($author$project$RVHVarnikLine$mUtoUwIx, bmaapnee.units, 0, $elm$core$Array$empty));
	var gansets = A2($author$project$RVHVarnikLine$toGanSets, muWOZero, $elm$core$Array$empty);
	var gans = A2($elm$core$Array$map, $author$project$RVHVarnikLine$mGanSetToGanName, gansets);
	var gansetsWgan = A3($elm_community$array_extra$Array$Extra$map2, $author$project$RVHVarnikLine$ganSetWGaname, gansets, gans);
	var uisWgan = A3($elm$core$Array$foldr, $elm$core$Array$append, $elm$core$Array$empty, gansetsWgan);
	var uisWganWZ = A3($author$project$RVHVarnikLine$mUReInsertZero, uisWgan, 0, $elm$core$Array$empty);
	return A3($author$project$RVHVarnikLine$Maapnee, uisWganWZ, bmaapnee.str, bmaapnee.len);
};
var $author$project$RVHCore$varnikProcessPoem = F3(
	function (pom, oldPom, maapnee) {
		var processedMaapnee = $author$project$RVHVarnikLine$mProcess(
			$author$project$RVHPattern$process(maapnee));
		var genericOld = $author$project$RVHCore$genericGetData(oldPom);
		var basic = $author$project$RVHCore$genericGetData(
			A2($author$project$RVHCore$processPoem, pom, genericOld.lines));
		var vaarnikLines = A2(
			$elm$core$Array$map,
			$author$project$RVHVarnikLine$lineProcess,
			A2($elm$core$Array$map, $author$project$RVHVarnikLine$fromBasicL, basic.lines));
		return $author$project$RVHCore$VarnikPoem(
			{
				lines: vaarnikLines,
				maapnee: processedMaapnee,
				maxLineLen: (_Utils_cmp(processedMaapnee.len, basic.maxLineLen) > 0) ? processedMaapnee.len : basic.maxLineLen
			});
	});
var $author$project$RVHCore$preProcessPoem = F4(
	function (pom, oldpom, pomType, maapnee) {
		switch (pomType) {
			case 'GHAZAL':
				return A2(
					$author$project$RVHCore$ghazalProcess,
					pom,
					$author$project$RVHCore$genericGetData(oldpom).lines);
			case 'FREEVERSE':
				return A2($author$project$RVHCore$fvProcess, pom, oldpom);
			case 'MAATRIK':
				return A3($author$project$RVHCore$maatrikProcessPoem, pom, oldpom, maapnee);
			case 'VARNIK':
				return A3($author$project$RVHCore$varnikProcessPoem, pom, oldpom, maapnee);
			default:
				return A2(
					$author$project$RVHCore$processPoem,
					pom,
					$author$project$RVHCore$genericGetData(oldpom).lines);
		}
	});
var $elm$core$String$toUpper = _String_toUpper;
var $author$project$RVHCore$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'ProcessPoem':
				var str = msg.a;
				var oldPoem = model.processedPoem;
				var incomingPoem = function () {
					var _v1 = A2($elm$json$Json$Decode$decodeString, $author$project$RVHCore$decodeIncomingPoem, str);
					if (_v1.$ === 'Ok') {
						var result = _v1.a;
						return result;
					} else {
						return {maapnee: '', poem: '', poemType: ''};
					}
				}();
				var maapnee = $elm$core$String$trim(
					$author$project$RVHLine$removeExtraSpaces(
						$author$project$RVHLine$cleanMaapnee(incomingPoem.maapnee)));
				var poemType = $elm$core$String$toUpper(incomingPoem.poemType);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							lastAction: 'Poem Processed',
							poem: incomingPoem.poem,
							processedPoem: A4($author$project$RVHCore$preProcessPoem, incomingPoem.poem, oldPoem, poemType, maapnee)
						}),
					$elm$core$Platform$Cmd$none);
			case 'AdjustMaatraa':
				var str = msg.a;
				var whichChar = function () {
					var _v2 = A2($elm$json$Json$Decode$decodeString, $author$project$RVHCore$decodeWhichChar, str);
					if (_v2.$ === 'Ok') {
						var result = _v2.a;
						return result;
					} else {
						return {charI: -1, lineI: -1};
					}
				}();
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							lastAction: 'Maatraa Adjusted ' + str,
							processedPoem: A3($author$project$RVHCore$adjustMaatraaPoem, model.processedPoem, whichChar.lineI, whichChar.charI)
						}),
					$elm$core$Platform$Cmd$none);
			case 'SetComposite':
				var str = msg.a;
				var lineI = function () {
					var _v3 = A2($elm$json$Json$Decode$decodeString, $elm$json$Json$Decode$int, str);
					if (_v3.$ === 'Ok') {
						var result = _v3.a;
						return result;
					} else {
						return -1;
					}
				}();
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							lastAction: 'Composite Set ' + str,
							processedPoem: A2($author$project$RVHCore$fvSetComposite, model.processedPoem, lineI)
						}),
					$elm$core$Platform$Cmd$none);
			default:
				var str = msg.a;
				var base = function () {
					var _v4 = A2($elm$json$Json$Decode$decodeString, $elm$json$Json$Decode$int, str);
					if (_v4.$ === 'Ok') {
						var result = _v4.a;
						return result;
					} else {
						return 1;
					}
				}();
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							lastAction: 'BaseCount Set ' + str,
							processedPoem: A2($author$project$RVHCore$fvSetBase, model.processedPoem, base)
						}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$RVHCore$updateWithStorage = F2(
	function (msg, oldModel) {
		var _v0 = A2($author$project$RVHCore$update, msg, oldModel);
		var newModel = _v0.a;
		var cmds = _v0.b;
		return _Utils_Tuple2(
			newModel,
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						$author$project$RVHCore$givePoemRhythm(
						$author$project$RVHCore$encodeModel(newModel)),
						cmds
					])));
	});
var $elm$core$Platform$worker = _Platform_worker;
var $author$project$RVHCore$main = $elm$core$Platform$worker(
	{init: $author$project$RVHCore$init, subscriptions: $author$project$RVHCore$subscriptions, update: $author$project$RVHCore$updateWithStorage});
_Platform_export({'RVHCore':{'init':$author$project$RVHCore$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));