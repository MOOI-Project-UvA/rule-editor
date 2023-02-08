import { AtomicFact, ComplexFact, Act } from './flint.js'

function parseJsonToFrames(jsonText) {
    let frameData = JSON.parse(jsonText)
    let frames = []

    frameData.forEach(d => {
        let frame
        //create empty frame of correct type
        switch (d.type) {
            case 'fact':
                frame = new AtomicFact()
                break
            case 'complexFact':
                frame = new ComplexFact()
                break
            case 'act':
                frame = new Act()
                break
        }
        frame.id = d.id
        frames.push(frame)
    })
    //fill with data and replace references by ID with reference to object
    frameData.forEach(d => {
        let frame = frames.find(f => f.id == d.id)
        frame.fillWithData(d, frames)
    })
    console.log("frames", frames)
    return frames
}

export {
    parseJsonToFrames
}