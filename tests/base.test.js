'use strict';

if (!global._babelPolyfill) require('babel-polyfill');
var R = require('ramda');
var request = require('request');
var t = require('tap');
var path = require('path');
var schemaManager = require('../schemaManager');

var getConsole = function getConsole(serviceName, serviceId, pack) {
  return require('../utils').getConsole({ error: true, debug: true, log: false, warn: true }, serviceName, serviceId, pack);
};
var CONSOLE = getConsole('BASE TEST', '----', '-----');

t.test('*** NET ***', {
  autoend: true
}, function mainTest(t) {
  var schema1, schema2, updateSchema1, updateSchema2, allSchemas, savePath, schemaManager1, schemaManager2;
  return regeneratorRuntime.async(function mainTest$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          schema1 = {
            config1: {
              item: 'test1'
            },
            config2: {
              item: 'test1'
            }
          };
          schema2 = {
            config1: {
              item: 'test2'
            },
            config2: {
              item: 'test2'
            }
          };

          updateSchema1 = function updateSchema1() {
            return schema1;
          };

          updateSchema2 = function updateSchema2() {
            return schema2;
          };

          allSchemas = { service1: schema1, service2: schema2 };
          savePath = path.join(__dirname, './schema');
          schemaManager1 = schemaManager({ updateSchema: updateSchema1, savePath: savePath, serviceName: 'service1', intervall: 1000, defaultField: 'config1' });
          schemaManager2 = schemaManager({ updateSchema: updateSchema2, savePath: savePath, serviceName: 'service2', intervall: 1000, defaultField: 'config1' });


          t.plan(17);
          t.same(schemaManager1.get(), schema1.config1, 'get()');
          t.same(schemaManager1.get('config2'), schema1.config2, "get('config2')");
          t.same(schemaManager1.get('config2', 'service2'), schema2.config2, "get('config2','service2')");
          t.same(schemaManager1.get('config2', '*').length, 2, "get('config2', '*').length");
          t.same(schemaManager1.get('config2', '*')[0].items, schema1.config2, "get('config2', '*')[0].items");
          t.same(schemaManager1.get('config2', '*', 'service1').length, 1, "get('config2', '*', 'service1').length");
          t.same(schemaManager1.get('config2', '*', 'service1')[0].items, schema2.config2, "get('config2', '*', 'service1')[0].items");
          t.same(schemaManager1.get('config2', '*', 'service1')[0].service, 'service2', "get('config2', '*', 'service1')[0].service");

          schema1.config1 = {
            item: 'test1 updated'
          };
          schema1.config2 = {
            item: 'test2 updated'
          };
          schema2.config2 = {
            item: 'test2 updated'
          };
          t.notSame(schemaManager1.get(), schema1.config1, 'get() CHANGE not propagated');

          _context.next = 23;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 1100);
          }));

        case 23:

          t.same(schemaManager1.get(), schema1.config1, 'get() AFTER CHANGE');
          t.same(schemaManager1.get('config2'), schema1.config2, "get('config2') AFTER CHANGE");
          t.same(schemaManager1.get('config2', 'service2'), schema2.config2, "get('config2','service2') AFTER CHANGE");
          t.same(schemaManager1.get('config2', '*').length, 2, "get('config2', '*').length AFTER CHANGE");
          t.same(schemaManager1.get('config2', '*')[0].items, schema1.config2, "get('config2', '*')[0].items AFTER CHANGE");
          t.same(schemaManager1.get('config2', '*', 'service1').length, 1, "get('config2', '*', 'service1').length AFTER CHANGE");
          t.same(schemaManager1.get('config2', '*', 'service1')[0].items, schema2.config2, "get('config2', '*', 'service1')[0].items AFTER CHANGE");
          t.same(schemaManager1.get('config2', '*', 'service1')[0].service, 'service2', "get('config2', '*', 'service1')[0].service AFTER CHANGE");

          t.end();
          // process.exit()

        case 32:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}).then(function () {
  return process.exit();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UudGVzdC5lczYiXSwibmFtZXMiOlsiZ2xvYmFsIiwiX2JhYmVsUG9seWZpbGwiLCJyZXF1aXJlIiwiUiIsInJlcXVlc3QiLCJ0IiwicGF0aCIsInNjaGVtYU1hbmFnZXIiLCJnZXRDb25zb2xlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJwYWNrIiwiZXJyb3IiLCJkZWJ1ZyIsImxvZyIsIndhcm4iLCJDT05TT0xFIiwidGVzdCIsImF1dG9lbmQiLCJtYWluVGVzdCIsInNjaGVtYTEiLCJjb25maWcxIiwiaXRlbSIsImNvbmZpZzIiLCJzY2hlbWEyIiwidXBkYXRlU2NoZW1hMSIsInVwZGF0ZVNjaGVtYTIiLCJhbGxTY2hlbWFzIiwic2VydmljZTEiLCJzZXJ2aWNlMiIsInNhdmVQYXRoIiwiam9pbiIsIl9fZGlybmFtZSIsInNjaGVtYU1hbmFnZXIxIiwidXBkYXRlU2NoZW1hIiwiaW50ZXJ2YWxsIiwiZGVmYXVsdEZpZWxkIiwic2NoZW1hTWFuYWdlcjIiLCJwbGFuIiwic2FtZSIsImdldCIsImxlbmd0aCIsIml0ZW1zIiwic2VydmljZSIsIm5vdFNhbWUiLCJQcm9taXNlIiwicmVzb2x2ZSIsInNldFRpbWVvdXQiLCJlbmQiLCJ0aGVuIiwicHJvY2VzcyIsImV4aXQiXSwibWFwcGluZ3MiOiI7O0FBQ0EsSUFBSSxDQUFDQSxPQUFPQyxjQUFaLEVBQTJCQyxRQUFRLGdCQUFSO0FBQzNCLElBQUlDLElBQUlELFFBQVEsT0FBUixDQUFSO0FBQ0EsSUFBSUUsVUFBVUYsUUFBUSxTQUFSLENBQWQ7QUFDQSxJQUFJRyxJQUFJSCxRQUFRLEtBQVIsQ0FBUjtBQUNBLElBQUlJLE9BQU9KLFFBQVEsTUFBUixDQUFYO0FBQ0EsSUFBSUssZ0JBQWdCTCxRQUFRLGtCQUFSLENBQXBCOztBQUVBLElBQU1NLGFBQWEsU0FBYkEsVUFBYSxDQUFDQyxXQUFELEVBQWNDLFNBQWQsRUFBeUJDLElBQXpCO0FBQUEsU0FBa0NULFFBQVEsVUFBUixFQUFvQk0sVUFB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QWVPLEdBQWYsQ0FBbUIsU0FBbkIsRUFBOEIsR0FBOUIsRUFBbUMsVUFBbkMsRUFBK0NDLE1BQXRELEVBQThELENBQTlELEVBQWlFLHFEQUFqRTtBQUNBcEMsWUFBRWtDLElBQUYsQ0FBT04sZUFBZU8sR0FBZixDQUFtQixTQUFuQixFQUE4QixHQUE5QixFQUFtQyxVQUFuQyxFQUErQyxDQUEvQyxFQUFrREUsS0FBekQsRUFBZ0VsQixRQUFRRCxPQUF4RSxFQUFpRix1REFBakY7QUFDQWxCLFlBQUVrQyxJQUFGLENBQU9OLGVBQWVPLEdBQWYsQ0FBbUIsU0FBbkIsRUFBOEIsR0FBOUIsRUFBbUMsVUFBbkMsRUFBK0MsQ0FBL0MsRUFBa0RHLE9BQXpELEVBQWtFLFVBQWxFLEVBQThFLHlEQUE5RTs7QUFFQXRDLFlBQUUyQyxHQUFGO0FBQ0E7O0FBNURDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBRkgsRUErREdDLElBL0RILENBK0RRO0FBQUEsU0FBTUMsUUFBUUMsSUFBUixFQUFOO0FBQUEsQ0EvRFIiLCJmaWxlIjoiYmFzZS50ZXN0LmVzNiIsInNvdXJjZXNDb250ZW50IjpbIlxuaWYgKCFnbG9iYWwuX2JhYmVsUG9seWZpbGwpcmVxdWlyZSgnYmFiZWwtcG9seWZpbGwnKVxudmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgcmVxdWVzdCA9IHJlcXVpcmUoJ3JlcXVlc3QnKVxudmFyIHQgPSByZXF1aXJlKCd0YXAnKVxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbnZhciBzY2hlbWFNYW5hZ2VyID0gcmVxdWlyZSgnLi4vc2NoZW1hTWFuYWdlcicpXG5cbmNvbnN0IGdldENvbnNvbGUgPSAoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgcGFjaykgPT4gcmVxdWlyZSgnLi4vdXRpbHMnKS5nZXRDb25zb2xlKHtlcnJvcjogdHJ1ZSwgZGVidWc6IHRydWUsIGxvZzogZmFsc2UsIHdhcm46IHRydWV9LCBzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBwYWNrKVxudmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKCdCQVNFIFRFU1QnLCAnLS0tLScsICctLS0tLScpXG5cbnQudGVzdCgnKioqIE5FVCAqKionLCB7XG4gIGF1dG9lbmQ6IHRydWVcbn0sIGFzeW5jIGZ1bmN0aW9uIG1haW5UZXN0ICh0KSB7XG4gIHZhciBzY2hlbWExID0ge1xuICAgIGNvbmZpZzE6IHtcbiAgICAgIGl0ZW06ICd0ZXN0MSdcbiAgICB9LFxuICAgIGNvbmZpZzI6IHtcbiAgICAgIGl0ZW06ICd0ZXN0MSdcbiAgICB9XG4gIH1cblxuICB2YXIgc2NoZW1hMiA9IHtcbiAgICBjb25maWcxOiB7XG4gICAgICBpdGVtOiAndGVzdDInXG4gICAgfSxcbiAgICBjb25maWcyOiB7XG4gICAgICBpdGVtOiAndGVzdDInXG4gICAgfVxuICB9XG5cbiAgdmFyIHVwZGF0ZVNjaGVtYTEgPSAoKSA9PiBzY2hlbWExXG4gIHZhciB1cGRhdGVTY2hlbWEyID0gKCkgPT4gc2NoZW1hMlxuICB2YXIgYWxsU2NoZW1hcyA9IHsgc2VydmljZTE6IHNjaGVtYTEsIHNlcnZpY2UyOiBzY2hlbWEyIH1cbiAgdmFyIHNhdmVQYXRoID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJy4vc2NoZW1hJylcblxuICB2YXIgc2NoZW1hTWFuYWdlcjEgPSBzY2hlbWFNYW5hZ2VyKHsgdXBkYXRlU2NoZW1hOiB1cGRhdGVTY2hlbWExLCBzYXZlUGF0aCwgc2VydmljZU5hbWU6ICdzZXJ2aWNlMScsIGludGVydmFsbDogMTAwMCwgZGVmYXVsdEZpZWxkOiAnY29uZmlnMScgfSlcbiAgdmFyIHNjaGVtYU1hbmFnZXIyID0gc2NoZW1hTWFuYWdlcih7IHVwZGF0ZVNjaGVtYTogdXBkYXRlU2NoZW1hMiwgc2F2ZVBhdGgsIHNlcnZpY2VOYW1lOiAnc2VydmljZTInLCBpbnRlcnZhbGw6IDEwMDAsIGRlZmF1bHRGaWVsZDogJ2NvbmZpZzEnIH0pXG5cbiAgdC5wbGFuKDE3KVxuICB0LnNhbWUoc2NoZW1hTWFuYWdlcjEuZ2V0KCksIHNjaGVtYTEuY29uZmlnMSwgJ2dldCgpJylcbiAgdC5zYW1lKHNjaGVtYU1hbmFnZXIxLmdldCgnY29uZmlnMicpLCBzY2hlbWExLmNvbmZpZzIsIFwiZ2V0KCdjb25maWcyJylcIilcbiAgdC5zYW1lKHNjaGVtYU1hbmFnZXIxLmdldCgnY29uZmlnMicsICdzZXJ2aWNlMicpLCBzY2hlbWEyLmNvbmZpZzIsIFwiZ2V0KCdjb25maWcyJywnc2VydmljZTInKVwiKVxuICB0LnNhbWUoc2NoZW1hTWFuYWdlcjEuZ2V0KCdjb25maWcyJywgJyonKS5sZW5ndGgsIDIsIFwiZ2V0KCdjb25maWcyJywgJyonKS5sZW5ndGhcIilcbiAgdC5zYW1lKHNjaGVtYU1hbmFnZXIxLmdldCgnY29uZmlnMicsICcqJylbMF0uaXRlbXMsIHNjaGVtYTEuY29uZmlnMiwgXCJnZXQoJ2NvbmZpZzInLCAnKicpWzBdLml0ZW1zXCIpXG4gIHQuc2FtZShzY2hlbWFNYW5hZ2VyMS5nZXQoJ2NvbmZpZzInLCAnKicsICdzZXJ2aWNlMScpLmxlbmd0aCwgMSwgXCJnZXQoJ2NvbmZpZzInLCAnKicsICdzZXJ2aWNlMScpLmxlbmd0aFwiKVxuICB0LnNhbWUoc2NoZW1hTWFuYWdlcjEuZ2V0KCdjb25maWcyJywgJyonLCAnc2VydmljZTEnKVswXS5pdGVtcywgc2NoZW1hMi5jb25maWcyLCBcImdldCgnY29uZmlnMicsICcqJywgJ3NlcnZpY2UxJylbMF0uaXRlbXNcIilcbiAgdC5zYW1lKHNjaGVtYU1hbmFnZXIxLmdldCgnY29uZmlnMicsICcqJywgJ3NlcnZpY2UxJylbMF0uc2VydmljZSwgJ3NlcnZpY2UyJywgXCJnZXQoJ2NvbmZpZzInLCAnKicsICdzZXJ2aWNlMScpWzBdLnNlcnZpY2VcIilcblxuICBzY2hlbWExLmNvbmZpZzEgPSB7XG4gICAgaXRlbTogJ3Rlc3QxIHVwZGF0ZWQnXG4gIH1cbiAgc2NoZW1hMS5jb25maWcyID0ge1xuICAgIGl0ZW06ICd0ZXN0MiB1cGRhdGVkJ1xuICB9XG4gIHNjaGVtYTIuY29uZmlnMiA9IHtcbiAgICBpdGVtOiAndGVzdDIgdXBkYXRlZCdcbiAgfVxuICB0Lm5vdFNhbWUoc2NoZW1hTWFuYWdlcjEuZ2V0KCksIHNjaGVtYTEuY29uZmlnMSwgJ2dldCgpIENIQU5HRSBub3QgcHJvcGFnYXRlZCcpXG5cbiAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTEwMCkpXG5cbiAgdC5zYW1lKHNjaGVtYU1hbmFnZXIxLmdldCgpLCBzY2hlbWExLmNvbmZpZzEsICdnZXQoKSBBRlRFUiBDSEFOR0UnKVxuICB0LnNhbWUoc2NoZW1hTWFuYWdlcjEuZ2V0KCdjb25maWcyJyksIHNjaGVtYTEuY29uZmlnMiwgXCJnZXQoJ2NvbmZpZzInKSBBRlRFUiBDSEFOR0VcIilcbiAgdC5zYW1lKHNjaGVtYU1hbmFnZXIxLmdldCgnY29uZmlnMicsICdzZXJ2aWNlMicpLCBzY2hlbWEyLmNvbmZpZzIsIFwiZ2V0KCdjb25maWcyJywnc2VydmljZTInKSBBRlRFUiBDSEFOR0VcIilcbiAgdC5zYW1lKHNjaGVtYU1hbmFnZXIxLmdldCgnY29uZmlnMicsICcqJykubGVuZ3RoLCAyLCBcImdldCgnY29uZmlnMicsICcqJykubGVuZ3RoIEFGVEVSIENIQU5HRVwiKVxuICB0LnNhbWUoc2NoZW1hTWFuYWdlcjEuZ2V0KCdjb25maWcyJywgJyonKVswXS5pdGVtcywgc2NoZW1hMS5jb25maWcyLCBcImdldCgnY29uZmlnMicsICcqJylbMF0uaXRlbXMgQUZURVIgQ0hBTkdFXCIpXG4gIHQuc2FtZShzY2hlbWFNYW5hZ2VyMS5nZXQoJ2NvbmZpZzInLCAnKicsICdzZXJ2aWNlMScpLmxlbmd0aCwgMSwgXCJnZXQoJ2NvbmZpZzInLCAnKicsICdzZXJ2aWNlMScpLmxlbmd0aCBBRlRFUiBDSEFOR0VcIilcbiAgdC5zYW1lKHNjaGVtYU1hbmFnZXIxLmdldCgnY29uZmlnMicsICcqJywgJ3NlcnZpY2UxJylbMF0uaXRlbXMsIHNjaGVtYTIuY29uZmlnMiwgXCJnZXQoJ2NvbmZpZzInLCAnKicsICdzZXJ2aWNlMScpWzBdLml0ZW1zIEFGVEVSIENIQU5HRVwiKVxuICB0LnNhbWUoc2NoZW1hTWFuYWdlcjEuZ2V0KCdjb25maWcyJywgJyonLCAnc2VydmljZTEnKVswXS5zZXJ2aWNlLCAnc2VydmljZTInLCBcImdldCgnY29uZmlnMicsICcqJywgJ3NlcnZpY2UxJylbMF0uc2VydmljZSBBRlRFUiBDSEFOR0VcIilcblxuICB0LmVuZCgpXG4gIC8vIHByb2Nlc3MuZXhpdCgpXG59KS50aGVuKCgpID0+IHByb2Nlc3MuZXhpdCgpKVxuIl19