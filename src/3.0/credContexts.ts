import * as OpenAttestation_v3 from "./builtinContexts/OpenAttestation/OpenAttestation_v3.json";
import * as OpenAttestationDrivingLicenceCredential from "./builtinContexts/OpenAttestation/DrivingLicenceCredential.json";
import * as OpenAttestationCustomContext from "./builtinContexts/OpenAttestation/CustomContext.json";
import * as credentials_v1 from "./builtinContexts/credentials_v1.json";
import * as examples_credentials_v1 from "./builtinContexts/examples_credentials_v1.json";
import * as odrl from "./builtinContexts/odrl.json";

//export const contexts = new Map(); //[
//urlToObj.map((entry) => {
//  console.log(`(Original) Loading context: ${entry[0]}`);
//  contexts.set(entry[0], entry[1]);
//});
const contextsArr = [
  ["https://www.w3.org/ns/odrl.jsonld", odrl],
  ["https://www.w3.org/2018/credentials/v1", credentials_v1],
  ["https://www.w3.org/2018/credentials/examples/v1", examples_credentials_v1],
  [
    "https://schemata.openattestation.com/com/openattestation/1.0/DrivingLicenceCredential.json",
    OpenAttestationDrivingLicenceCredential,
  ],
  ["https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json", OpenAttestation_v3],
  ["https://schemata.openattestation.com/com/openattestation/1.0/CustomContext.json", OpenAttestationCustomContext],
];
export const contexts = new Map<string, any>(Object.entries(contextsArr));
