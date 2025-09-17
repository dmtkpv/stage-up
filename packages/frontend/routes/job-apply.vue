<!--
    Styles
-->

<style lang="scss">

    .KuhDk7 {
        margin-top: $gap;
    }

</style>



<!--
    Template
-->

<template>
    <main class="container-sm">

        <l-heading>
            <h1 class="h3">{{ t('HEADING') }}</h1>
        </l-heading>

        <unit-job
            class="tile"
            heading="h2"
            :value="data.job"
            :to="{ name: 'job', params: { id: data.job.id, slug: data.job.slug }}"
        />

        <l-form
            class="tile KuhDk7"
            label="h5"
            :value="edits"
            :button="t('BUTTON')"
            :form="form"
            :loading="apply.pending"
            @submit="apply.quiet(edits)"
        />

    </main>
</template>



<!--
    Scripts
-->

<script setup>

    import { reactive } from 'vue'
    import { useRouter } from 'vue-router'
    import { usePreload, useAPI, useUser, useText, useMeta, toastAPIError } from '#root/global/composables.js'
    import { empty, checkSlug } from '#root/global/utils.js'
    import { LHeading, UnitJob, LForm } from '#root/global/components.js'
    import { useFormApply } from '#root/global/forms.js'



    // -------------------
    // Preload
    // -------------------

    defineOptions({

        lists: [
            'job_types'
        ],

        texts: [
            'unit-job',
            'route-job-apply'
        ],

        preload ({ api }, to) {
            return {
                cvs: api('account-cvs-list').fetch(),
                job: api('jobs-item').fetch(to.params.id),
                applications: api('account-applications-list').fetch({ job: to.params.id })
            }
        },

        redirect (to) {
            const [application] = to.meta.preload.applications;
            if (application) return { name: 'account-application', params: { id: application.room }};
            return checkSlug(to, 'job');
        }

    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-job-apply');
    const data = usePreload();
    const form = useFormApply({ t, data })
    const router = useRouter();
    const apply = useAPI('account-messages-create');
    const user = useUser();

    const edits = reactive({
        attachment: null,
        template: 'APPLICATION_CREATED',
        room: {
            candidate: user.id,
            company: data.job.company,
            job: data.job.id,
        }
    });



    // -------------------
    // Hooks
    // -------------------

    apply.onSuccess(() => {
        empty(edits);
        router.push({ name: 'account-applications' })
    })

    useMeta(data.job)
    toastAPIError(apply, form)



</script>