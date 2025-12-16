<template>
  <div class="annotated-text">
    <div class="paragraph">
      <p class="text">
        <template v-for="(seg, idx) in segments" :key="seg.key || idx">
          <span v-if="seg.type === 'text'">{{ seg.text }}</span>
          <!-- Annotation (clickable; opens simple popover) -->
          <span
            v-else
            class="annotation-wrapper"
          >
            <button
              type="button"
              class="annotation interactive"
              :class="annotationClass(seg.annotation)"
              @click="togglePopover(seg.annotation.id)"
            >
              {{ seg.text }}
              <span class="status-icon" v-html="statusIconSvg(seg.annotation.status)"></span>
            </button>
            <!-- Popover for accepting/discarding recommendations -->
            <div
              v-if="openPopovers[seg.annotation.id]"
              class="popover"
            >
              <div class="popover-content">
                <div>
                  <h4 class="popover-title">Annotation Details</h4>
                  <p class="popover-meta">Text: "{{ seg.text }}"</p>
                  <p class="popover-meta">Type: {{ seg.annotation.type }}</p>
                </div>
                <div class="popover-actions">
                  <button class="btn accept" @click="accept(seg.annotation.id)">
                    <span class="icon" v-html="iconCheck"></span>
                    Accept
                  </button>
                  <button class="btn skip" @click="skip(seg.annotation.id)">
                    <span class="icon" v-html="iconMinus"></span>
                    Skip
                  </button>
                  <button class="btn discard" @click="discard(seg.annotation.id)">
                    <span class="icon" v-html="iconX"></span>
                    Discard
                  </button>
                </div>
              </div>
            </div>
          </span>
        </template>
      </p>
    </div>

    <!-- Status summary -->
    <div class="status-summary">
      <div class="status-item">
        <span class="status-icon-inline" v-html="iconClock"></span>
        <span>Pending: {{ pendingCount }}</span>
      </div>
      <div class="status-item">
        <span class="status-icon-inline" v-html="iconCheck"></span>
        <span>Accepted: {{ acceptedCount }}</span>
      </div>
      <div class="status-item">
        <span class="status-icon-inline" v-html="iconX"></span>
        <span>Discarded: {{ discardedCount }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnnotatedRecommendations',
  props: {
    index: Number,
    text: { type: String, required: true },
    annotations: { type: Array, default: () => [] }
  },
  data() {
    return {
      // local copy so the component can mutate statuses
      // items: this.annotations.map(a => ({ ...a })),
      openPopovers: {}
    };
  },
  computed: {
    sortedAnnotations() {
      return [...this.annotations].sort((a, b) => a.start - b.start);
    },
    segments() {
      // Build segments array of plain text and annotated spans
      if (this.sortedAnnotations.length === 0) {
        return [{ type: 'text', text: this.text, key: 'text-all' }];
      }

      const res = [];
      let currentIndex = 0;
      this.sortedAnnotations.forEach((annotation, i) => {
        if (currentIndex < annotation.start) {
          res.push({
            type: 'text',
            text: this.text.slice(currentIndex, annotation.start),
            key: `text-${i}`
          });
        }
        res.push({
          type: 'annotation',
          annotation,
          text: this.text.slice(annotation.start, annotation.end),
          key: `ann-${annotation.id}`
        });
        currentIndex = annotation.end;
      });

      if (currentIndex < this.text.length) {
        res.push({
          type: 'text',
          text: this.text.slice(currentIndex),
          key: 'text-end'
        });
      }
      return res;
    },
    pendingCount() {
      return this.annotations.filter(a => a.status === 'pending').length;
    },
    acceptedCount() {
      return this.annotations.filter(a => a.status === 'accepted').length;
    },
    discardedCount() {
      return this.annotations.filter(a => a.status === 'discarded').length;
    },
    // small inline SVGs as strings
    iconCheck() {
      return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    },
    iconX() {
      return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    },
    iconMinus() {
      return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg"><line x1="5" y1="12" x2="19" y2="12" stroke-linecap="round"/></svg>';
    },
    iconClock() {
      return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    },

  },
  methods: {
    togglePopover(id) {
      // Close other popovers and toggle the current one
      Object.keys(this.openPopovers).forEach(k => {
        if (k !== id) this.openPopovers[k] = false;
      });
      this.openPopovers[id] = !this.openPopovers[id];
    },
    accept(id) {
      const updated = this.annotations.map(a => a.id === id ? { ...a, status: 'accepted' } : a);
      this.$emit('update:annotations', updated);
      this.openPopovers[id] = false;
    },
    discard(id) {
      const updated = this.annotations.map(a => a.id === id ? { ...a, status: 'discarded' } : a);
      this.$emit('update:annotations', updated);
      this.openPopovers[id] = false;
    },
    skip(id) {
      this.openPopovers[id] = false;
    },
    // returns simple class names: 'accepted', 'discarded', or a type class like 'type-action'
    annotationClass(annotation) {
      if (!annotation) return '';
      const status = annotation.status;

      // pending -> type-based class (normalize)
      const type = (annotation.type || '').toLowerCase();
      const map = {
        actor: 'type-actor',
        action: 'type-action',
        object: 'type-object',
        recipient: 'type-recipient',
      };
      return `${map[type]} ${status}` || 'type-default';
    },
    statusIconSvg(status) {
      if (status === 'accepted') return this.iconCheck;
      if (status === 'discarded') return this.iconX;
      return this.iconClock;
    }
  },
  mounted(){
    this.$emit('pending-count-changed', { index: this.index, count: this.pendingCount });
  },
  watch: {
    // Assuming you have a computed property called pendingCount
    pendingCount(newVal) {
      console.log("pendingCount changed to: ", newVal)
      this.$emit('pending-count-changed', { index: this.index, count: newVal });
    }
  },
};
</script>

<style scoped>
.annotated-text {
  display: block;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  color: #222;
}

/* paragraph */
.paragraph .text {
  line-height: 1.6;
  margin: 0;
}

/* Base annotation styles */
.annotation {
  display: inline-block;
  padding: 2px 4px;
  border-radius: 4px;
  border: 1px solid transparent;
  font-size: 0.95em;
  vertical-align: baseline;
  margin: 1px 1px;
}

/* interactive pending style (button) */
.annotation.interactive {
  background-clip: padding-box;
  cursor: pointer;
  border-width: 1px;
}

/* Type color classes */
.type-actor {
  background: #FEF9C3;
  color: #92400E;
  border-color: #F2C037;
}
.type-action {
  background: #CCFBF1;
  color: #134E4A;
  border-color: #26A69A;
}
.type-object {
  background: #FFF7ED;
  color: #7C2D12;
  border-color: #ff6f00;
}
.type-recipient {
  background: #FEF9C3;
  color: #92400E;
  border-color: #F2C037;
}

.discarded {
  border: 1px dashed;
  opacity: 0.7;
}

.status-icon,
.status-icon-inline {
  display: inline-flex;
  vertical-align: middle;
  margin-left: 6px;
}
.status-icon svg,
.status-icon-inline svg {
  width: 14px;
  height: 14px;
  stroke: currentColor;
  fill: none;
}

/* wrapper for popover to position absolute relative to the wrapper */
.annotation-wrapper {
  position: relative;
  display: inline-block;
}

/* Popover */
.popover {
  position: absolute;
  left: 0;
  top: calc(100% + 6px);
  z-index: 40;
  min-width: 220px;
  max-width: 320px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}
.popover-content {
  padding: 10px;
}
.popover-title {
  margin: 0 0 6px 0;
  font-size: 0.95rem;
}
.popover-meta {
  margin: 0;
  font-size: 0.87rem;
  color: #555;
}

/* Popover action buttons */
.popover-actions {
  margin-top: 8px;
  display: flex;
  gap: 8px;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.9rem;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
}
.btn .icon svg { width: 14px; height: 14px; stroke: currentColor; fill: none; }

/* Accept / discard button */
.btn.accept {
  background: #16A34A;
  color: white;
  border-color: rgba(0,0,0,0.05);
}
.btn.discard {
  background: #FFFFFF;
  color: #9B1C1C;
  border: 1px solid #E5A7A7;
}

.btn.skip{
  background: #ffffff;      /* light gray background */
  color: #6B7280;           /* neutral gray text */
  border: 1px solid #D1D5DB;/* subtle gray border */
}

/* Status summary at bottom */
.status-summary {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 18px;
  align-items: center;
  font-size: 0.95rem;
  color: #555;
}
.status-item {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>