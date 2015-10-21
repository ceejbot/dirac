var
	assert = require('assert'),
	fs     = require('fs')
;

var Inventory = module.exports = function Inventory(fpath)
{
	assert(fpath && typeof fpath === 'string', 'you must pass an inventory file path to the constructor');
	this.path = fpath;
	this.contents = [];
	this.secmap = {};
};

Inventory.prototype.parsed = false;
Inventory.prototype.path = null;
Inventory.prototype.contents = null;
Inventory.prototype.secmap = null;

Inventory.prototype.parse = function parse()
{
	if (this.parsed) return;
	var data = fs.readFileSync(this.path, 'utf8');
	var section;
	var lines = data.split(/[\r\n]/g);


	while (lines.length)
	{
		var line = lines.shift();
		if (!line || line.match(/^\s+$/))
		{
			this.contents.push('');
			continue;
		}

		if (line.match(/^#/))
		{
			this.contents.push(line);
			continue;
		}

		var matches = line.match(/^\[([^\]]+)\]$/);
		if (matches)
		{
			section = { name: matches[1], items: [] };
			this.secmap[section.name] = this.contents.length;
			this.contents.push(section);
			continue;
		}

		if (section)
			section.items.push(line);
		else
			this.contents.push(line);
	}

	this.parsed = true;
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

	return result.join('\n');
};

Inventory.prototype.addHost = function addHost(host, groups, vars)
{
	var self = this;
	var hostVal = host + (vars ? ' ' + vars.join(' ') : '');
	hostVal = hostVal.trim();
	if (!Array.isArray(groups)) groups = [groups];

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
			if (self.contents.length > 0) self.contents.push(''); // blank line before new section
			self.secmap[section.name] = self.contents.length;
			self.contents.push(section);
		}

		// TODO uniquify
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
