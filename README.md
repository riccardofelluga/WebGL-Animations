# WebGL-Animations

This is the repository for the course project of WWW Application _CS-E4460_ @Aalto university. It implements a POC to render animations in the browser with [WebGL](https://www.khronos.org/webgl/)

## Quick start

Getting up and running is very easy, thanks to [Parcel.js](https://parceljs.org/) you'll need to run just these two commands in sequence: `npm install` and `npm start`. 

🛠 Quick troubleshooting tip: Parcel can be started with caching disabled by running `npm run no-cache`.
## License

This repository is [GPLv3](https://github.com/riccardofelluga/WebGL-Animations/blob/main/LICENSE.md) licensed.

## Generating animated .obj files

The `generate-obj.py` script is used for generating `.obj` files with vertex animations based on existing `.obj` files.

First add control points to the original file before using the script (i.e. `c x0 y0 z0 x1 y1 z1...`).

Then generate the new file with:
```bash
$ ./scripts/generate-obj.py <path/to/obj/file>
```

A new file called `<original file name>-animated.obj` will be generated.