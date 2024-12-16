import SuperAgent from 'superagent';

export const handler = async function(event, context){

    const token = process.env.TRIPLY_KEY
    const endpoint = process.env.TRIPLY_ENDPOINT

    const reply = await SuperAgent.post(endpoint)
      .set('Accept', 'application/sparql-results+json')
      .set('Authorization', 'Bearer ' + token)
      .buffer(true)
      .send({ query: `
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX calc: <http://ontology.tno.nl/normengineering/calculemus#>
        SELECT  ?iri ?title ?date ?editor WHERE {
          ?iri a calc:Task .
          ?iri rdfs:label ?title .
          OPTIONAL {
            ?iri calc:hasEditedDate ?date .
          }
          OPTIONAL {
            ?iri calc:hasEditor ?editoriri .
            ?editoriri rdfs:label ?editor .
          }
        } ORDER BY DESC(?date)
        `
      })
      .accept('json')

    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: 'Tasks retrieved!', tasks: reply.body }),
    };

}




