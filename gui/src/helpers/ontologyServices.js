import { Namespace, parse, serialize } from "rdflib"

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
    NE: Namespace("http://ontology.tno.nl/normengineering/")
  }
}

function jsonld2turtle(jsonString, store, uri) {
  return new Promise(resolve => {
    parse(jsonString, store, uri, "application/ld+json", (e,s) => {
      if (e) {
        console.log("Parse Error! ")
        return resolve(e)
      }
      else {
        return resolve(s)
      }

      // by omitting the document parameter to serialize, or passing null, we will get all the triples in the store.
      serialize(null, store, uri, "text/turtle", (e, s) => {
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

function parseInterpretation(string, store,uri, contentType="application/ld+json") {
  return new Promise(resolve => {

    parse(string, store, uri, "application/ld+json", (e, s) => {
      if (e) {
        console.log("Parse Error! ")
        return resolve(e)
      } else {
        return resolve(s)
      }

    })
  })
}



// root -> collection.elements
/*
 * This function reconstructs a legal source based on RDF syntax.
 * A namedNode is the input parameter
 * It returns the reconstructed string
 * Extensions: add support for multiple sources
 */
function reconstructTextFromRdf(root,store){

  const hasContent = store.statementsMatching(root, rdfConfig.namespaces.SRC('hasContent'), null)
  let content = hasContent.length > 0 ? `<p>${hasContent[0].object.value}</p>` : ``
  const hasChildren = store.statementsMatching(root, rdfConfig.namespaces.SRC('hasChildElementOrdering'), null)
  // let children = hasChildren.length> 0 ? hasChildren
  if (hasChildren.length>0) {
      hasChildren[0].object.elements.forEach(c => {
          content = content.concat(reconstructTextFromRdf(c, store))
      })
  }
  return content
}

  // return html`${reconstructTextFromRdf(docObject[0].subject)}`


export { rdfConfig, jsonld2turtle, parseInterpretation, reconstructTextFromRdf }
