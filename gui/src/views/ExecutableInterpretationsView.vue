<template>
  <div id="executable-view" class="flex flex-center">
    <q-card flat bordered style="width: 500px; max-width: 600px">
      <q-item class="q-ma-md">
        <q-item-section avatar>
          <q-avatar icon="mdi-timeline-check-outline" rounded size="xl">
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>Make interpretations executable</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator></q-separator>
      <q-card-section>
        <q-input 
          filled 
          v-model="inputText" 
          label="Enter text" 
          type="textarea"
          :rules="[(val) => (val && val.length > 0) || 'Please enter some text']"
        />
      </q-card-section>
      <q-separator></q-separator>
      <q-card-actions class="q-pa-md flex flex-center">
        <q-btn 
          color="primary" 
          label="Submit" 
          @click="submitData"
          :loading="isLoading"
          :disable="!inputText || inputText.length === 0"
        />
      </q-card-actions>
      <q-separator v-if="responseData"></q-separator>
      <q-card-section v-if="responseData">
        <q-input 
          filled 
          v-model="responseData" 
          label="Response" 
          type="textarea"
          readonly
          autogrow
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "ExecutableInterpretationsView",
  data() {
    return {
      inputText: '',
      isLoading: false,
      responseData: ''
    }
  },
  methods: {
    async submitData() {
      this.isLoading = true;
      try {
        // Replace with your actual API endpoint
        const response = await fetch('http://localhost:5000/api/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: this.inputText })
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Success:', data);
          this.responseData = JSON.stringify(data, null, 2);
          this.$store.commit('setExecutableResponse', this.responseData);
          console.log('Response data set to:', this.responseData);
          this.$q.notify({
            type: 'positive',
            message: 'Data submitted successfully!'
          });
          // this.inputText = '';  
        } else {
          throw new Error('API request failed');
        }
      } catch (error) {
        console.error('Error:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Failed to submit data'
        });
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>