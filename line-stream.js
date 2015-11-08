var
    stream = require('stream'),
    util   = require('util')
;

var LineStream = module.exports = function LineStream(opts)
{
    opts = opts || {};
    opts.end = false;

    stream.Transform.call(this, opts);
};
util.inherits(LineStream, stream.Transform);

LineStream.prototype._transform = function _transform(chunk, encoding, callback)
{
    if (this.buffer)
    {
        chunk = Buffer.concat([this.buffer, chunk]);
        this.buffer = null;
    }

    var ptr = 0, start = 0;
    while (ptr < chunk.length)
    {
        if (chunk[ptr] === 0x0a)
        {
            this.push(chunk.slice(start, ++ptr));
            start = ptr;
        }
        else
            ptr++;
    }

    if (start < chunk.length)
        this.buffer = chunk.slice(start);

    callback();
};

LineStream.prototype._flush = function _flush(callback)
{
    if (this.buffer && this.buffer.length)
        this.push(this.buffer);
    this.buffer = null;
    callback();
};
