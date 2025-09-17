<!--
    Styles
-->

<style lang="scss">

    .FsFFCg {

        p {
            margin-bottom: $gap;
        }

    }

</style>



<!--
    Template
-->

<template>
    <m-default class="auth FsFFCg" :title="t('HEADING')">

        <template v-if="recovery.success">
            <p>{{ t('SUCCESS') }}</p>
            <ui-button :text="t('BUTTON_LOGIN')" :to="{ name: 'auth-login' }" />
        </template>

        <l-form
            v-else
            :button="t('BUTTON_SUBMIT')"
            :value="edits"
            :form="form"
            :error="recovery.error"
            :loading="recovery.pending"
            @submit="recovery.quiet({ token, ...edits })"
        />

    </m-default>
</template>



<!--
    Scripts
-->

<script setup>

    import { reactive, computed } from 'vue'
    import { useRoute } from 'vue-router'
    import { useAPI, useText, useMeta } from '#root/global/composables.js'
    import { MDefault, UiButton, LForm } from '#root/global/components.js'
    import { useFormRecovery } from '#root/global/forms.js'



    // -------------------
    // Preload
    // -------------------

    defineOptions({
        texts: [
            'route-auth-recovery'
        ]
    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-auth-recovery');
    const form = useFormRecovery( { t });
    const recovery = useAPI('auth-recovery');
    const edits = reactive({})
    const route = useRoute();

    const token = computed(() => {
        return route.query.token
    })



    // -------------------
    // Hooks
    // -------------------

    recovery.onSuccess(() => {
        recovery.success = true;
    })

    useMeta();



</script>