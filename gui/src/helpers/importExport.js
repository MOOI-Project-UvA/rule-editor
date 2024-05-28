import { SourceDocument } from '../model/sourceDocument.js'
import { Fact } from '../model/fact.js'
import { Act } from "../model/act.js"
import { Claimduty } from '../model/claimduty.js'
import { frameTypes } from '../model/frame.js'
import { Sentence } from '../model/sentence.js'
import { Annotation } from '../model/annotation.js'
import { Snippet } from '../model/snippet.js'



function convertInterpretationToJson(frames, sourceDocuments) {
    const sourceDocsString = sourceDocuments.map(d => ({
        id: d.id,
        checkedSentenceIds: d.sentences.map(s => s.id)
    }))
    const framesFlat = frames.map((f) => f.toFlatObject())
    //add annotations per frame
    framesFlat.forEach(frame => {
        let annotations = []
        sourceDocuments.forEach(doc => {
            const annotationsForFrame = doc.getAnnotationsForFrame(frame)
            annotationsForFrame.forEach(a => {
                annotations.push({
                    "snippets": doc.getSnippetsForAnnotation(a).map(s => s.toFlatObject())
                })
            })
        })
        frame.annotations = annotations
    })
    return {
        sourceDocs: sourceDocsString,
        frames: framesFlat
    }
}

//parse json to sourcedoc and frames
//sourcedoc will be missing the actual sentence texts from the source, these
//will be filled in later, as will the non-annotated snippets

function parseJsonToInterpretation(jsonText) {
    const parsedInterpretation = JSON.parse(jsonText)
    let sourceDocs = []
    let frames = []
    //create sourceDocs from loaded interpretation
    parsedInterpretation.sourceDocs.forEach(doc => {
        const sourceDoc = new SourceDocument(doc.id, doc.checkedSentenceIds)
        // create empty sentences with one snippet
        sourceDoc.sentences = doc.checkedSentenceIds.map(sId => new Sentence(sId, "", sourceDoc)) //IRI will be filled later
        //text of these sentences will be loaded later from the source
        sourceDocs.push(sourceDoc)
    })

    // create an empty frame for each frame in the loaded json
    // each frame gets its id from the json data
    parsedInterpretation.frames.forEach(d => {
        const frameType = frameTypes.find(f => f.id == d.typeId)

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
    parsedInterpretation.frames.forEach(parsedFrame => {
        let frame = frames.find(f => f.id === parsedFrame.id)
        frame.fromFlatObject(parsedFrame, frames)

        //go through the annotations of each frame. Create annotations objects.
        //go through the snippets of each parsed annotation, and add snippets to the
        //correct sentence in the correct document. Add the annotation to the snippet
        //the annotation object links a frame with a snippet.
        parsedFrame.annotations.forEach(parsedAnnotation => {
            const annotation = new Annotation()
            annotation.frame = frame
            //create snippet for each of the annotation's snippets
            parsedAnnotation.snippets.forEach(parsedSnippet => {
                //find sourceDoc for this snippet
                const sourceDoc = sourceDocs.find(doc => doc.id == parsedSnippet.documentId)
                //find sentence for this snippet
                const sentence = sourceDoc.sentences.find(s => s.id == parsedSnippet.sentenceId)
                //snippet possibly exists, added by another annotation
                let snippet = sentence.snippets.find(snippet => snippet.characterRange[0] == parsedSnippet.characterRange[0] && snippet.characterRange[1] == parsedSnippet.characterRange[1])
                if (!snippet) {
                    snippet = new Snippet(parsedSnippet.text, sentence, parsedSnippet.characterRange)
                    sentence.snippets.push(snippet)
                }
                snippet.annotations.push(annotation)
            })
        })
    })

    return {
        sourceDocs: sourceDocs,
        frames: frames
    }
}


export {
    convertInterpretationToJson,
    parseJsonToInterpretation
}