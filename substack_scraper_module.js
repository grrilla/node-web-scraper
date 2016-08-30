var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var path = require('path');
var csvWriter = require('csv-write-stream');

var writer = csvWriter({sendHeaders: false});

const targetURL = 'http://substack.net/images/';

var scrapeSubStack = function(outputFile) {
  request(targetURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
      //parseHTMLtoCSV($,outputFile);
      var perms = [];
      var absoluteURLs = [];

      $('td:first-child').find('code').each(function(index, element) {
        perms.push(element.children[0].data);
      });

      $('td:last-child').find('a').each(function(index, element) {
        absoluteURLs.push('http://substack.net' + element.attribs['href']);
      });

      writer.pipe(fs.createWriteStream(outputFile));

      var fileType;
      for (var i = 0; i < perms.length; i++) {
        if (perms[i].charAt(1) == 'd') {
          fileType = 'DIR';
          console.log(fileType)
        } else {
          fileType = path.extname(absoluteURLs[i]);
          console.log(fileType)
        }
        writer.write({'PERMISSIONS' : perms[i], 'URLS' : absoluteURLs[i], 'TYPES' : fileType });
      }
      writer.end();
    }
  });
}

function parseHTMLtoCSV($,outputFile) {
  var perms = [];
  var absoluteURLs = [];

  $('td:first-child').find('code').each(function(index, element) {
    perms.push(element.children[0].data);
  });

  $('td:last-child').find('a').each(function(index, element) {
    absoluteURLs.push('http://substack.net' + element.attribs['href']);
  });

  writer.pipe(fs.createWriteStream(outputFile));

  var fileType;
  for (var i = 0; i < perms.length; i++) {
    if (perms[i].charAt(1) == 'd') {
      fileType = 'DIR';
      console.log(fileType)
    } else {
      fileType = path.extname(absoluteURLs[i]);
      console.log(fileType)
    }
    writer.write({'PERMISSIONS' : perms[i], 'URLS' : absoluteURLs[i], 'TYPES' : fileType });
  }
  writer.end();
}

module.exports = scrapeSubStack;
