var falafel = require('../');
var test = require('tap').test;
var vm = require('vm');

test('array', function (t) {
    t.plan(5);
    
    var src = '(' + function () {
        var xs = [ 1, 2, [ 3, 4 ] ];
        var ys = [ 5, 6 ];
        g([ xs, ys ]);
    } + ')()';
    
    var pending = 0;
    var output = falafel.map(src, function (node) {
        if (node.type === 'ArrayExpression') {
            pending ++;
            setTimeout(function () {
                node.update('fn(' + node.source() + ')');
                if (--pending === 0) check();
            }, Math.random() * 50);
        }
    });
    
    var arrays = [
        [ 3, 4 ],
        [ 1, 2, [ 3, 4 ] ],
        [ 5, 6 ],
        [ [ 1, 2, [ 3, 4 ] ], [ 5, 6 ] ],
    ];
    
    function check () {
console.log(src);
console.log('------------');
console.log(output.source);
        vm.runInNewContext(output.source, {
            fn : function (xs) {
                t.same(arrays.shift(), xs);
                return xs;
            },
            g : function (xs) {
                t.same(xs, [ [ 1, 2, [ 3, 4 ] ], [ 5, 6 ] ]);
            },
        });
    }
});
