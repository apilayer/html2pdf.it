html2pdf.it
===========
Using PhantomJS to generate PDFs, via a webservice. Runs using [Node.js](http://nodejs.org).

See it in action at: [html2pdf.it](http://www.html2pdf.it).

Ready to fork and push to [Heroku](http://heroku.com) (where I run it).

Works out of the box on both Windows and Ubuntu.

On Mac you need to:
```shell
brew install phantomjs
```

To get started you need to clone the repository, cd to it and run:
-----------
```shell
npm install
```

Running webserver locally
-----------
This also opens your webbrowser on the local webserver:
```shell
node open.js
```

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
