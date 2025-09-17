<!--
    Template
-->

<template>
    <section>

        <l-heading>
            <h1 class="h3">{{ t('HEADING') }}</h1>
        </l-heading>

        <l-form
            class="tile"
            sticky
            :button="t('BUTTON')"
            :value="edits"
            :form="form"
            :defaults="data.company"
            :loading="save.pending"
            @submit="save.quiet(edits)"
         />

    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { reactive } from 'vue'
    import { usePreload, useAPI, useText, useMeta, useLists, toastAPIError } from '#root/global/composables.js'
    import { empty } from '#root/global/utils.js'
    import { LHeading, LForm } from '#root/global/components.js'
    import { useFormCompany } from '#root/global/forms.js'



    // -------------------
    // Options
    // -------------------

    defineOptions({

        texts: [
            'i-image',
            'route-account-company'
        ],

        lists: [
            'branches'
        ],

        preload ({ api }) {
            return {
                company: api('account-company-item').fetch(),
            }
        }
    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-company')
    const data = usePreload();
    const lists = useLists();
    const form = useFormCompany({ t, lists });
    const save = useAPI('account-company-update');
    const edits = reactive({});



    // -------------------
    // Hooks
    // -------------------

    save.onSuccess(() => {
        Object.assign(data.company, edits);
        empty(edits);
    })

    useMeta();
    toastAPIError(save, form);



</script>