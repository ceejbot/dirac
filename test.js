/*global describe:true, it:true, before:true, after:true, beforeEach: true, afterEach:true */
'use strict';

var
	demand    = require('must'),
	fs        = require('fs'),
	path      = require('path'),
	Inventory = require('./ansible')
;

var invdir = path.join(__dirname, 'fixtures');

describe('dirac', function()
{
	it('requires a file path', function()
	{
		function shouldThrow() { return new Inventory(); }
		shouldThrow.must.throw(/file path/);
	});

	it('can be constructed', function()
	{
		var inv = new Inventory('./fixtures/inventory1');
		inv.must.be.an.object();
		inv.must.be.instanceof(Inventory);
		inv.path.must.equal('./fixtures/inventory1');
	});

	it('parse() reads an inventory file', function()
	{
		var inv = new Inventory(path.join(invdir, 'inventory1'));
		inv.must.have.property('parse');
		inv.parse.must.be.a.function();
		inv.parse();
		Object.keys(inv.secmap).length.must.equal(2);
		inv.contents.length.must.equal(5);
	});

	it('parse() throws when the file can\'t be found', function()
	{
		function shouldThrow()
		{
			var inv = new Inventory('ENOFILE');
			inv.parse();
		}
		shouldThrow.must.throw(/ENOENT/);
	});

	it('stringify() must emit the same data as it read for simple files', function()
	{
		var ipath = path.join(invdir, 'inventory1');
		var input = fs.readFileSync(ipath, 'ascii');
		var inventory = new Inventory(ipath);
		inventory.parse();
		var output = inventory.stringify();

		output.length.must.equal(input.length);
		output.must.eql(input);
	});

	it('addHost() must add the host to each group mentioned', function()
	{
		var ipath = path.join(invdir, 'inventory1');
		var inventory = new Inventory(ipath);
		inventory.parse();
		inventory.contents[0].items.length.must.equal(1);
		inventory.contents[3].items.length.must.equal(2);
		inventory.addHost('foo', ['section1', 'section2']);
		inventory.contents[0].items.length.must.equal(2);
		inventory.contents[3].items.length.must.equal(3);
	});

	it('addHost() creates new groups when it must', function()
	{
		var ipath = path.join(invdir, 'inventory1');
		var inventory = new Inventory(ipath);
		inventory.parse();

		inventory.addHost('newhost', ['newgroup']);
		inventory.secmap.must.have.property('newgroup');
		inventory.secmap.newgroup.must.equal(5);
		inventory.contents[4].must.equal('');
		inventory.contents[5].must.be.an.object();
		inventory.contents[5].name.must.equal('newgroup');
	});

	it('addHost() sticks var definitions onto the end of host lines', function()
	{
		var inventory = new Inventory('bleat');
		inventory.addHost('host', 'group', ['var1=val1', 'var2=val2']);
		var output = inventory.stringify();
		var lines = output.split('\n');
		lines[0].must.equal('[group]');
		lines[1].must.match(/ var1=val1/);
		lines[1].must.match(/ var2=val2/);
	});

	it('addHost() replaces host entries & does not duplicate them', function()
	{
		var ipath = path.join(invdir, 'inventory1');
		var inventory = new Inventory(ipath);
		inventory.parse();

		inventory.contents[0].items.length.must.equal(1);
		inventory.addHost('host1', 'section1', ['var=val']);
		inventory.contents[0].items.length.must.equal(1);
		inventory.contents[0].items[0].must.match(/var=val$/);
	});

	it('removeHost() must remove the host from each group', function()
	{
		var inventory = new Inventory(path.join(invdir, 'inventory2'));
		inventory.parse();
		inventory.contents[0].items.length.must.equal(2);
		inventory.contents[3].items.length.must.equal(3);
		inventory.removeHost('removeme');
		inventory.contents[0].items.length.must.equal(1);
		inventory.contents[3].items.length.must.equal(2);
	});

});
