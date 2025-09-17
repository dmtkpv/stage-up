<!--
    Styles
-->

<style lang="scss">



    // -------------------
    // Plans
    // -------------------

    .wlYIfr {
        padding-top: $gap;
    }



</style>



<!--
    Template
-->

<template>
    <section>


        <!-- heading -->

        <l-heading>
            <h1 class="h3">{{ t('HEADING') }}</h1>
        </l-heading>


        <!-- plans -->

        <l-plans
            class="wlYIfr"
            v-model="annual"
            :upgrade="true"
            :value="data.plans"
            :subscription="data.subscription"
        />

    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { ref } from 'vue'
    import { useAPI, usePreload, useText, useMeta, toastAPIError } from '#root/global/composables.js'
    import { LHeading, LPlans } from '#root/global/components.js'

    defineOptions({

        texts: [
            'l-plans',
            'item-plan',
            'route-account-upgrade'
        ],

        async preload ({ api }) {
            return {
                plans: api('content-plans').fetch(),
                subscription: api('account-subscription').fetch()
            }

        }

    })

    const t = useText('route-account-upgrade');
    const data = usePreload();
    const manage = useAPI('stripe-manage');
    const annual = ref(data.subscription?.annual ?? true);

    manage.onSuccess(data => {
        window.location.replace(data.url);
    })

    useMeta();
    toastAPIError(manage);



</script>