<!--
    Styles
-->

<style lang="scss">

    .tcN2IN {

        #salary_frequency {
            flex: 0 0 50%;
        }

        .l-form_footer .ui-button:last-child {
            margin-left: auto;
            flex-direction: row-reverse;
        }

    }


</style>



<!--
    Template
-->

<template>

    <l-heading>
        <h1 class="h3">
            <span v-if="data.id">{{ t('HEADING_UPDATE') }}</span>
            <span v-else>{{ t('HEADING_CREATE') }}</span>
        </h1>
    </l-heading>

    <l-form
        class="tcN2IN tile"
        sticky
        :value="edits"
        :form="form"
        :defaults="data.job">
        <template #footer="{ unchanged }">

            <ui-button
                type="light"
                :text="t('BUTTON_CANCEL')"
                :disabled="publishing || saving"
                :to="state.back"
            />

            <ui-button
                v-if="!(edits.publish ?? data.job.publish)"
                type="secondary"
                :text="t('BUTTON_SAVE')"
                :loading="saving"
                :disabled="publishing"
                @click="submit('save', unchanged)"
            />

            <ui-button
                type="primary"
                :text="t('BUTTON_PUBLISH')"
                :icon="IconLgRight"
                :loading="publishing"
                :disabled="saving"
                @click="submit('publish', unchanged)"
            />

        </template>
    </l-form>

</template>



<!--
    Scripts
-->

<script setup>

    import { ref, reactive, computed, watch, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import { MBO } from '@this/shared/constants.js'
    import { usePreload, useAPI, useUser, useModal, usePlan, useText, useMeta, useSSR, useLists, useToasts, useState } from '#root/global/composables.js'
    import { empty } from '#root/global/utils.js'
    import { LHeading, LForm, UiButton } from '#root/global/components.js'
    import { IconLgRight } from '#root/global/icons.js'
    import { useFormJob } from '#root/global/forms.js'



    // -------------------
    // Preload
    // -------------------

    defineOptions({

        lists: [
            'hours_frequencies',
            'salary_frequencies',
            'categories',
            'job_types',
            'education_levels',
            'education_fields',
            'education_paths',
            'languages',
        ],

        texts: [
            'm-confirm',
            'route-account-job-upsert',
            'item-file'
        ],

        preload ({ api, qs }, to) {
            const id = qs.integer(to.params.id);
            const job = id ? api('account-jobs-item').fetch(id) : reactive({});
            const premium = api('account-jobs-premium-count').fetch();
            const locations = api('account-locations-list').fetch({ limit: 100 });
            const images = api('account-job-images-list').fetch(id);
            return { id, locations, images, job, premium }
        }

    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-job-upsert');
    const ssr = useSSR();
    const state = useState();
    const edits = reactive({});
    const data = usePreload();

    const router = useRouter();
    const modal = useModal();
    const user = useUser();
    const plan = usePlan();
    const lists = useLists();
    const toasts = useToasts();
    const form = useFormJob({ t, data, edits, user, lists });
    const apiSave = useAPI('account-jobs-upsert');
    const apiLocation = useAPI('account-locations-create');
    const action = ref();

    const pending = computed(() => {
        return apiSave.pending || apiLocation.pending
    })

    const saving = computed(() => {
        return action.value === 'save' && pending.value;
    })

    const publishing = computed(() => {
        return action.value === 'publish' && pending.value;
    })

    const hasPremium = computed(() => {
        return plan.hasJobs(data.premium);
    })

    const overrides = computed(() => {
        return action.value === 'publish' ? { publish: true } : {}
    })

    const published = computed(() => {
        return edits.publish ?? data.job.publish
    })




    // -------------------
    // Submit
    // -------------------

    async function post () {
        const { place_id } = edits;
        if (place_id) {
            const item = await apiLocation.fetch({ place_id });
            data.locations.push(item);
            edits.location = item.id;
            delete edits.place_id;
        }
        return apiSave.fetch(data.id, { ...edits, ...overrides.value })
    }

    function onSuccess (response) {
        if (edits.location) localStorage.setItem('job.location', edits.location);
        const premium = edits.premium ?? data.job.premium;
        const publish = overrides.value.publish ?? edits.publish ?? data.job.publish;
        const id = response?.id ?? data.id
        if (!premium && publish) router.push({ name: 'account-job-publish', params: { id } })
        else router.push({ name: 'account-jobs' });
    }

    function onError (e) {
        toasts.error(e, form);
    }

    function submit (_action, unchanged) {
        if (data.id && (_action === 'save' && unchanged || _action === 'publish' && published.value && unchanged)) return onSuccess();
        action.value = _action;
        post().then(onSuccess).catch(onError);
    }



    // -------------------
    // Set defaults
    // -------------------

    function setDefaults (id) {

        empty(edits);

        if (!id) {
            edits.publish = false;
            edits.premium = hasPremium.value;
            edits.hours_frequency = lists.hours_frequencies[1].value;
            edits.salary_frequency = lists.salary_frequencies[0].value;
        }

        if (!id && !ssr && data.locations.length) {
            const cached = +localStorage.getItem('job.location');
            const location = data.locations.find(location => location.id === cached) || data.locations[0];
            edits.location = location.id;
        }

    }



    // -------------------
    // Hooks
    // -------------------

    watch(() => edits.premium, value => {
        if (!value) return;
        if (hasPremium.value) return;
        edits.premium = false;
        modal.show('premium', { type: 'jobs' });
    })

    watch(() => edits.urgent, value => {
        if (!value) return;
        if (user.plan) return;
        edits.urgent = false;
        modal.show('premium', { type: 'urgent' });
    })

    watch(() => edits.education_levels, levels => {
        if (!levels) return;
        const mbo = levels.some(value => MBO.includes(value));
        if (!mbo) edits.education_paths = [];
    })

    watch(() => data.id, setDefaults);
    onMounted(() => setDefaults(data.id));
    useMeta();



</script>