<template>
    <q-card flat>
        <q-card-section>
            <q-btn-toggle size="sm" v-model="booleanConstruct" toggle-color="primary" :options="[
                { label: 'AND', value: 'and' },
                { label: 'OR', value: 'or' }
            ]" />

        </q-card-section>

    </q-card>
</template>

<script>
export default {
    props: {
        booleanConstruct: Object
    }
}
</script>