var
	Lines  = require('./line-stream'),
	stream = require('stream'),
	util   = require('util')
	;

var Inventory = module.exports = function Inventory(opts)
{
	stream.Writable.call(this, opts);
	this.contents = [];
	this.secmap = {};
};
util.inherits(Inventory, stream.Writable);

Inventory.prototype.contents = null;
Inventory.prototype.secmap = null;
Inventory.prototype.section = null;

Inventory.prototype._write = function _write(data, encoding, callback)
{
	var line = data.toString('utf8').replace(/\n$/, '');
	if (!line || line.match(/^\s+$/))
	{
		this.contents.push('');
		return callback();
	}

	if (line.match(/^#/))
	{
		this.contents.push(line);
		return callback();
	}

	var matches = line.match(/^\[([^\]]+)\]$/);
	if (matches)
	{
		this.section = { name: matches[1], items: [] };
		this.secmap[this.section.name] = this.contents.length;
		this.contents.push(this.section);
		return callback();
	}

	if (this.section)
		this.section.items.push(line);
	else
		this.contents.push(line);

	callback();
};

Inventory.prototype.parse = function parse(src)
{
	var lines = new Lines();
	src.pipe(lines).pipe(this);
};

Inventory.prototype.stringify = function stringify()
{
	var result = [];
	var entries = this.contents;

	entries.forEach(function(entry)
	{
		if (!entry)
			result.push(entry);
		else if (typeof entry === 'string')
			result.push(entry);
		else if (!entry.name)
			result.push(JSON.stringify(entry));
		else
		{
			result.push('[' + entry.name + ']');
			entry.items.forEach(function(h) { if (h) result.push(h); });
		}
	});

	var output =  result.join('\n') + '\n';
	output = output.replace(/\n{3,}/g, '\n\n');
	return output;
};

Inventory.prototype.addHost = function addHost(host, groups, vars)
{
	if (!Array.isArray(groups)) groups = [groups];
	if (!Array.isArray(vars)) vars = [vars];
	var self = this;
	var hostVal = host + (vars ? ' ' + vars.join(' ') : '');
	hostVal = hostVal.trim();

	groups.forEach(function(g)
	{
		var section;
		if (self.secmap.hasOwnProperty(g))
		{
			section = self.contents[self.secmap[g]];
		}
		else
		{
			section = { name: g, items: [] };
			// blank line before new section but no runs of blanks
			if (self.contents.length > 0 && self.contents[self.contents.length - 1] !== '')
				self.contents.push('');
			self.secmap[section.name] = self.contents.length;
			self.contents.push(section);
		}

		for (var i = 0; i < section.items.length; i++)
		{
			if (section.items[i].indexOf(host) === 0)
			{
				section.items[i] = hostVal;
				return;
			}
		}

		section.items.push(hostVal);
	});
};

Inventory.prototype.removeHost = function removeHost(host)
{
	var self = this;
	var sections = Object.keys(this.secmap);

	sections.forEach(function(k)
	{
		var section = self.contents[self.secmap[k]];
		section.items = section.items.filter(function(i)
		{
			return !i.match(host);
		});
	});
};
