import App from "@triply/triplydb";

export const handler = async function (event,context){
    console.log("event: ", event.body)
    console.log("context", context)
    const iri = JSON.parse(event.body)
    const token = process.env.TRIPLY_KEY;
    const triply = App.get({ token: token });
    const user = await triply.getAccount("choppr");
    const dataset = await user.getDataset("chopprdev");
    //TODO: add the iri selected by the user.
    const graph = await dataset.getGraph(
     iri.iri,
    ); // This is an example IRI, replace with the source you want to download
   await graph.toFile("source.ttl"); // Next, convert this file to json with unwrap-api (not ready yet)
   console.log("graph:", graph);


   return {statusCode: 200, body: JSON.stringify({message: "Source retreived!", source: graph})}
}
