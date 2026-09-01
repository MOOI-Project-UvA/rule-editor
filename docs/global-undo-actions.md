# Global Undo Actions

The global Undo button and the `Ctrl+Z` / `Cmd+Z` shortcut reverse the latest action in this list. The undo history holds up to 50 in-memory entries and is cleared when a new interpretation is loaded.

| Action | Store mutation | Undo label |
| --- | --- | --- |
| Delete a frame | `removeFrame` | `Delete frame "<name>"` |
| Delete an annotation | `deleteAnnotation` | `Delete annotation` |
| Remove a source document | `removeSourceDocument` | `Remove source "<title>"` |
| Delete a nested boolean construct | `removeBooleanConstruct` | `Delete boolean construct` |
| Clear a root boolean construct | `removeBooleanConstruct` | `Clear boolean construct` |

Text fields keep their browser-native undo behavior. Global Undo does not intercept `Ctrl+Z` / `Cmd+Z` while focus is inside an input, textarea, or contenteditable element.