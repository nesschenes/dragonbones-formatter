# DragonBones Formatter

This is a micro application based on Electron.

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/nesschenes/dragonbones-formatter.git
# Go into the repository
cd dragonbones-formatter
# Install dependencies
npm install
# Run the app
npm start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Re-compile automatically

To recompile automatically and to allow using [electron-reload](https://github.com/yan-foto/electron-reload), run this in a separate terminal:

```bash
npm run watch
```

## To Pack

Generates the package directory without really packaging it. This is useful for testing purposes).

```bash
npm run pack
```

The location of the archived files should be ./archives by default.

## To Archive

Package the application in a distributable format (e.g. dmg, windows installer, deb package)).

```bash
npm run archive
```

The location of the archived files should be ./archives by default.

## License

[GNU General Public License v3.0](LICENSE.md)
