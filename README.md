# Logbook

A sailing logbook featuring

- GPX files for showing tracks on OpenLayers map
- OpenSeaMap overlay

The application is based on ES6 and [Lit](https://lit.dev/). 

The source files are loaded directly by the browser, so there is no build, no packaging no nothing :)

Loading is done through import maps using [jspm.org](https://jspm.org/docs/cdn).

The packages declared in `package.json` are only used for development time type checking and documentation.

Styling is provided by the excellent [Surface project](https://github.com/mildrenben/surface).

## TODO

- Analysis of tracks using Google Charts
- Historical weather data
