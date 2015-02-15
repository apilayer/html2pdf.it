html2pdf.it
===========
Using PhantomJS to generate pdfs, via a webservice. Runs using node.js.

See it in action at: [html2pdf.it](http://www.html2pdf.it).

Ready to fork and push to heroku (where I run it).

Works out of the box on both windows and ubuntu.

On Mac you need to
```
brew install phantomjs
```

To get started you need to clone the repository, cd to it and run
-----------
```
npm install
```

Running webserver locally
-----------
This also opens your webbrowser on the local webserver
```
node open.js
```

Running webserver
-----------
```
node .
```
If you want to host html2pdf.it yourself, you will have to ask your host if they support hosting Node.js applications.

If your host does not support Node.js. You need to find a new host
that does. Heroku.com or nodejitsu.com for example.

Running tests
-----------
```
npm test
```
