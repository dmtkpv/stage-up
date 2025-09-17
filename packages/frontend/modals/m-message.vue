<!--
    Styles
-->

<style lang="scss">

</style>



<!--
    Template
-->

<template>
    <m-default :title="title || t('HEADING')">

        <l-form
            :value="edits"
            :button="button || t('BUTTON_SUBMIT')"
            :form="form"
            :loading="send.pending"
            :error="send.error"
            @submit="send.quiet({ room, ...edits })"
        />

    </m-default>
</template>



<!--
    Scripts
-->

<script setup>

    import { reactive } from 'vue'
    import { useAPI, useText, useModal } from '#root/global/composables.js'
    import { MDefault, LForm } from '#root/global/components.js'
    import { useFormMessage } from '#root/global/forms.js'



    // -------------------
    // Props
    // -------------------

    const props = defineProps({
        room: {
            type: Object,
            required: true
        },
        title: {
            type: String
        },
        button: {
            type: String
        },
        edits: {
            type: Object,
            default: {}
        }
    })



    // -------------------
    // Data
    // -------------------

    const modal = useModal();
    const t = useText('m-message')
    const form = useFormMessage({ t });
    const edits = reactive(props.edits);
    const send = useAPI('account-messages-create');

    send.onSuccess(() => {
       modal.hide();
    })



</script>