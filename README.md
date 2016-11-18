![logo](http://html2pdf.it/favicon-32x32.png) [html2pdf.it](http://www.html2pdf.it)
===========
Generate PDFs from any web-page. You need [Node.js](http://nodejs.org) to run it.

See it in action at: [html2pdf.it](http://www.html2pdf.it).


Works out of the box on any operating system supported by [phantomjs-prebuilt](http://npm.im/phantomjs-prebuilt); this specifically includes Windows, macOS, and most Linux distributions.

To get started you need to clone the repository, cd to it and run:
-----------
```shell
npm install
```

Running webserver locally
-----------
```shell
node open.js
```
This also opens your web-browser pointing to your locally running html2pdf.it:


Running webserver
-----------
```
node .
```
If you want to host html2pdf.it yourself, you will have to ask your host if they support hosting Node.js applications.

If your host does not support Node.js, you'll need to find a new host
that does. Check out [Heroku](http://heroku.com) or [Nodejitsu](http://nodejitsu.com) for example.

Running tests
-----------
```shell
npm test
```

Page breaks
-----------
You can use the CSS attribute:
```css
page-break-before: always;
```

License
-------
MIT
