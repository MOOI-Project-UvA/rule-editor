import { createStore } from "vuex";
import { Fact } from "../model/fact.js";
import { Act, ClaimDuty } from "../helpers/flint.js";
import reconstructText from "../helpers/reconstructText.js";
import { saveAs } from "file-saver";
import { parseJsonToFrames } from "../helpers/import.js";
import { json, text } from "d3-fetch";
import {
  addParentReferencesToDocument,
  getSentencesInDocument,
} from "../helpers/document.js";
import { v4 as uuid4 } from "uuid";
import {
  rdfConfig,
  jsonld2turtle,
  parseInterpretation,
  reconstructTextFromRdf,
  reconstructDataStructureFromRDF,
} from "../helpers/ontologyServices.js";
import * as rdf from "rdflib";
// import { parseInterpretation } from "../helpers/ontologyServices.js";

// Create a new store instance.
const store = createStore({
  state() {
    return {
      frames: [],
      annotations: [],
      annotationMode: null,
      frameBeingEdited: null,
      fieldBeingEdited: null,
      showFrameSource: false, //show sources for currently edited frame
      // fileContent: null, // the decomposed data will be stored to this one
      // reconstructedData: {
      //   label: "Example title",
      //   docID: "Example docID",
      //   text: "",
      // },
      sourceDocuments: [], // documents that are opened in the current interpretation
      annotationBeingEdited: null,
      availableSources: [], //list of sources that the user can choose from
      rdfStore: rdf.graph(),
      docUri: "http://ontology.tno.nl/normengineering/choppr",
      jsonString: "",
    };
  },
  getters: {
    getFileContent: (state) => state.fileContent,
    reconstructedData: (state) => state.reconstructedData,
    rdfStore: (state) => state.rdfStore,
  },
  mutations: {
    addFrame(state, frame) {
      //add frame if it does not exist yet
      if (!state.frames.includes(frame)) {
        //set unique id for this frame
        frame["id"] = uuid4();
        state.frames = [...state.frames, frame];
      }
    },
    addNewFrame(state, { frameType, annotation }) {
      let frame;
      switch (frameType.class) {
        case "fact":
          frame = new Fact();
          if (annotation) {
            frame.addAnnotation(annotation); //this also sets annotation.frame
          }
          break;
        case "relation":
          switch (frameType.id) {
            case "act":
              frame = new Act();
              break;
            case "claim_duty":
              frame = new ClaimDuty();
              break;
          }
          break;
      }
      frame.type = frameType;
      frame["id"] = uuid4();
      state.frames = [...state.frames, frame];
      state.frameBeingEdited = frame;
      console.log("frameBeingEdited", frame);
    },
    // setAnnotationMode(state, selectedMode) {
    //   state.annotationMode = selectedMode;
    // },
    setFrameBeingEdited(state, frame) {
      state.frameBeingEdited = frame;
    },
    setShowFrameSource(state, show) {
      state.showFrameSource = show;
    },
    // setFileContent(state, decomposedData) {
    //   state.fileContent = decomposedData;
    //   console.log("decomposedData: ", decomposedData);
    // },
    // setReconstructedData(state, data) {
    //   state.reconstructedData.text = reconstructText(
    //     "",
    //     data.fileContent.document.children
    //   );
    //   state.reconstructedData.docID = data.fileName
    //   console.log("reconstuct")
    // },
    addAnnotation(state, annotation) {
      console.log("adding annotation", annotation);
      state.annotations = [...state.annotations, annotation];
    },
    removeAnnotation(state, annotation) {
      console.log("removeAnnotations");
      const index = state.annotations.indexOf(annotation);
      if (index != -1) {
        state.annotations.splice(index, 1);
        console.log("state.annotations", state.annotations);
      }
    },
    setAnnotationBeingEdited(state, annotation) {
      state.annotationBeingEdited = annotation;
    },
    removeFrame(state, frame) {
      const index = state.frames.indexOf(frame);
      state.frames.splice(index, 1);
    },
    removeAtomicFact(state, frame) {
      // remove the fact from an act or a complexFact
      // case1: complex fact
      // get the generated ids (frame._id) of the complexFrames, which contain the AtomicFact

      state.frames
        .filter((f) => f.type == "fact" && f.booleanConstruct)
        .forEach((f) => {
          f.booleanConstruct.removeFrame(frame);
        });
      // const complexFramesIds = state.frames
      //   .filter((fr) => fr._type === "complexFact")
      //   .filter((fr) => fr._factList.find((d) => d._id === frame._id))
      //   .map((fr) => fr._id);
      // console.log("id of complexFrames:", complexFramesIds);

      // if (complexFramesIds.length > 0) {
      //   complexFramesIds.forEach((id) => {
      //     const index = state.frames.findIndex((d) => d._id === id);
      //     state.frames[index]._factList = state.frames[index]._factList.filter(
      //       (fr) => fr._id !== frame._id
      //     );
      //   });
      // }
      // get the generated ids of the acts that contain the AtomicFact to be deleted
      const actFrameIds = state.frames
        .filter((fr) => fr._type === "act")
        .filter((act) => {
          const term = act._terminates.find((d) => d._id === frame._id);
          const creates = act._creates.find((d) => d._id === frame._id);
          const action =
            act._action !== null && act._action._id === frame._id
              ? act._action._id
              : undefined;
          const actor =
            act._actor !== null && act._actor._id == frame._id
              ? act._actor._id
              : undefined;
          const object =
            act._object !== null && act._object._id == frame._id
              ? act._object._id
              : undefined;
          const precondition =
            act._precondition !== null && act._precondition._id == frame._id
              ? act._precondition._id
              : undefined;
          const recipient =
            act._recipient !== null && act._recipient._id == frame._id
              ? act._recipient._id
              : undefined;

          const exist = [
            term,
            creates,
            action,
            actor,
            object,
            precondition,
            recipient,
          ];
          // console.log("exist?:", exist);
          // console.log("exist?:", !exist.every((d) => d === undefined));
          return !exist.every((d) => d === undefined);
        })
        .map((fr) => fr._id);
      // console.log("ids of acts:", actFrameIds);

      if (actFrameIds.length > 0) {
        actFrameIds.forEach((id) => {
          const index = state.frames.findIndex((d) => d._id === id);

          state.frames[index]._terminates = state.frames[
            index
          ]._terminates.filter((fr) => fr._id !== frame._id);
          state.frames[index]._creates = state.frames[index]._creates.filter(
            (fr) => fr._id !== frame._id,
          );
          state.frames[index]._action =
            state.frames[index]._action !== null &&
            state.frames[index]._action._id === frame._id
              ? null
              : state.frames[index]._action;
          state.frames[index]._actor =
            state.frames[index]._actor !== null &&
            state.frames[index]._actor._id == frame._id
              ? null
              : state.frames[index]._actor;
          state.frames[index]._object =
            state.frames[index]._object !== null &&
            state.frames[index]._object._id == frame._id
              ? null
              : state.frames[index]._object;
          state.frames[index]._precondition =
            state.frames[index]._precondition !== null &&
            state.frames[index]._precondition._id == frame._id
              ? null
              : state.frames[index]._precondition;
          state.frames[index]._recipient =
            state.frames[index]._recipient !== null &&
            state.frames[index]._recipient._id == frame._id
              ? null
              : state.frames[index]._recipient;
        });
      }

      // remove the Atomicfact from the list of frames
      state.frames = state.frames.filter((fr) => fr._id !== frame._id);
      // console.log("updated list of frames:", state.frames.length, state.frames);
    },
  },
  actions: {
    readAvailableSources(context) {
      console.log("reading available sources");
      json("/sources.json").then((data) => {
        context.state.availableSources = data;
      });
    },
    //reads source, so user can annotate and create frames
    //source object contains filename where to read the source from
    async addSource(context, sourceId) {
      // console.log("addSource", sourceId)
      const source = this.state.availableSources.find((s) => s.id == sourceId);

      let docData = {
        title: "",
        children: [],
        id: "",
      };
      await json(source.fileName).then((data) => {
        console.log("data", data);
        context.state.jsonString = JSON.stringify(data);
        // console.log("string", context.state.jsonString)
        const document = data["@graph"].find((d) => "document" in d).document;
        document.title = source.title;
        docData.title = source.title;
        docData.id = document["@id"]
        console.log("document", document);
        // add parent references to each part of the document
        // addParentReferencesToDocument(document)
        // console.log("afterAddParentRefs", document)
        // add attribute to each sentence to store annotations
        getSentencesInDocument(document).forEach(
          (s) => (s["annotations"] = []),
        );
        console.log("sentences:", getSentencesInDocument(document));
      });

      const resp = await parseInterpretation(
        context.state.jsonString,
        context.state.rdfStore,
        context.state.docUri,
      );

      // const uri = context.state.rdfStore.sym(docData.id.split(/document$/,1)[0])
      // const uris = context.state.rdfStore.match(null, null, null).map(d=>d.why)
      // const uniqueUris=[...new Set(uris.map(item => item.value))].map( url=> { return uris.find(obj => obj.value === url) } )
      docData.namedNode = rdf.sym(docData.id.split(/\/document$/,1)[0])
      console.log("context.state.rdfStore: ", docData.namedNode)

      const docObject = context.state.rdfStore.statementsMatching(
        null,
        rdfConfig.namespaces.RDF("type"),
        rdfConfig.namespaces.SRC("Document"),
          docData.namedNode
      );
      console.log("docObject:", docObject)

      docData.children = reconstructDataStructureFromRDF(
        docObject[0].subject,
        context.state.rdfStore,
          docData.namedNode
      );
      console.log("docData", docData)
      // TODO: create a structure with queries similar to the following:
      context.state.sourceDocuments = [
        ...context.state.sourceDocuments,
        docData,
      ];

      // await rdf.parse(context.state.jsonString, context.state.rdfStore, context.state.docUri, "application/ld+json")

      // const document = data['@graph'].find(d => 'document' in d).document
      // document.title = source.title
      // console.log("document", document)
      // //add parent references to each part of the document
      // addParentReferencesToDocument(document)
      // console.log("afterAddParentRefs", document)
      //add attribute to each sentence to store annotations
      // getSentencesInDocument(document).forEach(s => s['annotations'] = [])
      // context.state.sourceDocuments = [...context.state.sourceDocuments, document]
      // console.log("context.state.sourceDocuments", context.state.sourceDocuments)
      // })
    },
    createAct(context) {
      console.log("create act frame");
      context.state.frameBeingEdited = new Act();
    },
    saveInterpretation(context) {
      console.log("saving interpretation");
      //convert frames to json string
      //replace object references by id's
      console.log("frames", context.state.frames);
      const string = JSON.stringify(
        context.state.frames.map((f) => f.toFlatObject()),
      );
      console.log("string", string);
      const blob = new Blob([string], {
        type: "text/plain;charset=utf-8",
      });
      const dateString = new Date().toISOString().substring(0, 10);
      saveAs(blob, `${dateString}_interpretation.json`);
    },
    loadInterpretation(context, jsonText) {
      context.state.frames = parseJsonToFrames(jsonText);
      console.log("loaded interpretation", context.state.frames);
    },
    // gets the id of the hovered frame
    // and updates the frames array, which contain
    highlightElements(context, hoveredElement) {
      // array with ids of the related elements ...
      let relatedIds = new Array(hoveredElement._id);
      // Case 1: Hovering over an atomic fact, higlight the related parents
      if (
        hoveredElement._type === "fact" &&
        !hoveredElement._booleanConstruct
      ) {
        // check if acts contain this element
        context.state.frames
          .filter((d) => d._type === "act")
          .forEach((d) =>
            d.checkFrameExistance(d, hoveredElement)
              ? relatedIds.push(d._id)
              : null,
          );
        // console.log("actIds without contexts:", relatedIds)

        // check if contexts contain this element
        context.state.frames
          .filter(
            (d) =>
              d._type === "fact" &&
              d._booleanConstruct &&
              d._id !== hoveredElement._id,
          )
          .forEach((d) =>
            d.checkFrameExistance(hoveredElement)
              ? relatedIds.push(d._id)
              : null,
          );
        // console.log("actIds with contexts:", relatedIds)
        // console.log("context.state.frames: ", context.state.frames)
      }
      // Case 2: if the hovered element is an Act, highlight the corresponding facts
      if (hoveredElement._type === "act") {
        relatedIds = relatedIds.concat(hoveredElement.childrenIds);
      }
      // Case 3: if the hovered element is a context, highlight the corresponding facts
      // check if a booleanConstruct could contain acts or other complex structures.
      if (hoveredElement._type === "fact" && hoveredElement._booleanConstruct) {
        // give me all the children
        relatedIds = relatedIds.concat(hoveredElement.retrieveChildrenIds);
      }

      // change the transparecy of the non-related atomic facts
      context.state.frames.forEach((d) => {
        return relatedIds.includes(d._id)
          ? (d._highlight = false)
          : (d._highlight = true);
      });
    },
    // Mouseout restore
    unhighlightElements(context) {
      context.state.frames.forEach((d) => (d._highlight = false));
    },
  },
});

export { store };
