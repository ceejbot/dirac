#!/usr/bin/env node

var
	Inventory = require('./inventory'),
	yargs     = require('yargs')
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
	.usage('add and remove hosts from the ansible inventory input stream\ncat /path/to/inventory | $0 [--var name=val] [--group groupname] foo.example.com > output')
	.demand(1)
;

if (require.main === module)
{
    var argv = yargs.argv;
	var host = argv._[0];

	if (argv.help)
	{
		process.exit(0);
	}

	var inventory = new Inventory();
	inventory.once('finish', function()
	{
		if (argv.remove)
			inventory.removeHost(host);
		else
			inventory.addHost(host, argv.g, argv.v);
		var output = inventory.stringify(inventory);
		console.log(output);
	});
	inventory.parse(process.stdin);
}
