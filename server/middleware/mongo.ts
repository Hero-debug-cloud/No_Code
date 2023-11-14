import mongoose, { model } from "mongoose";

// exports.createDynamicModel = (modelName: any, schemaDefinition: any) => {
//   return new Promise((resolve: any, reject: any) => {
//       const dynamicSchema = new mongoose.Schema(schemaDefinition);
//       resolve(mongoose.model(modelName, dynamicSchema));
//   });
// };
exports.createDynamicModel = (modelName: any) => {
  return new Promise(async (resolve: any, reject: any) => {
    try {
      mongoose.model(modelName, new mongoose.Schema({}, { strict: false }));
      resolve("done");
    } catch (err: any) {
      reject(err);
    }
  });
};

exports.deletemodal = (modelName: any) => {
  return new Promise(async (resolve: any, reject: any) => {
    console.log("Modal name "+modelName);
    mongoose.connection.db
      .listCollections()
      .toArray(async (err: any, collections: any) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        for (const collection of collections) {
          console.log("Collection " + collection.name);
          if (collection.name == modelName) {
            await mongoose.connection.db.collection(modelName).drop();
            resolve("Deleted");
          }
        }
        reject("Collection not found");
      });
  });
};

exports.checkmodel = (modelName: any) => {
  console.log("modelname "+modelName);
  return new Promise((resolve: any, reject: any) => {
    mongoose.connection.db
      .listCollections()
      .toArray((err: any, collections: any) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        for (const collection of collections) {
          console.log("collection name "+collection.name);
          if (collection.name == modelName) {
            
            resolve(1);
          }
        }
        resolve(0);
      });
  });
};

exports.getModel = (modelName: any) => {
  return new Promise(async(resolve: any, reject: any) => {
    try {
      const schema = new mongoose.Schema({}, { strict: false });
      const Collection =
         mongoose.models[modelName] || mongoose.model(modelName, schema);
      resolve(Collection);
    } catch (err: any) {
      reject(err);
    }
  });
};
