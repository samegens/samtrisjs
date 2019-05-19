# SAMTrisJS
Tetris clone built to experiment with the [HTML5 canvas](https://www.w3schools.com/html/html5_canvas.asp).

![samtris](https://github.com/samegens/samtrisjs/blob/master/screenshots/samtris.png?raw=true) ![game](https://github.com/samegens/samtrisjs/blob/master/screenshots/game.png?raw=true) ![highscore](https://github.com/samegens/samtrisjs/blob/master/screenshots/highscore.png?raw=true)

## Features

- Event driven single page application, completely within a canvas.
- Uses [Require.js](http://requirejs.org/) to structure the Javascript in modules.
- Uses [Radio.js](http://radio.uxder.com/) to respond to events.
- Loads all Tetris segments from a single [image file](https://github.com/samegens/samtrisjs/blob/master/img/blocks.png?raw=true).
- Menu.
- High scores (only client side, not persisted).
- Unit tests using [QUnit](https://qunitjs.com/).
- Custom font, created with [FontStruct](http://fontstruct.com/) and converted to woff with [ttf-to-woff](http://everythingfonts.com/ttf-to-woff)
- Runs from file system, no web server necessary. However, a version (not always up to date) is running in [Azure](https://azure.microsoft.com/) on [http://samtris.azurewebsites.net](http://samtris.azurewebsites.net).

## Run in Docker

- Use the Vagrantfile if you can't run Docker locally, for example when you have Windows 10 Home. See [Vagrant](https://www.vagrantup.com/) for more information.
- To create the image:
```
git clone https://github.com/samegens/samtrisjs
cd samtrisjs
docker build -t samtrisjs .
docker run -d --name samtrisjs -p 8080:80 samtrisjs
```
- Point your browser to http://localhost:8080, or replace localhost by the IP-address of the VM.

To clean up:
```
docker kill samtrisjs
docker rm samtrisjs
```