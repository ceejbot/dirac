# ansivetory

Add and remove hosts from ansible inventory files.

Parses existing files & preserves whitespace & comments.

## Usage

```
Options:
  --host, -h   the host to add or remove
  --remove     remove this host from inventory; all other options ignored
                                                                       [boolean]
  --group, -g  one or more groups to add this host to
                                                    [array] [default: "generic"]
  --vars, -v   host vars to set                                          [array]
```

## LICENSE

ISC.
