import { Namespace, parse, serialize } from "rdflib";

const rdfConfig = {
  docUri: "http://ontology.tno.nl/normengineering/choppr",
  namespaces: {
    DC: Namespace("http://purl.org/dc/elements/1.1/"),
    FLINT: Namespace("http://ontology.tno.nl/normengineering/flint#"),
    OWL: Namespace("http://www.w3.org/2002/07/owl#"),
    RDF: Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#"),
    RDFS: Namespace("http://www.w3.org/2000/01/rdf-schema#"),
    XML: Namespace("http://www.w3.org/XML/1998/namespace"),
    XSD: Namespace("http://www.w3.org/2001/XMLSchema#"),
    SRC: Namespace("http://ontology.tno.nl/normengineering/source#"),
    NE: Namespace("http://ontology.tno.nl/normengineering/"),
  },
};

function jsonld2turtle(jsonString, store, uri) {
  return new Promise((resolve) => {
    parse(jsonString, store, uri, "application/ld+json", (e, s) => {
      if (e) {
        console.log("Parse Error! ");
        return resolve(e);
      } else {
        return resolve(s);
      }

      // by omitting the document parameter to serialize, or passing null, we will get all the triples in the store.
      serialize(null, store, uri, "text/turtle", (e, s) => {
        if (e) {
          console.log("Serialize Error!");
          return resolve(e);
        }
        // console.log("sss", s, resolve(s));
        return resolve(s);
      });
    });
  });
}

function parseInterpretation(
  string,
  store,
  uri,
  contentType = "application/ld+json",
) {
  return new Promise((resolve) => {
    parse(string, store, uri, "application/ld+json", (e, s) => {
      if (e) {
        console.log("Parse Error! ");
        return resolve(e);
      } else {
        return resolve(s);
      }
    });
  });
}

// root -> collection.elements
/*
 * This function reconstructs a legal source based on RDF syntax.
 * A namedNode is the input parameter
 * It returns the reconstructed string
 * Extensions: add support for multiple sources
 */
function reconstructTextFromRdf(root, store) {
  const hasContent = store.statementsMatching(
    root,
    rdfConfig.namespaces.SRC("hasContent"),
    null,
  );
  // console.log("hasContent:", hasContent)
  let content =
    hasContent.length > 0 ? `<p>${hasContent[0].object.value}</p>` : ``;
  const hasChildren = store.statementsMatching(
    root,
    rdfConfig.namespaces.SRC("hasChildElementOrdering"),
    null,
  );
  // console.log("hasChildren:", hasChildren)
  // let children = hasChildren.length> 0 ? hasChildren
  if (hasChildren.length > 0) {
    hasChildren[0].object.elements.forEach((c) => {
      content = content.concat(reconstructTextFromRdf(c, store));
    });
  }
  return content;
}

/**
 * Reconstructs a legal source from JSON-LD
 * @param {Object} root The named Node of the document to be reconstructed
 * @param  store The rdf graph, where the document will be store in the form of triples
 * @returns {Array|*[]} An array of objects containing information per source element. The order of the objects
 * corresponds to the proper order of elements in the source.
 */
function reconstructDataStructureFromRDF(root, store) {
  console.log("store in function", store);
  const hasContent = store.statementsMatching(
    root,
    rdfConfig.namespaces.SRC("hasContent"),
    null,
  );
  let sentences =
    hasContent.length > 0 ? sentenceData(hasContent, root, store) : [];
  const hasChildren = store.statementsMatching(
    root,
    rdfConfig.namespaces.SRC("hasChildElementOrdering"),
    null,
  );
  if (hasChildren.length > 0) {
    hasChildren[0].object.elements.forEach((c) => {
      sentences = sentences.concat(reconstructDataStructureFromRDF(c, store));
    });
  }
  console.log("sentences: ", sentences);
  return sentences;
}

/**
 * Creates an object per element with the following information:
 * 1) the id of the chunk,
 * 2) the type of the element,
 * 3) the text related to the chunk
 * For more info, check the RDFLIb.js library ()
 * @param {Array} hasContent An array containing the triple referring to the NamedNode of the element to be examined
 * @param {Object} root The named RDF node of the element to be examined
 * @param {Object} store THe RDF graph containing the triples for the document in question
 * @return {Array} An array containing the created object per element
 */
function sentenceData(hasContent, root, store) {
  const structure = { id: "", content: "", annotations: [], type: "" };
  structure.content = hasContent[0].object.value;
  structure.id = getElementsId(root, store);
  structure.type = store.any(
    root,
    rdfConfig.namespaces.SRC("hasTypeLabel"),
    null,
  ).value;
  return [structure];
}

/**
 * Retrieves the id of an element from the rdf store
 * @param {Object} root The named RDF node of the element to be examined
 * @param {Object} store THe RDF graph containing the triples for the document in question
 * @returns {string}
 */
function getElementsId(root, store) {
  const result = store.statementsMatching(
    root,
    rdfConfig.namespaces.SRC("hasTypeLabel"),
    null,
  );
  // const object = store.any(root, namespaces.SRC("hasTypeLabel"),null)
  console.log("root", root);
  // console.log("object", object)
  if (result[0].object.value === "Document") {
    return result[0].subject.value;
  } else {
    const segments = result[0].subject.value.split("/");
    return segments[segments.length - 1].split("_")[0];
  }
}

export {
  rdfConfig,
  jsonld2turtle,
  parseInterpretation,
  reconstructTextFromRdf,
  reconstructDataStructureFromRDF,
};
