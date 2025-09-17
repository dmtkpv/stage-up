<!--
    Styles
-->

<style lang="scss">

</style>



<!--
    Template
-->

<template>
    <section>

        <l-heading>
            <h1 class="h3">
                <span v-if="data.id">{{ t('HEADING_UPDATE') }}</span>
                <span v-else>{{ t('HEADING_CREATE') }}</span>
            </h1>
        </l-heading>

        <l-form
            class="tile"
            :button="t('BUTTON')"
            :value="edits"
            :form="form"
            :defaults="data.location"
            :loading="save.pending"
            :disabled="!edits.place_id"
            @submit="submit"
        />

    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { reactive } from 'vue'
    import { useRouter } from 'vue-router'
    import { usePreload, useAPI, useText, usePlan, useModal, useMeta, toastAPIError } from '#root/global/composables.js'
    import { empty } from '#root/global/utils.js'
    import { LHeading, LForm } from '#root/global/components.js'
    import { useFormLocation } from '#root/global/forms.js'



    // -------------------
    // Options
    // -------------------

    defineOptions({

        texts: [
            'route-account-location'
        ],

        preload ({ api, qs }, to) {
            const id = qs.integer(to.params.id)
            const location = id ? api('account-locations-item').fetch(id) : reactive({});
            const count = api('account-locations-count').fetch();
            return { id, location, count }
        }

    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-location');
    const edits = reactive({});
    const data = usePreload();
    const router = useRouter();
    const modal = useModal();
    const plan = usePlan();
    const form = useFormLocation({ t, data, edits })
    const save = useAPI('account-locations-upsert');



    // -------------------
    // Actions
    // -------------------

    function submit () {
        if (data.id || plan.hasLocations(data.count)) save.quiet(data.id, edits);
        else modal.show('premium', { type: 'locations' })
    }



    // -------------------
    // Hooks
    // -------------------

    save.onSuccess(() => {
        empty(edits);
        router.push({ name: 'account-locations' })
    })

    useMeta();
    toastAPIError(save, form);



</script>