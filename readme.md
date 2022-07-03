<p align="center">
  <img src="https://raw.githubusercontent.com/narcha/demoman/main/githubassets/Banner.png"
       height="200">
</p>
<p align="center">
  <a href="https://www.codefactor.io/repository/github/narcha/demoman" alt="CodeFactor">
    <img alt="CodeFactor" src="https://img.shields.io/codefactor/grade/github/narcha/demoman?style=for-the-badge"></a>
  <a href="https://discord.gg/GduKxhYFhR">
    <img alt="Discord" src="https://img.shields.io/discord/966262251944292372?style=for-the-badge"></a>
  <a href="https://github.com/Narcha/DemoMan/blob/main/LICENSE.txt">
    <img alt="GitHub" src="https://img.shields.io/github/license/Narcha/Demoman?style=for-the-badge"></a>
  <a href="https://github.com/Narcha/DemoMan/releases/latest">
    <img alt="GitHub release" src="https://img.shields.io/github/v/release/narcha/demoman?include_prereleases&style=for-the-badge"></a>
</p>

# DemoMan

A TF2 demo manager for Linux, Windows and MacOS built with [Electron](https://www.electronjs.org/)

## P-REC compatibility

DemoMan primarily uses the event format used by the demo support commands in vanilla TF2.
This format stores each demo's events in a JSON file with the same name as the demo.
P-REC uses a different format: it records all events in a single text file.
DemoMan can convert the P-REC file to the "standard format", and there is also
limited optional support for loading a P-REC file directly. If you don't absolutely rely on P-REC,
you are encouraged to use the standard format.

## Installing

Grab the latest prebuilt version [here](https://github.com/Narcha/DemoMan/releases) or [build it yourself](#Developing).

## Developing

Prerequisites: [node.js](https://nodejs.org/en/download/) and npm (included in node.js).

Clone the repository and run `npm install`.

Start the program by running `npm start`.

Create a packaged executable by running `npm run package`.

## License

DemoMan is [free software](https://www.gnu.org/philosophy/free-sw.html) released under the [GNU GPLv3](LICENSE) license.
