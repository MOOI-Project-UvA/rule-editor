import { Fact } from '../model/fact.js'
import { Act } from "../model/act.js"
import { Claimduty } from '../model/claimduty.js'
import { frameTypes } from '../model/frame.js'
import { store } from '../store/index.js'


function convertInterpretationToJson(frames, sourceDocuments) {
    // console.log("saving interpretation");
    //   //convert frames to json string
    //   //replace object references by id's
    //   console.log("frames", context.state.frames);
    //   const string = JSON.stringify(
    //     context.state.frames.map((f) => f.toFlatObject()),
    //   );
    const sourceDocsString = sourceDocuments.map(d => ({
        id: d.id,
        checkedSentenceIds: d.sentences.filter(s => s.checked).map(s => s.id)
    }))
    const framesString = frames.map((f) => f.toFlatObject())
    return {
        sourceDocs: sourceDocsString,
        frames: framesString
    }
}

function parseJsonToFrames(jsonText) {
    const interpretationString = JSON.parse(jsonText)
    let frames = []

    // first, create an empty frame for each frame in the loaded json
    // each frame gets its id from the json data
    interpretationString.frames.forEach(d => {
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
    interpretationString.frames.forEach(d => {
        let frame = frames.find(f => f.id === d.id)
        frame.fromFlatObject(d, frames)
    })

    return frames
}

export {
    convertInterpretationToJson,
    parseJsonToFrames
}