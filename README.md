# ansivetory

Add and remove hosts from ansible inventory files.

Parses existing files & preserves whitespace & comments.

## Usage

```
index.js [--var name=val] [--group groupname] --host foo.example.com /path/to/
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

## LICENSE

ISC.
