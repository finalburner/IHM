# csv-utility
A simple package to guess the separator and linebreak characters for a "csv" file.
[![NPM](https://nodei.co/npm/csv-utility.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/csv-utility/)
[![NPM](https://nodei.co/npm-dl/csv-utility.png)](https://nodei.co/npm/csv-utility/)

### Installation
#### Node
```
npm install csv-utility
```
#### Bower
```
bower install csv-utility
```

### Quick start
#### Node
```
var csvUtility = require('csv-utility');
var fs = require('fs');
var sample = fs.readFileSync('someFile.csv',{encoding:'utf8'});
var result = csvUtility.guessCSV(sample,{
  linebreak: [';'],
  sep: [':']
});
```

#### Browser
```
var result = csvUtility.guessCSV(sample,{
  linebreak: [';'],
  sep: [':']
});
```

### Functions
#### csvUtility.guessCSV(sample[,opts])
* `sample` - a sample string of the raw csv (auto-cropped to 100kb)
* `opts` (optional) - a configuration to specify additional possible separator or linebreak characters
  * `linebreak` - the linebreak characters to use OR an array of possible linebreak characters (default: ["\r\n", "\r", "\n"])
  * `sep` - the separator character to use OR an array of possible separator characters (default: [",", "\t", "|", ";"])
* `return` 
  * `linebreak` - the most possible linebreak characters
  * `sep` - the most possible separator characters

#### csvUtility.guessLinebreak(sample[,opts])
* `sample` - a sample string of the raw csv (auto-cropped to 100kb)
* `opts` (optional) - an array of possible linebreak characters (default: ["\r\n", "\r", "\n"])
* `return` - the most possible linebreak characters

#### csvUtility.guessSeparator(sample,[linebreak,opts])
* `sample` - a sample string of the raw csv (auto-cropped to 100kb)
* `linebreak` - the linebreak character to use (default: "\n")
* `opts` (optional) - an array of possible separator characters (default: [",", "\t", "|", ";"])
* `return` - the most possible separator characters

### History
1.0.0 Initial release
1.0.1 BUGFIX: Corrected the documentation for csvUtility.guessSeparator. 
1.0.2 BUGFIX: Forgot to push the changes for the codes. 
1.0.3 BUGFIX: Fixed bug at parsing non-array inputs. 
1.0.4 UPDATE: Modified the error weights for the separator detection, to reduce noise from low frequency separator characters. 
