var should = require("should");
var CaseSensitiveModulesWarning = require("../lib/CaseSensitiveModulesWarning");

var createModule = function(identifier, numberOfReasons) {
	var reasons = new Array(numberOfReasons || 0).fill(null).map(function(value, index) {
		return {
			module: createModule(`${identifier}-reason-${index}`)
		};
	});

	return {
		identifier: () => identifier,
		reasons
	};
};

describe("CaseSensitiveModulesWarning", function() {
	var myCaseSensitiveModulesWarning, modules;

	beforeEach(function() {
		modules = [
			createModule('FooBar', 1),
			createModule('foobar', 2),
			createModule('FOOBAR')
		];
		myCaseSensitiveModulesWarning = new CaseSensitiveModulesWarning(modules);
	});

	it('has the a name', function() {
		myCaseSensitiveModulesWarning.name.should.be.exactly('CaseSensitiveModulesWarning');
	});

	it('has the a message', function() {
		myCaseSensitiveModulesWarning.message.should.be.exactly(`
There are multiple modules with names that only differ in casing.
This can lead to unexpected behavior when compiling on a filesystem with other case-semantic.
Use equal casing. Compare these module identifiers:
* FOOBAR
* FooBar
    Used by 1 module(s), i. e.
    FooBar-reason-0
* foobar
    Used by 2 module(s), i. e.
    foobar-reason-0
`.trim());
	});

	it('has the an origin', function() {
		myCaseSensitiveModulesWarning.origin.should.be.exactly(modules[0]);
	});

	it('has the a module', function() {
		myCaseSensitiveModulesWarning.module.should.be.exactly(modules[0]);
	});
});
