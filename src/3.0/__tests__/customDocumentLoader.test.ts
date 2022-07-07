import {
  __unsafe__use__it__at__your__own__risks__wrapDocument as wrapDocument,
  SchemaId,
} from "../..";
import { SignedWrappedDocument, WrappedDocument } from "../../3.0/types";
import {
  IdentityProofType,
  Method,
  OpenAttestationDocument,
  ProofType,
  TemplateType,
} from "../../__generated__/schema.3.0";
import { omit } from "lodash";
import { documentLoaderBuiltinOnly } from "../externalDocumentLoaders";


const openAttestationData = {
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.w3.org/2018/credentials/examples/v1",
    "https://schemata.openattestation.com/com/openattestation/1.0/OpenAttestation.v3.json",
    "https://schemata.openattestation.com/com/openattestation/1.0/CustomContext.json",
  ],
  reference: "document identifier",
  validFrom: "2010-01-01T19:23:24Z",
  issuanceDate: "2010-01-01T19:23:24Z",
  name: "document owner name",
  type: ["VerifiableCredential", "UniversityDegreeCredential", "OpenAttestationCredential"],
  credentialSubject: {
    id: "did:example:ebfeb1f712ebc6f1c276e12ec21",
    degree: {
      type: "BachelorDegree",
      name: "Bachelor of Science in Mechanical Engineering",
    },
  },
  openAttestationMetadata: {
    template: {
      name: "any",
      type: TemplateType.EmbeddedRenderer,
      url: "http://some.example.com",
    },
    proof: {
      type: ProofType.OpenAttestationProofMethod,
      value: "0x9178F546D3FF57D7A6352bD61B80cCCD46199C2d",
      method: Method.TokenRegistry,
    },
    identityProof: {
      type: IdentityProofType.DNSTxt,
      identifier: "tradetrust.io",
    },
  },
  issuer: {
    id: "http://some.example.com",
    type: "OpenAttestationIssuer",
    name: "DEMO STORE",
  },
};

describe("Document wrapping using non-default document loaders", () => {
  describe("Using documentLoaderBuiltIn", () => {
    test("Should wrap/validate a document with only built-in contexts", async () => {
      const wrappedDocumentBuiltinOnly = await wrapDocument(openAttestationData, {
        version: SchemaId.v3,
        documentLoader: documentLoaderBuiltinOnly,
      });
      const wrappedDocumentDefault = await wrapDocument(openAttestationData, {
        version: SchemaId.v3,
      });
      expect(wrappedDocumentBuiltinOnly).toMatchObject(
        omit(wrappedDocumentDefault, ["proof.salts", "proof.targetHash", "proof.merkleRoot"]) // these properties vary randomly
      );
    });
    test("Should fail to wrap/validate a document with a non-builtin context", async () => {
      await expect(async () => {
        const extraContextData = {
          ...openAttestationData,
          "@context": [...openAttestationData["@context"], "https://json-ld.org/contexts/person.jsonld"],
        }; // add an external context
        console.log(JSON.stringify(extraContextData[`@context`], null, 2));
        await wrapDocument(extraContextData, {
          version: SchemaId.v3,
          documentLoader: documentLoaderBuiltinOnly,
        });
      }).rejects.toThrow("Unknown context");
    });
    test("Should fail to wrap/validate a document if it is missing a context", async () => {
      await expect(async () => {
        const missingContextData = { ...openAttestationData, "@context": openAttestationData["@context"].slice(0, -1) }; // remove one context
        console.log(JSON.stringify(missingContextData[`@context`], null, 2));
        await wrapDocument(missingContextData, {
          version: SchemaId.v3,
          documentLoader: documentLoaderBuiltinOnly,
        });
      }).rejects.toThrow("JSON-LD did not validate");
    });
  });
});
