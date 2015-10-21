#!/usr/bin/env node

var
	Inventory = require('./ansible'),
	yargs     = require('yargs')
	.option('host',
	{
		alias: 'h',
		description: 'the host to add or remove',
		required: true
	})
	.option('remove',
	{
		type: 'boolean',
		description: 'remove this host from inventory; all other options ignored'
	})
	.option('group',
	{
		alias: 'g',
		description: 'one or more groups to add this host to',
		default: 'generic',
		example: '--group monitoring --group web'
	})
	.option('var',
	{
		alias: 'v',
		description: 'host vars to set; name=val format',
	})
	.help('help')
	.usage('add and remove hosts from the given ansible inventory file\n$0 [--var name=val] [--group groupname] --host foo.example.com /path/to/inventory')
	.demand(1)
;

if (require.main === module)
{
    var argv = yargs.argv;
	var ipath = argv._[0];

	if (argv.help)
	{
		process.exit(0);
	}

	var inventory = new Inventory(ipath);
	inventory.parse(ipath);
	if (argv.remove)
		inventory.removeHost(argv.h);
	else
		inventory.addHost(argv.h, argv.g, argv.v);
	var output = inventory.stringify(inventory);
	console.log(output);
}
