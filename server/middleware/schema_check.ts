import mongoose from "mongoose";

exports.checking = (field:any,schema:any,strict:any) => {
  return new Promise(async (resolve: any, reject: any) => {
    try {
      console.log(schema);
        const newschema: any = [
          {
            field_name: [],
            field_type: [],
          },
        ];
         Object.entries(field).forEach(async([key, value]) => {
            newschema[0].field_name.push(key);
            const newvalue=typeof(value);
            await new Promise(async (resolve: any, reject: any) => {
              const val = newvalue.charAt(0).toUpperCase() + newvalue.slice(1);
              newschema[0].field_type.push(val);
              resolve();
            }
              );
            // console.log("times");
         });
        //  console.log(newschema);
        //  console.log(schema);
         //for strict comparision;
         if(strict){
          
            const sortedArr1 = await newschema.map((obj:any) => ({
              field_name: [...obj.field_name].sort(),
              field_type: [...obj.field_type].sort(),
            }));
            // console.log(schema);

            const sortedArr2 = await schema.map((obj:any) => ({
              field_name: [...obj.field_name].sort(),
              field_type: [...obj.field_type].sort(),
            }));
            console.log(sortedArr2);

            const strArr1 = JSON.stringify(sortedArr1);
            const strArr2 = JSON.stringify(sortedArr2);

            

            return strArr1 === strArr2 ? resolve(1) : resolve(0);
         }
        else{
            resolve(-1);
        }
     resolve(1);
    } catch (err: any) {
      reject(err);
    }
  });
};
