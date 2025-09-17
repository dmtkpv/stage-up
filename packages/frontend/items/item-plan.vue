<!--
    Styles
-->

<style lang="scss">

    .item-plan {



        // -------------------
        // Common
        // -------------------

        position: relative;
        display: flex;
        flex-direction: column;
        padding: 24px;



        // -------------------
        // Content
        // -------------------

        &_title {
            margin-bottom: 16px;
        }

        &_price {
            margin-bottom: 24px;
            .t6 { color: $grey-dark; }
        }

        &_description {
            margin-bottom: 24px;
        }

        .ui-button {
            margin-bottom: 24px;
        }



    }

</style>



<!--
    Template
-->

<template>
    <div class="item-plan tile">


        <!-- title -->

        <p class="h4 item-plan_title">{{ value.title }}</p>


        <!-- price -->

        <p class="item-plan_price" v-if="amount">
            <span class="h3">€ {{ amount }}</span> /
            <span class="t6">{{ t('NOTE') }}</span>
        </p>


        <!-- description -->

        <p class="item-plan_description">{{ value.description }}</p>


        <!-- button -->

        <ui-button
            class="item-plan_margin"
            v-if="button"
            :text="button"
            :loading="stripe.pending"
            :disabled="disabled"
            @click="select"
        />


        <!-- features -->

        <ul class="list">
            <li v-for="feature in value.features">
                <div class="list_icon">
                    <ui-icon :value="IconSmCheck" />
                </div>
                <p>{{ feature.title }}</p>
            </li>
        </ul>


        <!-- slot -->

        <slot />


    </div>
</template>



<!--
    Scripts
-->

<script setup>

    import { computed } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { useAPI, useUser, useText, useModal, toastAPIError } from '#root/global/composables.js'
    import { UiButton, UiIcon } from '#root/global/components.js'
    import { IconSmCheck } from '#root/global/icons.js'



    // --------------------
    // Data
    // --------------------

    const props = defineProps({
        value: Object,
        annual: Boolean,
        upgrade: Boolean,
        subscription: [Boolean, Object] // false or {}
    })

    const t = useText('item-plan')
    const user = useUser();
    const route = useRoute();
    const modal = useModal();
    const stripe = useAPI('stripe-create');

    

    // --------------------
    // Computed
    // --------------------

    const price = computed(() => {
        return props.value.prices.find(price => price.annual === props.annual);
    })

    const premium = computed(() => {
        return props.subscription && props.subscription.status !== 'canceled';
    })

    const button = computed(() => {
        if (!props.subscription) return t('BUTTON_TRIAL');
        if (props.subscription.manual) return false;
        if (props.subscription.price.startsWith('plan_')) return false;
        if (props.subscription.status === 'canceled') return t('BUTTON_SUBSCRIBE');
        if (props.subscription.price === price.value.id) return t('BUTTON_CURRENT');
        return t('BUTTON_UPDATE');
    })

    const disabled = computed(() => {
        if (!premium.value) return;
        if (props.upgrade) return props.value.id <= props.subscription.plan;
        return props.subscription.price === price.value.id;
    })

    const amount = computed(() => {
        return price.value.amount?.toFixed(2).replace('.', ',').replace(',00', '')
    })



    // --------------------
    // Actions
    // --------------------

    function select () {
        if (!user.id) return modal.show('auth-register', { type: 'company' });
        const job = route.name === 'account-job-upgrade' ? route.params.id : undefined;
        stripe.quiet({ price_id: price.value.id, path: route.fullPath, job });
    }



    // --------------------
    // Hooks
    // --------------------

    stripe.onSuccess(data => {
        window.location.replace(data.url);
    })

    toastAPIError(stripe);


</script>