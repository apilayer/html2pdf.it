html2pdf.it
===========
Using PhantomJS to generate PDFs, via a webservice. Runs using Node.js.

See it in action at: [html2pdf.it](http://www.html2pdf.it).

Ready to fork and push to Heroku (where I run it).

Works out of the box on both Windows and Ubuntu.

On Mac you need to:
```
brew install phantomjs
```

To get started you need to clone the repository, cd to it and run.
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
node lib/app.js
```
If you want to host html2pdf.it yourself, you will have to ask your host if they support hosting Node.js applications.
Node.js is still new, so a lot of hosts don't support it. 

If your host does not support Node.js you'll need to find a new host that does. Check out Heroku.com or nodejitsu.com, for example.

Running tests
-----------
```
npm test
```

Node modules used
----------------
- Routing etc. is done with `express`
- Testing is done with `mocha`, `chai` and `sinon`, using BDD style tests.
- JSHint is run on the JavaScript code

Node version
------------
Version 0.10+ of Node.js is required (Domains are used for catching errors, and domains were not really stable before 0.10).
