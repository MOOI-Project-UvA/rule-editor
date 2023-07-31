import * as rdf from "rdflib"

const rdfConfig = {
  docUri: "http://ontology.tno.nl/normengineering/choppr",
  store: rdf.graph(),
  namespaces: {
    DC: rdf.Namespace("http://purl.org/dc/elements/1.1/"),
    FLINT: rdf.Namespace("http://ontology.tno.nl/normengineering/flint#"),
    OWL: rdf.Namespace("http://www.w3.org/2002/07/owl#"),
    RDF: rdf.Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#"),
    RDFS: rdf.Namespace("http://www.w3.org/2000/01/rdf-schema#"),
    XML: rdf.Namespace("http://www.w3.org/XML/1998/namespace"),
    XSD: rdf.Namespace("http://www.w3.org/2001/XMLSchema#"),
    SRC: rdf.Namespace("http://ontology.tno.nl/normengineering/source#"),
    EX: rdf.Namespace("http://ontology.tno.nl/normengineering/")
  }
}

function jsonld2turtle(turtleString, store, uri) {
  return new Promise(resolve => {
    rdf.parse(jsonString, store, uri, "application/ld+json", e => {
      if (e) {
        console.log("Parse Error! ")
        return resolve(e)
      }

      // by omitting the document parameter to serialize, or passing null, we will get all the triples in the store.
      rdf.serialize(null, store, uri, "text/turtle", (e, s) => {
        if (e) {
          console.log("Serialize Error!")
          return resolve(e)
        }
        // console.log("sss", s, resolve(s));
        return resolve(s)
      })
    })
  })
}

export {jsonld2turtle, rdfConfig}
