#!/usr/bin/env node
var program = require('commander');
var request = require('superagent');
var co = require('co');
var prompt = require('co-prompt');

program
  .option('-l, --lan', 'Län lista')
  .option('-k, --kommuner', 'Kommuner lista')
  .parse(process.argv)
;

if (program.lan) {
  co(function *() {
    request
      .get('http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/lan')
      .set('accept', 'application/json')
      .set('accept-language', 'sv')
      .end(function (err, res) {
        if (err) {
          console.log('Någonting gick fel', err);
        }

        var lanLista = res.body.soklista.sokdata;
        console.log('Län lista\nID\tNamn');
        lanLista
          .sort(function(itemA, itemB) {
            return itemA.id - itemB.id;
          })
          .forEach(function(item) {
            console.log('%s\t%s', item.id, item.namn);
          })
        ;
      })
    ;

    return;
    })
  ;
}

if (program.kommuner) {
  co(function *() {
    var lanid = yield prompt('Vilken lanid: ');

    request
      .get('http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/kommuner')
      .query({'lanid': lanid})
      .set('accept', 'application/json')
      .set('accept-language', 'sv')
      .end(function (err, res) {
        if (err) {
          switch (err.response.status) {
            case 400:
              console.log('Länet med ID %s var inte hittat', lanid);
              break;

            default:
              console.log('Någonting gick fel', err.response);
              break;
          }

          return;
        }

        var kommunerLista = res.body.soklista.sokdata;
        console.log('Kommuner lista i Stockholm\nID\tNamn');
        kommunerLista
          .sort(function(itemA, itemB) {
            return itemA.id - itemB.id;
          })
          .forEach(function(item) {
            console.log('%s\t%s', item.id, item.namn);
          })
        ;
      })
    ;

    return; 
    })
  ;
}