<template>
  <div>
    <div
      class="text-white frame-label ellipsis non-selectable"
      style="max-width: 400px"
      :class="disabled ? 'bg-grey no-pointer-events cursor-not-allowed' : `bg-${frameColor} cursor-pointer`"
      @click="$emit('frameclicked')"
    >
      {{
        frame.shortName?.length > 0 ? frame.shortName : frame.typeId
      }}
    </div>
    <q-tooltip class="bg-blue-1 text-grey-10 text-body2">
      <div style="max-width: 300px">
        {{ frame.fullName != "" ? frame.fullName : "- no full name given yet -" }}
      </div>
    </q-tooltip>
  </div>
</template>

<script>
import { icons, colors } from "../helpers/config.js";
import { frameTypes } from "../model/frame";
export default {
  data: () => ({
    icons: icons,
    colors: colors,
    frameTypes: frameTypes,
  }),
  props: {
    frame: Object
  },
  emits: ["frameclicked"],
  computed: {
    frameBeingEdited() {
      return this.$store.state.frameBeingEdited
    },
    booleanConstructBeingEdited() {
      return this.$store.state.booleanConstructBeingEdited
    },
    frameColor() {
      return this.frame.typeId != "fact" || this.frame.subTypeIds.length == 0
          ? colors[this.frame.typeId] 
          : this.frame.subTypeIds.length > 1
            ? colors.multiple
            : colors[this.frame.subTypeIds[0]]
    },
    //prevent non-fact frames from being selected as a role of an Act or ClaimDuty
    //or as part of a boolean construct
    //prevent a frame from being part of itselfs
    disabled() {
      return this.frameBeingEdited != null &&
      ((['act', 'claim-duty'].includes(this.frameBeingEdited.typeId) &&
            this.frameBeingEdited.activeField != null) || (this.booleanConstructBeingEdited != null))
            && (this.frame.typeId != 'fact' || this.frame.id == this.frameBeingEdited.id)
    }
  }
};
</script>

<style lang="css" scoped>


.frame-label {
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 10pt;
  line-height: 1rem;
  margin: 2px;
}
</style>
