# @ceejbot/dirac

Add and remove hosts from ansible inventory files.

Parses existing files & preserves whitespace & comments.

[![on npm](http://img.shields.io/ceejbot/v/@ceejbot/dirac.svg?style=flat)](https://www.npmjs.org/package/@ceejbot/dirac)  [![Tests](http://img.shields.io/travis/ceejbot/dirac.svg?style=flat)](http://travis-ci.org/ceejbot/dirac)  
## Usage

Install: `npm install -g @ceejbot/dirac`

Then run:

```
dirac [--var name=val] [--group groupname] --host foo.example.com /path/to/
inventory

Options:
  --host, -h   the host to add or remove                              [required]
  --remove     remove this host from inventory; all other options ignored
                                                                       [boolean]
  --group, -g  one or more groups to add this host to       [default: "generic"]
  --var, -v    host vars to set; name=val format
  --help       Show help                                               [boolean]
```

You can specify as many `var` and `group` options as you need.

## Notes

The Dirac Communicator is James Blish's name for an ansible-like communication device.

## LICENSE

ISC.
