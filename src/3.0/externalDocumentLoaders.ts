import { documentLoaders } from "@govtechsg/jsonld";
import fetch from "cross-fetch";
import { readFile } from "fs/promises";
import { contexts as builtInContexts } from "./credContexts";
//------------------------------------
const preloadedContextList = [
  "https://www.w3.org/2018/credentials/v1",
  "https://www.w3.org/2018/credentials/examples/v1",
  "https://schemata.openattestation.com/com/openattestation/1.0/DrivingLicenceCredential.json",
  "https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json",
  "https://schemata.openattestation.com/com/openattestation/1.0/CustomContext.json",
];
const contexts: Map<string, Promise<any>> = new Map();
builtInContexts.forEach(([key, val]: [string, any]) => {
  // update contexts from those 'built in'
  console.log(`Loading context: ${key}`);
  contexts.set(key, val);
});
const nodeDocumentLoader = documentLoaders.xhr ? documentLoaders.xhr() : documentLoaders.node();
let preload = true;

// Anything not 'built-in' is cached on the first call
export const documentLoaderCacheOnFirstCall = async (url: string) => {
  if (preload) {
    preload = false;
    for (const url of preloadedContextList) {
      contexts.set(
        url,
        fetch(url, { headers: { accept: "application/json" } }).then((res: any) => res.json())
      );
    }
  }
  if (contexts.get(url)) {
    const promise = contexts.get(url);
    return {
      contextUrl: undefined, // this is for a context via a link header
      document: await promise, // this is the actual document that was loaded
      documentUrl: url, // this is the actual context URL after redirects
    };
  } else {
    const promise = nodeDocumentLoader(url);
    contexts.set(
      url,
      promise.then(({ document }) => document)
    );
    return promise;
  }
};

//Looks for contexts stored in CWD/contexts,
//e.g. CWD/contexts/www.w3.org/2018/credentials/v1.json (node only):
export const documentLoaderBuiltinOnly = async (url: string) => {
  if (contexts.has(url)) {
    const obj = {
      contextUrl: undefined, // this is for a context via a link header
      document: contexts.get(url), // this is the actual document that was loaded
      documentUrl: url, // this is the actual context URL after redirects
    };
    return obj;
  } else {
    throw Error(`Context ${url} is not built in`);
  }
};

//
// Look for a context locally before fetching
export const documentLoaderRuntimeLocalLoading = async (url: string) => {
  let promise = contexts.get(url);
  if (!promise) {
    const localPath = `contexts/${url.split("//")[1]}`;
    promise = readFile(localPath, "utf8").then((data) => {
      JSON.parse(data);
    });
    contexts.set(url, promise);
  }
  return {
    contextUrl: undefined, // this is for a context via a link header
    document: await promise, // this is the actual document that was loaded
    documentUrl: url, // this is the actual context URL after redirects
  };
};
