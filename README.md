# @ceejbot/dirac

[![Greenkeeper badge](https://badges.greenkeeper.io/ceejbot/dirac.svg)](https://greenkeeper.io/)

Add and remove hosts from ansible inventory files.

Parses existing files & preserves whitespace & comments.

[![on npm](http://img.shields.io/npm/v/@ceejbot/dirac.svg?style=flat)](https://www.npmjs.org/package/@ceejbot/dirac)  [![Tests](http://img.shields.io/travis/ceejbot/dirac.svg?style=flat)](http://travis-ci.org/ceejbot/dirac) [![Coverage](http://img.shields.io/coveralls/ceejbot/dirac.svg?style=flat)](https://coveralls.io/r/ceejbot/dirac)

## Usage

Install: `npm install -g @ceejbot/dirac`

Then run:

```
cat /path/to/inventory | dirac [--var name=val] [--group groupname] foo.example.com > output

Options:
  --remove     remove this host from inventory; all other options ignored [boolean]
  --group, -g  one or more groups to add this host to       [default: "generic"]
  --var, -v    host vars to set; name=val format
  --version    show version information                                [boolean]
  --help       Show help                                               [boolean]
```

You can specify as many `var` and `group` options as you need.

## Notes

The Dirac Communicator is James Blish's name for an ansible-like communication device.

## TODO

Handle variables better.

## LICENSE

ISC.
