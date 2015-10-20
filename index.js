#!/usr/bin/env node

var
	Inventory = require('./ansible'),
	fs        = require('fs'),
	yargs     = require('yargs')
	.option('host',
	{
		alias: 'h',
		description: 'the host to add or remove'
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
		array: true,
		default: 'generic',
	})
	.option('vars',
	{
		alias: 'v',
		description: 'host vars to set',
		array: true
	})
	.demand(1)
;

if (require.main === module)
{
    var argv = yargs.argv;
	var ipath = argv._[0];

	var inventory = new Inventory(ipath);
	inventory.parse(ipath);
	if (argv.remove)
		inventory.removeHost(argv.h);
	else
		inventory.addHost(argv.h, argv.g, argv.v);
	var output = inventory.stringify(inventory);
	console.log(output);
}
