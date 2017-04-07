'use strict';

var R = require('ramda');
var fs = require('fs');
var path = require('path');
// var deref = require('json-schema-deref-sync')
var jsonfile = require('jsonfile');
// var normalise = require('ajv-error-messages')
var ajv = require('ajv')({ allErrors: true });
// var sourceMapSupport = require('source-map-support')
// sourceMapSupport.install()
process.on('unhandledRejection', function (reason, promise) {
  console.error('unhandledRejection Reason: ', promise, reason);
  console.trace(reason);
});

var PACKAGE = 'schemaManager';

module.exports = {
  getAllServicesConfigFromDir: function getAllServicesConfigFromDir(dir) {
    var fileName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'methods.json';

    var services = {};
    fs.readdirSync(dir).forEach(function (file) {
      var filePath = path.join(dir, file, fileName);
      if (fs.existsSync(filePath)) services[file] = require(filePath);
    });
    // CONSOLE.debug("getAllServicesConfigFromDir",services)
    return services;
  },
  setSharedConfig: function setSharedConfig(servicesRootDir, service, config, data) {
    return new Promise(function (resolve, reject) {
      var filePath = path.join(servicesRootDir, service, config);
      jsonfile.writeFile(filePath + '.json', data, function (err) {
        if (err) return reject(err);
        resolve(data);
      });
    });
  },
  getSharedConfig: function getSharedConfig(servicesRootDir) {
    return function (service) {
      var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'service';
      var exclude = arguments[2];
      var asObj = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;


      return new Promise(function (resolve, reject) {
        if (service === '*') {
          fs.readdir(servicesRootDir, function (err, dirContents) {
            if (err) return reject(err);
            var allFilePromises = [];
            dirContents.forEach(function (serviceName) {
              if (exclude === serviceName) return false;
              var filePath = path.join(servicesRootDir, serviceName, config);
              allFilePromises.push(new Promise(function (resolve, reject) {
                // jsonfile.readFile(filePath + '.json', (err, data) => {
                //   if (err) return reject(err)
                //   data = deref(data, {baseFolder: path.dirname(filePath), failOnMissing: true})
                //   data.serviceName = serviceName
                //   return resolve(data)
                // })
                var data = require(filePath + '.json');
                data = deref(data, { baseFolder: path.dirname(filePath), failOnMissing: true });
                if (data instanceof Error) reject(data);
                data.serviceName = serviceName;
                resolve(data);
              }));
            });
            Promise.all(allFilePromises).then(function (result) {
              if (asObj) {
                var objResult = {};
                result.forEach(function (serviceArray) {
                  return objResult[serviceArray.serviceName] = serviceArray;
                });
                return resolve(objResult);
              } else resolve(result);
            }).catch(reject);
          });
        } else {
          var filePath = path.join(servicesRootDir, service, config);
          console.debug("getSharedConfig", { filePath: filePath });
          // jsonfile.readFile(filePath + '.json', (err, data) => {
          //   if (err) return reject(err)
          //   data = deref(data, {baseFolder: path.dirname(filePath), failOnMissing: true})
          //   data.serviceName = service
          //   return resolve(data)
          // })
          var data = require(filePath + '.json');
          data = deref(data, { baseFolder: path.dirname(filePath), failOnMissing: true });
          if (data instanceof Error) reject(data);
          data.serviceName = service;
          resolve(data);
        }
      });
    };
  },
  validateMethodFromConfig: function validateMethodFromConfig(errorThrow, serviceName, serviceId, methodsConfig, methodName, data, schemaField) {
    if (!methodsConfig || !methodsConfig[methodName] || !methodsConfig[methodName][schemaField]) errorThrow('Method validation problem :' + methodName + ' ' + schemaField + ' in ' + methodsConfigFile);
    var schema = methodsConfig[methodName][schemaField];
    var validate = ajv.compile(schema);
    var valid = validate(data);
    if (!valid) {
      errorThrow('validation errors', { errors: validate.errors, methodsConfig: methodsConfig, methodName: methodName, data: data, schemaField: schemaField });
    }
    return data;
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjaGVtYU1hbmFnZXIuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwiZnMiLCJwYXRoIiwianNvbmZpbGUiLCJhanYiLCJhbGxFcnJvcnMiLCJwcm9jZXNzIiwib24iLCJyZWFzb24iLCJwcm9taXNlIiwiY29uc29sZSIsImVycm9yIiwidHJhY2UiLCJQQUNLQUdFIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldEFsbFNlcnZpY2VzQ29uZmlnRnJvbURpciIsImRpciIsImZpbGVOYW1lIiwic2VydmljZXMiLCJyZWFkZGlyU3luYyIsImZvckVhY2giLCJmaWxlUGF0aCIsImpvaW4iLCJmaWxlIiwiZXhpc3RzU3luYyIsInNldFNoYXJlZENvbmZpZyIsInNlcnZpY2VzUm9vdERpciIsInNlcnZpY2UiLCJjb25maWciLCJkYXRhIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJ3cml0ZUZpbGUiLCJlcnIiLCJnZXRTaGFyZWRDb25maWciLCJleGNsdWRlIiwiYXNPYmoiLCJyZWFkZGlyIiwiZGlyQ29udGVudHMiLCJhbGxGaWxlUHJvbWlzZXMiLCJzZXJ2aWNlTmFtZSIsInB1c2giLCJkZXJlZiIsImJhc2VGb2xkZXIiLCJkaXJuYW1lIiwiZmFpbE9uTWlzc2luZyIsIkVycm9yIiwiYWxsIiwidGhlbiIsIm9ialJlc3VsdCIsInJlc3VsdCIsInNlcnZpY2VBcnJheSIsImNhdGNoIiwiZGVidWciLCJ2YWxpZGF0ZU1ldGhvZEZyb21Db25maWciLCJlcnJvclRocm93Iiwic2VydmljZUlkIiwibWV0aG9kc0NvbmZpZyIsIm1ldGhvZE5hbWUiLCJzY2hlbWFGaWVsZCIsIm1ldGhvZHNDb25maWdGaWxlIiwic2NoZW1hIiwidmFsaWRhdGUiLCJjb21waWxlIiwidmFsaWQiLCJlcnJvcnMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBTUEsSUFBSUMsUUFBUSxPQUFSLENBQVY7QUFDQSxJQUFNQyxLQUFLRCxRQUFRLElBQVIsQ0FBWDtBQUNBLElBQU1FLE9B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c0VtQ2dCLFNBdEVuQyxFQXNFOENDLGFBdEU5QyxFQXNFNkRDLFVBdEU3RCxFQXNFeUU5QixJQXRFekUsRUFzRStFK0IsV0F0RS9FLEVBc0U0RjtBQUN6RyxRQUFJLENBQUNGLGFBQUQsSUFBa0IsQ0FBQ0EsY0FBY0MsVUFBZCxDQUFuQixJQUFnRCxDQUFDRCxjQUFjQyxVQUFkLEVBQTBCQyxXQUExQixDQUFyRCxFQUE2RkosMkNBQXlDRyxVQUF6QyxTQUF1REMsV0FBdkQsWUFBeUVDLGlCQUF6RTtBQUM3RixRQUFJQyxTQUFTSixjQUFjQyxVQUFkLEVBQTBCQyxXQUExQixDQUFiO0FBQ0EsUUFBSUcsV0FBVzVELElBQUk2RCxPQUFKLENBQVlGLE1BQVosQ0FBZjtBQUNBLFFBQUlHLFFBQVFGLFNBQVNsQyxJQUFULENBQVo7QUFDQSxRQUFJLENBQUNvQyxLQUFMLEVBQVk7QUFDVlQsaUJBQVcsbUJBQVgsRUFBZ0MsRUFBQ1UsUUFBUUgsU0FBU0csTUFBbEIsRUFBMEJSLDRCQUExQixFQUF5Q0Msc0JBQXpDLEVBQXFEOUIsVUFBckQsRUFBMkQrQix3QkFBM0QsRUFBaEM7QUFDRDtBQUNELFdBQU8vQixJQUFQO0FBQ0Q7QUEvRWMsQ0FBakIiLCJmaWxlIjoic2NoZW1hTWFuYWdlci5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBSID0gcmVxdWlyZSgncmFtZGEnKVxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4vLyB2YXIgZGVyZWYgPSByZXF1aXJlKCdqc29uLXNjaGVtYS1kZXJlZi1zeW5jJylcbnZhciBqc29uZmlsZSA9IHJlcXVpcmUoJ2pzb25maWxlJylcbi8vIHZhciBub3JtYWxpc2UgPSByZXF1aXJlKCdhanYtZXJyb3ItbWVzc2FnZXMnKVxudmFyIGFqdiA9IHJlcXVpcmUoJ2FqdicpKHthbGxFcnJvcnM6IHRydWV9KVxuLy8gdmFyIHNvdXJjZU1hcFN1cHBvcnQgPSByZXF1aXJlKCdzb3VyY2UtbWFwLXN1cHBvcnQnKVxuLy8gc291cmNlTWFwU3VwcG9ydC5pbnN0YWxsKClcbnByb2Nlc3Mub24oJ3VuaGFuZGxlZFJlamVjdGlvbicsIChyZWFzb24sIHByb21pc2UpID0+IHtcbiAgY29uc29sZS5lcnJvcigndW5oYW5kbGVkUmVqZWN0aW9uIFJlYXNvbjogJywgcHJvbWlzZSwgcmVhc29uKVxuICBjb25zb2xlLnRyYWNlKHJlYXNvbilcbn0pXG5cbmNvbnN0IFBBQ0tBR0UgPSAnc2NoZW1hTWFuYWdlcidcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldEFsbFNlcnZpY2VzQ29uZmlnRnJvbURpciAoZGlyLCBmaWxlTmFtZSA9ICdtZXRob2RzLmpzb24nKSB7XG4gICAgdmFyIHNlcnZpY2VzID0ge31cbiAgICBmcy5yZWFkZGlyU3luYyhkaXIpLmZvckVhY2goZmlsZSA9PiB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihkaXIsIGZpbGUsIGZpbGVOYW1lKVxuICAgICAgaWYgKGZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpKXNlcnZpY2VzW2ZpbGVdID0gcmVxdWlyZShmaWxlUGF0aClcbiAgICB9KVxuICAgIC8vIENPTlNPTEUuZGVidWcoXCJnZXRBbGxTZXJ2aWNlc0NvbmZpZ0Zyb21EaXJcIixzZXJ2aWNlcylcbiAgICByZXR1cm4gc2VydmljZXNcbiAgfSxcbiAgc2V0U2hhcmVkQ29uZmlnIChzZXJ2aWNlc1Jvb3REaXIsIHNlcnZpY2UsIGNvbmZpZywgZGF0YSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB2YXIgZmlsZVBhdGggPSBwYXRoLmpvaW4oc2VydmljZXNSb290RGlyLCBzZXJ2aWNlLCBjb25maWcpXG4gICAgICBqc29uZmlsZS53cml0ZUZpbGUoZmlsZVBhdGggKyAnLmpzb24nLCBkYXRhLCAoZXJyKSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHJldHVybiByZWplY3QoZXJyKVxuICAgICAgICByZXNvbHZlKGRhdGEpXG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG4gIGdldFNoYXJlZENvbmZpZyAoc2VydmljZXNSb290RGlyKSB7XG4gICAgcmV0dXJuIChzZXJ2aWNlLCBjb25maWcgPSAnc2VydmljZScsIGV4Y2x1ZGUsIGFzT2JqID0gZmFsc2UpID0+IHtcblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgaWYgKHNlcnZpY2UgPT09ICcqJykge1xuICAgICAgICAgIGZzLnJlYWRkaXIoc2VydmljZXNSb290RGlyLCAoZXJyLCBkaXJDb250ZW50cykgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikgcmV0dXJuIHJlamVjdChlcnIpXG4gICAgICAgICAgICB2YXIgYWxsRmlsZVByb21pc2VzID0gW11cbiAgICAgICAgICAgIGRpckNvbnRlbnRzLmZvckVhY2goc2VydmljZU5hbWUgPT4ge1xuICAgICAgICAgICAgICBpZiAoZXhjbHVkZSA9PT0gc2VydmljZU5hbWUpIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGguam9pbihzZXJ2aWNlc1Jvb3REaXIsIHNlcnZpY2VOYW1lLCBjb25maWcpXG4gICAgICAgICAgICAgIGFsbEZpbGVQcm9taXNlcy5wdXNoKG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBqc29uZmlsZS5yZWFkRmlsZShmaWxlUGF0aCArICcuanNvbicsIChlcnIsIGRhdGEpID0+IHtcbiAgICAgICAgICAgICAgICAvLyAgIGlmIChlcnIpIHJldHVybiByZWplY3QoZXJyKVxuICAgICAgICAgICAgICAgIC8vICAgZGF0YSA9IGRlcmVmKGRhdGEsIHtiYXNlRm9sZGVyOiBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpLCBmYWlsT25NaXNzaW5nOiB0cnVlfSlcbiAgICAgICAgICAgICAgICAvLyAgIGRhdGEuc2VydmljZU5hbWUgPSBzZXJ2aWNlTmFtZVxuICAgICAgICAgICAgICAgIC8vICAgcmV0dXJuIHJlc29sdmUoZGF0YSlcbiAgICAgICAgICAgICAgICAvLyB9KVxuICAgICAgICAgICAgICAgIHZhciBkYXRhID0gcmVxdWlyZShmaWxlUGF0aCArICcuanNvbicpXG4gICAgICAgICAgICAgICAgZGF0YSA9IGRlcmVmKGRhdGEsIHtiYXNlRm9sZGVyOiBwYXRoLmRpcm5hbWUoZmlsZVBhdGgpLCBmYWlsT25NaXNzaW5nOiB0cnVlfSlcbiAgICAgICAgICAgICAgICBpZihkYXRhIGluc3RhbmNlb2YgRXJyb3IpcmVqZWN0KGRhdGEpXG4gICAgICAgICAgICAgICAgZGF0YS5zZXJ2aWNlTmFtZSA9IHNlcnZpY2VOYW1lXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKVxuICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBQcm9taXNlLmFsbChhbGxGaWxlUHJvbWlzZXMpLnRoZW4ocmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgaWYgKGFzT2JqKSB7XG4gICAgICAgICAgICAgICAgdmFyIG9ialJlc3VsdCA9IHt9XG4gICAgICAgICAgICAgICAgcmVzdWx0LmZvckVhY2goc2VydmljZUFycmF5ID0+IG9ialJlc3VsdFtzZXJ2aWNlQXJyYXkuc2VydmljZU5hbWVdID0gc2VydmljZUFycmF5KVxuICAgICAgICAgICAgICAgIHJldHVybiByZXNvbHZlKG9ialJlc3VsdClcbiAgICAgICAgICAgICAgfSBlbHNlIHJlc29sdmUocmVzdWx0KVxuICAgICAgICAgICAgfSkuY2F0Y2gocmVqZWN0KVxuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGZpbGVQYXRoID0gcGF0aC5qb2luKHNlcnZpY2VzUm9vdERpciwgc2VydmljZSwgY29uZmlnKVxuICAgICAgICAgIGNvbnNvbGUuZGVidWcoXCJnZXRTaGFyZWRDb25maWdcIix7ZmlsZVBhdGh9KVxuICAgICAgICAgIC8vIGpzb25maWxlLnJlYWRGaWxlKGZpbGVQYXRoICsgJy5qc29uJywgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgICAgIC8vICAgaWYgKGVycikgcmV0dXJuIHJlamVjdChlcnIpXG4gICAgICAgICAgLy8gICBkYXRhID0gZGVyZWYoZGF0YSwge2Jhc2VGb2xkZXI6IHBhdGguZGlybmFtZShmaWxlUGF0aCksIGZhaWxPbk1pc3Npbmc6IHRydWV9KVxuICAgICAgICAgIC8vICAgZGF0YS5zZXJ2aWNlTmFtZSA9IHNlcnZpY2VcbiAgICAgICAgICAvLyAgIHJldHVybiByZXNvbHZlKGRhdGEpXG4gICAgICAgICAgLy8gfSlcbiAgICAgICAgICB2YXIgZGF0YSA9IHJlcXVpcmUoZmlsZVBhdGggKyAnLmpzb24nKVxuICAgICAgICAgIGRhdGEgPSBkZXJlZihkYXRhLCB7YmFzZUZvbGRlcjogcGF0aC5kaXJuYW1lKGZpbGVQYXRoKSwgZmFpbE9uTWlzc2luZzogdHJ1ZX0pXG4gICAgICAgICAgaWYoZGF0YSBpbnN0YW5jZW9mIEVycm9yKXJlamVjdChkYXRhKVxuICAgICAgICAgIGRhdGEuc2VydmljZU5hbWUgPSBzZXJ2aWNlXG4gICAgICAgICAgcmVzb2x2ZShkYXRhKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfSxcbiAgdmFsaWRhdGVNZXRob2RGcm9tQ29uZmlnIChlcnJvclRocm93LHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIG1ldGhvZHNDb25maWcsIG1ldGhvZE5hbWUsIGRhdGEsIHNjaGVtYUZpZWxkKSB7XG4gICAgaWYgKCFtZXRob2RzQ29uZmlnIHx8ICFtZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdIHx8ICFtZXRob2RzQ29uZmlnW21ldGhvZE5hbWVdW3NjaGVtYUZpZWxkXSkgZXJyb3JUaHJvdyhgTWV0aG9kIHZhbGlkYXRpb24gcHJvYmxlbSA6JHttZXRob2ROYW1lfSAke3NjaGVtYUZpZWxkfSBpbiAke21ldGhvZHNDb25maWdGaWxlfWApXG4gICAgdmFyIHNjaGVtYSA9IG1ldGhvZHNDb25maWdbbWV0aG9kTmFtZV1bc2NoZW1hRmllbGRdXG4gICAgdmFyIHZhbGlkYXRlID0gYWp2LmNvbXBpbGUoc2NoZW1hKVxuICAgIHZhciB2YWxpZCA9IHZhbGlkYXRlKGRhdGEpXG4gICAgaWYgKCF2YWxpZCkge1xuICAgICAgZXJyb3JUaHJvdygndmFsaWRhdGlvbiBlcnJvcnMnLCB7ZXJyb3JzOiB2YWxpZGF0ZS5lcnJvcnMsIG1ldGhvZHNDb25maWcsIG1ldGhvZE5hbWUsIGRhdGEsIHNjaGVtYUZpZWxkfSlcbiAgICB9XG4gICAgcmV0dXJuIGRhdGFcbiAgfVxuXG59XG4iXX0=