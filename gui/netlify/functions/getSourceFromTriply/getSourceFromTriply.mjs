import App from "@triply/triplydb";
import {alertWidget} from "../../../src/helpers/alertWidget.js";

export const handler = async function (event,context){
    const token = process.env.TRIPLY_KEY;
    const triply = App.get({ token: token });
    const user = await triply.getAccount("choppr");
    const dataset = await user.getDataset("chopprdev");
    const graph = await dataset.getGraph(
     "http://choppr.app/decompositions/f4c735fd-d0fe-4187-a9db-65e0870e26de",
    ); // This is an example IRI, replace with the source you want to download
   await graph.toFile("source.ttl"); // Next, convert this file to json with unwrap-api (not ready yet)
   console.log("graph:", graph);


   return {statusCode: 200, body: JSON.stringify({message: "Source retreived!", source: graph})}
}
