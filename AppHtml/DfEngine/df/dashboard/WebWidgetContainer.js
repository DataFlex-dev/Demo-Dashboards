import { WebGroup } from "../WebGroup.js"
import { df } from "../../df.js"

export class WebWidgetContainer extends WebGroup {
    
    constructor(sName, oParent) {
        super(sName, oParent);
        
        // All these props need to be forwarded to the child container
        this.prop(df.tBool, "pbAutoToggleGrid", false);
        this.prop(df.tBool, "pbDisableInternalDragDropHelper", false);
        this.prop(df.tBool, "pbUseCustomConfigurationStorage", false);

        // Event props
        this.prop(df.tBool, "pbServerOnToggleEditMode", false);
        this.prop(df.tBool, "pbServerOnWidgetMoved", false);
        this.prop(df.tBool, "pbServerOnWidgetResized", false);

        // this.event("OnToggleEditMode", df.cCallModeWait);

        this._oWidgetContainer = null; // Set by child container

        // Configure super classes
        this._sBaseClass = "WebGroup";
        this._sControlClass = "WebWidgetContainer";
    }

    create(){
        super.create();
        this.peLayoutType = df.layoutType.ciLayoutTypeFlow;
    }

    // Todo - prevent creation of non-widgetcontainer class objects
    afterRender () {
        super.afterRender();
    }

    // Forward prop websets
    set_pbAutoToggleGrid  (bVal) {
        this.pbAutoToggleGrid = bVal

        this._oWidgetContainer?.set_pbAutoToggleGrid(bVal);
    }

    set_pbDisableInternalDragDropHelper  (bVal) {
        this.pbDisableInternalDragDropHelper = bVal

        this._oWidgetContainer?.set_pbDisableInternalDragDropHelper(bVal);
    }

    set_pbUseCustomConfigurationStorage  (bVal) {
        this.pbUseCustomConfigurationStorage = bVal

        this._oWidgetContainer?.set_pbUseCustomConfigurationStorage(bVal);
    }

    set_pbServerOnToggleEditMode  (bVal) {
        this.pbServerOnToggleEditMode = bVal

        this._oWidgetContainer?.set_pbServerOnToggleEditMode(bVal);
    }

    set_pbServerOnWidgetMoved  (bVal) {
        this.pbServerOnWidgetMoved = bVal

        this._oWidgetContainer?.set_pbServerOnWidgetMoved(bVal);
    }

    set_pbServerOnWidgetResized  (bVal) {
        this.pbServerOnWidgetResized = bVal

        this._oWidgetContainer?.set_pbServerOnWidgetResized(bVal);
    }

    // Drag drop logic, partially forwarded to underlying container

    // Map dragdrop to underlying container
    getDragSourceObj () {
        return this._oWidgetContainer;
    }

    // Map dragdrop to underlying container
    getDropTargetObj () {
        return this._oWidgetContainer;
    }

    getDragData  (oEv, eDraggedElem) {
        // Should this return the dragged widget??
        return this._oWidgetContainer.getDragData(oEv, eDraggedElem);
    }
    
    getDropData  (oDropZone, oPosition) {
        return this._oWidgetContainer.getDropData(oDropZone, oPosition);
    }   
}