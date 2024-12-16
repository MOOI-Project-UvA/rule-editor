import App from '@triply/triplydb'
import N3 from 'n3'

async function load_graph(dataset,iri) {
    const graph = await dataset.getGraph(iri)
    const store = await graph.toStore()
    return store
}

export const handler = async function(event, context){
    const prefixes = {
        calc: 'http://ontology.tno.nl/normengineering/calculemus#',
        choppr: 'http://ontology.tno.nl/normengineering/choppr#',
        co: 'http://purl.org/co/',
        editor: 'http://ontology.tno.nl/normengineering/editor#',
        flint: 'http://ontology.tno.nl/normengineering/flint#',
        oa: 'http://www.w3.org/ns/oa#',
        owl: 'http://www.w3.org/2002/07/owl#',
        prov: 'http://www.w3.org/ns/prov#',
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        src: 'http://ontology.tno.nl/normengineering/source#',
        xsd: 'http://www.w3.org/2001/XMLSchema#'
    }
    const token = process.env.TRIPLY_KEY
    const triply = App.get({ token: token })
    const task_iri = 'http://ontology.tno.nl/normengineering/editor#task-42b792b8-56eb-4195-aa8c-868a32600bc3' // This is an example IRI, replace with the task you want to download

    const user = await triply.getAccount('TNO')
    const dataset = await user.getDataset('editor')
    const task_graph = await load_graph(dataset,task_iri)

    const writer = new N3.Writer({ format: 'application/trig', prefixes })
    task_graph.forEach(quad => writer.addQuad(quad)) // Add task data to output

    const required_graphs = task_graph.getObjects(task_iri, `${prefixes.calc}involves`, null) // Get other required graphs (interpretation and sources)

    for (const object of required_graphs) {
        const new_graph = await load_graph(dataset,object.value) // Load the required graph (interpretation or source)
        new_graph.forEach(quad => writer.addQuad(quad)) // Add graph data to output
    }

    // Print the output
    writer.end((error, output) => {
        if (error) {
            console.error('Error exporting:', error)
        } else {
            console.log(output) // output is a string, this can be sent to unwrap_api
        }
    })
}

