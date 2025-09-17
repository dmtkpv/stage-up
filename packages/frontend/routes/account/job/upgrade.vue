<!--
    Styles
-->

<style lang="scss">

    .yzS5g4 {

        text-align: center;
        margin-bottom: 64px;

        p {
            color: $grey-dark;
        }

    }

</style>



<!--
    Template
-->

<template>

    <div class="yzS5g4">
        <h1 class="h3">{{ t('HEADING') }}</h1>
        <p>{{ t('NOTE') }}</p>
    </div>

    <l-plans
        v-model="annual"
        upgrade
        :value="data.plans"
        :subscription="data.subscription"
    />

</template>



<!--
    Scripts
-->

<script setup>

    import { ref } from 'vue'
    import { usePreload, useText, useMeta } from '#root/global/composables.js'
    import { LPlans } from '#root/global/components.js'



    // -------------------
    // Preload
    // -------------------

    defineOptions({

        texts: [
            'l-plans',
            'item-plan',
            'route-account-job-upgrade'
        ],

        preload ({ api, qs }, to) {
            const id = qs.integer(to.params.id);
            return {
                id,
                plans: api('content-plans').fetch(),
                subscription: api('account-subscription').fetch()
            }
        },

        redirect (to, { state }) {
            if (state.user.plan === 3) return { name: 'account-job-upsert', params: { id: to.params.id }};
        }

    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-job-upgrade');
    const data = usePreload();
    const annual = ref(data.subscription?.annual ?? true);

    useMeta();

</script>