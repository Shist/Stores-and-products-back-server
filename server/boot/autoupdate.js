'use strict';

module.exports = function(app) {
  const path = require('path');
  const models = require(path.resolve(__dirname, '../model-config.json'));
  const datasources = require(path.resolve(__dirname, '../datasources.json'));

  const autoMigrateAll = () => {
    return Object.keys(models).map((key) => {
      if (typeof models[key].dataSource !== 'undefined') {
        if (typeof datasources[models[key].dataSource] !== 'undefined') {
          return new Promise((resolve, reject) => {
            app.dataSources[models[key].dataSource].automigrate(key, (err) => {
              if (err) throw err;
              console.log('Model ' + key + ' migrated');
              resolve();
            });
          });
        }
      }
    });
  };

  if (process.argv[2] === "automigrate") {
    Promise
      .all(autoMigrateAll())
      .then(() => {
        console.log("Automigrate has been finished.");
        process.exit();
      });
  }
};
