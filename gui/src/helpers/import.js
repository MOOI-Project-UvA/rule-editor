import { Fact } from '../model/fact.js'
import { Act } from "../model/act.js"
import { Claimduty } from '../model/claimduty.js'
import { frameTypes } from '../model/frame.js'
import { store } from '../store/index.js'

function parseJsonToFrames(jsonText) {
    let frameData = JSON.parse(jsonText)
    console.log("jsonText:", frameData)
    let frames = []

    // first, create an empty frame for each frame in the loaded json
    // each frame gets its id from the json data
    frameData.forEach(d => {
        const frameType = frameTypes.find(f => f.id == d.typeId)
        console.log("frameType", frameType)

        let frame
        //create empty frame of correct type
        switch (frameType.id) {
            case 'fact':
                frame = new Fact()
                break
            case 'act':
                frame = new Act()
                break
            case 'claim_duty':
                frame = new Claimduty()
                break
        }
        frame.id = d.id
        frame.type = frameType
        frames.push(frame)
    })

    //go to the loaded json once more, and fill each frame with data
    //while replacing references by ID with references to frame objects
    frameData.forEach(d => {
        let frame = frames.find(f => f.id === d.id)
        frame.fromFlatObject(d, frames)
    })

    //read source texts that are used by this interpretation
    const snippets = frames.map(f => f.annotations.map(a => a.snippets)).flat().flat()
    const documentIds = snippets
        .map(s => s.documentId)
        .filter((value, index, array) => array.indexOf(value) === index) //keep unique values
        .filter(docId => docId) //filter out empty doc ids (coming from annotations without a source)
    documentIds.forEach(docId => {
        store.dispatch("addSource", docId)
    })

    console.log("frames", frames)
    return frames
}

export {
    parseJsonToFrames
}