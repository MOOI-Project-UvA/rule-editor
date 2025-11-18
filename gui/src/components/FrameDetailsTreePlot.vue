<template>
    <div class="bg-light-blue-1 q-pa-sm all-pointer-events">
        <div class="row items-center">
            <div class="col text-h6">{{ frame.shortName }}</div>
            <div>
                <q-btn class="cursor-pointer" icon="mdi-close" flat round dense @click="close"/>
            </div>
        </div>
        <template v-if="frame.typeId == 'act'">
            <div class="">Precondition</div>
            <template v-if="!frame.precondition.isEmpty">
                <FactOrBooleanConstructPlot
                    :factOrBooleanConstruct="frame.precondition"
                />
            </template>
            <template v-else>
                <div>-</div>
            </template>
             <div class="">Roles</div>
             <div v-for="roleName in ['action', 'actor', 'object', 'recipient']">
                <div class="">{{roleName}}</div>
                <template v-if="frame[roleName]">
                    <FactOrBooleanConstructPlot
                        :factOrBooleanConstruct="frame[roleName]"
                    />
                </template>
                <template>
                    <div>-</div>
                </template>
             </div>
        </template>
        <template v-if="frame.typeId == 'claim_duty'">

        </template>
    </div>
</template>

<script>
import FactOrBooleanConstructPlot from "./FactOrBooleanConstructPlot.vue";
export default {
    data: () => ({

    }),
    props: {
        frame: Object
    },
    components: {
        FactOrBooleanConstructPlot
    },
    computed: {
    },
    methods: {
        close() {
            this.$store.state.selectedNode = null
        }
    }
}
</script>


<!--
<div>

    {#if $selectedNode.frame.typeId == "act"}
        <div class="text-sm text-[#ffffff] bg-[#1F85DE] p-1">Precondition</div>
        {#if !$selectedNode.frame.precondition.isEmpty}
            <FactOrBooleanConstructPlot
                factOrBooleanConstruct={$selectedNode.frame.precondition}
            />
        {:else}
            <div>-</div>
        {/if}
        <div class="text-sm text-[#ffffff] bg-[#1F85DE] p-1">Roles</div>
        {#each ["action", "actor", "object", "recipient"] as roleName}
            <div class="text-xs font-bold capitalize bg-[#eeeeee]">
                {roleName}
            </div>
            {#if $selectedNode.frame[roleName]}
                <FactOrBooleanConstructPlot
                    factOrBooleanConstruct={$selectedNode.frame[roleName]}
                />
            {:else}
                <div>-</div>
            {/if}
        {/each}
        <div class="text-sm text-[#ffffff] bg-[#1F85DE] p-1">Postcondition</div>
        <div class="text-xs font-bold bg-[#eeeeee] p-1">Creates</div>
        {#if $selectedNode.frame.creates.length > 0}
            {#each $selectedNode.frame.creates as frame}
                
                {#if frame.typeId == "claim_duty"}
                    <div class="flex gap-1 items-center ml-2 p-1">
                        <div class="claimDutyDot" />
                        <div class="text-xs">{frame.shortName}</div>
                    </div>
                {:else}
                    <FactOrBooleanConstructPlot
                        factOrBooleanConstruct={frame}
                    />
                {/if}
            {/each}
        {:else}
            <div>-</div>
        {/if}
        <div class="text-xs font-bold bg-[#eeeeee] p-1">Terminates</div>
        {#if $selectedNode.frame.terminates.length > 0}
            {#each $selectedNode.frame.terminates as frame}
                
                {#if frame.typeId == "claim_duty"}
                    <div class="flex gap-1 items-center ml-2 p-1">
                        <div class="claimDutyDot" />
                        <div class="text-xs">{frame.shortName}</div>
                    </div>
                {:else}
                    <FactOrBooleanConstructPlot
                        factOrBooleanConstruct={frame}
                    />
                {/if}
            {/each}
        {:else}
            <div>-</div>
        {/if}
    {:else if $selectedNode.frame.typeId == "claim_duty"}
        <div class="text-sm text-[#ffffff] bg-[#1F85DE] p-1">Roles</div>
        {#each ["duty", "claimant", "holder"] as roleName}
            <div class="text-xs font-bold capitalize bg-[#eeeeee]">
                {roleName}
            </div>
            {#if $selectedNode.frame[roleName]}
                <FactOrBooleanConstructPlot
                    factOrBooleanConstruct={$selectedNode.frame[roleName]}
                />
            {:else}
                <div>-</div>
            {/if}
        {/each}
    {/if}
</div>-->

<style>
    .claimDutyDot {
        width: 12px;
        height: 12px;
        border-radius: 6px;
        background-color: #c51162;
    }
</style>
