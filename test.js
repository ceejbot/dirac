/*global describe:true, it:true, before:true, after:true, beforeEach: true, afterEach:true */
'use strict';

var
	demand    = require('must'),
	fs        = require('fs'),
	path      = require('path'),
	Inventory = require('./inventory')
;

var invdir = path.join(__dirname, 'fixtures');

describe('dirac', function()
{
	it('can be constructed', function()
	{
		var inv = new Inventory();
		inv.must.be.an.object();
		inv.must.be.instanceof(Inventory);
	});

	it('parse() reads an input stream', function(done)
	{
		var instream = fs.createReadStream(path.join(invdir, 'inventory1'));
		var inv = new Inventory();
		inv.must.have.property('parse');
		inv.parse.must.be.a.function();

		inv.once('finish', function()
		{
			Object.keys(inv.secmap).length.must.equal(2);
			inv.contents.length.must.equal(4);
			done();
		});

		inv.parse(instream);
	});

	it('stringify() must emit the same data as it read for simple files', function(done)
	{
		var instream = fs.createReadStream(path.join(invdir, 'inventory1'), 'ascii');
		var ipath = path.join(invdir, 'inventory1');
		var input = fs.readFileSync(ipath, 'ascii');
		var inventory = new Inventory();

		inventory.once('finish', function()
		{
			var output = inventory.stringify();
			output.length.must.equal(input.length);
			output.must.eql(input);
			done();
		});

		inventory.parse(instream);
	});

	it('stringify() must emit the same data as it read for complex files', function(done)
	{
		var instream = fs.createReadStream(path.join(invdir, 'complex'), 'ascii');
		var ipath = path.join(invdir, 'complex');
		var input = fs.readFileSync(ipath, 'ascii');
		var inventory = new Inventory();

		inventory.once('finish', function()
		{
			var output = inventory.stringify();
			output.length.must.equal(input.length);
			output.must.eql(input);
			done();
		});

		inventory.parse(instream);
	});

	it('addHost() must add the host to each group mentioned', function(done)
	{
		var instream = fs.createReadStream(path.join(invdir, 'inventory1'), 'ascii');
		var inventory = new Inventory();
		inventory.once('finish', function()
		{
			inventory.contents[0].items.length.must.equal(1);
			inventory.contents[3].items.length.must.equal(2);
			inventory.addHost('foo', ['section1', 'section2']);
			inventory.contents[0].items.length.must.equal(2);
			inventory.contents[3].items.length.must.equal(3);
			done();
		});
		inventory.parse(instream);
	});

	it('addHost() creates new groups when it must', function(done)
	{
		var instream = fs.createReadStream(path.join(invdir, 'inventory1'), 'ascii');
		var inventory = new Inventory();
		inventory.once('finish', function()
		{
			inventory.addHost('newhost', ['newgroup']);
			inventory.secmap.must.have.property('newgroup');
			inventory.secmap.newgroup.must.equal(5);
			inventory.contents[4].must.equal('');
			inventory.contents[5].must.be.an.object();
			inventory.contents[5].name.must.equal('newgroup');
			done();
		});
		inventory.parse(instream);
	});

	it('addHost() sticks var definitions onto the end of host lines', function()
	{
		var inventory = new Inventory();
		inventory.addHost('host', 'group', ['var1=val1', 'var2=val2']);
		var output = inventory.stringify();
		var lines = output.split('\n');
		lines[0].must.equal('[group]');
		lines[1].must.match(/ var1=val1/);
		lines[1].must.match(/ var2=val2/);
	});

	it('addHost() replaces host entries & does not duplicate them', function(done)
	{
		var instream = fs.createReadStream(path.join(invdir, 'inventory1'), 'ascii');
		var inventory = new Inventory();
		inventory.once('finish', function()
		{
			inventory.contents[0].items.length.must.equal(1);
			inventory.addHost('host1', 'section1', ['var=val']);
			inventory.contents[0].items.length.must.equal(1);
			inventory.contents[0].items[0].must.match(/var=val$/);
			done();
		});
		inventory.parse(instream);
	});

	it('removeHost() must remove the host from each group', function(done)
	{
		var instream = fs.createReadStream(path.join(invdir, 'inventory1'), 'ascii');
		var inventory = new Inventory();
		inventory.once('finish', function()
		{
			inventory.contents[0].items.length.must.equal(1);
			inventory.contents[3].items.length.must.equal(2);
			inventory.removeHost('removeme');
			inventory.contents[0].items.length.must.equal(1);
			inventory.contents[3].items.length.must.equal(2);
			done();
		});
		inventory.parse(instream);
	});
});
