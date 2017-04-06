const R = require('ramda')
const fs = require('fs')
const path = require('path')
// var deref = require('json-schema-deref-sync')
var jsonfile = require('jsonfile')
// var normalise = require('ajv-error-messages')
var ajv = require('ajv')({allErrors: true})
// var sourceMapSupport = require('source-map-support')
// sourceMapSupport.install()
process.on('unhandledRejection', (reason, promise) => {
  console.error('unhandledRejection Reason: ', promise, reason)
  console.trace(reason)
})

const PACKAGE = 'schemaManager'

module.exports = {
  getAllServicesConfigFromDir (dir, fileName = 'methods.json') {
    var services = {}
    fs.readdirSync(dir).forEach(file => {
      const filePath = path.join(dir, file, fileName)
      if (fs.existsSync(filePath))services[file] = require(filePath)
    })
    // CONSOLE.debug("getAllServicesConfigFromDir",services)
    return services
  },
  setSharedConfig (servicesRootDir, service, config, data) {
    return new Promise((resolve, reject) => {
      var filePath = path.join(servicesRootDir, service, config)
      jsonfile.writeFile(filePath + '.json', data, (err) => {
        if (err) return reject(err)
        resolve(data)
      })
    })
  },
  getSharedConfig (servicesRootDir) {
    return (service, config = 'service', exclude, asObj = false) => {

      return new Promise((resolve, reject) => {
        if (service === '*') {
          fs.readdir(servicesRootDir, (err, dirContents) => {
            if (err) return reject(err)
            var allFilePromises = []
            dirContents.forEach(serviceName => {
              if (exclude === serviceName) return false
              const filePath = path.join(servicesRootDir, serviceName, config)
              allFilePromises.push(new Promise((resolve, reject) => {
                // jsonfile.readFile(filePath + '.json', (err, data) => {
                //   if (err) return reject(err)
                //   data = deref(data, {baseFolder: path.dirname(filePath), failOnMissing: true})
                //   data.serviceName = serviceName
                //   return resolve(data)
                // })
                var data = require(filePath + '.json')
                data = deref(data, {baseFolder: path.dirname(filePath), failOnMissing: true})
                if(data instanceof Error)reject(data)
                data.serviceName = serviceName
                resolve(data)
              }))
            })
            Promise.all(allFilePromises).then(result => {
              if (asObj) {
                var objResult = {}
                result.forEach(serviceArray => objResult[serviceArray.serviceName] = serviceArray)
                return resolve(objResult)
              } else resolve(result)
            }).catch(reject)
          })
        } else {
          var filePath = path.join(servicesRootDir, service, config)
          console.debug("getSharedConfig",{filePath})
          // jsonfile.readFile(filePath + '.json', (err, data) => {
          //   if (err) return reject(err)
          //   data = deref(data, {baseFolder: path.dirname(filePath), failOnMissing: true})
          //   data.serviceName = service
          //   return resolve(data)
          // })
          var data = require(filePath + '.json')
          data = deref(data, {baseFolder: path.dirname(filePath), failOnMissing: true})
          if(data instanceof Error)reject(data)
          data.serviceName = service
          resolve(data)
        }
      })
    }
  },
  validateMethodFromConfig (errorThrow,serviceName, serviceId, methodsConfig, methodName, data, schemaField) {
    if (!methodsConfig || !methodsConfig[methodName] || !methodsConfig[methodName][schemaField]) errorThrow(`Method validation problem :${methodName} ${schemaField} in ${methodsConfigFile}`)
    var schema = methodsConfig[methodName][schemaField]
    var validate = ajv.compile(schema)
    var valid = validate(data)
    if (!valid) {
      errorThrow('validation errors', {errors: validate.errors, methodsConfig, methodName, data, schemaField})
    }
    return data
  }

}
