<!--
    Styles
-->

<style lang="scss">

    .K8MCgQ {



        // -------------------
        // Hero
        // -------------------

        .hero {
            margin-bottom: $gap;
        }



        // -------------------
        // Messages
        // -------------------

        &_messages {

            padding: $gap-lg;
            margin-bottom: $gap;

            .item-message:not(:last-child) {
                margin-bottom: $gap-lg;
            }

        }



        // --------------------
        // Actions
        // --------------------

        &_actions {

            .ui-button {
                @extend %grey;
            }

            ._approve {
                &:disabled, &:hover, &._active {
                    @extend %green;
                }
                &._active:hover {
                    @extend %green-dark;
                }
            }

            ._reject {
                &:disabled, &:hover, &._active {
                    @extend %red;
                }
                &._active:hover {
                    @extend %red-dark;
                }

            }

        }



        // -------------------
        // Form
        // -------------------

        &_form {

            padding: $gap-lg;

            &_input {
                display: flex;
                padding: 12px 12px 12px 16px;
                gap: 12px;
                background: $blue-light;
                border: $border;
                border-radius: $radius;
                &._focused { border-color: $blue }
            }

            textarea {
                resize: none;
                align-self: center;
                flex-grow: 1;
                &::placeholder { opacity: .5 }
            }

            button {
                flex-shrink: 0;
                align-self: flex-end;
            }

            .ui-error {
                margin-top: $gap-lg;
            }

        }



    }

</style>



<!--
    Template
-->

<template>
    <section class="K8MCgQ">


        <!-- job -->

        <article v-if="data.room.job.id" class="tile hero D4VyNq">
            <unit-job class="hero_content" heading="h1" :value="data.room.job" />
            <div class="hero_actions">
                <ui-button :text="t('SHOW_JOB')" :to="{ name: 'job', params: { id: data.room.job.id, slug: data.room.job.slug }}" />
            </div>
        </article>


        <!-- company -->

        <article v-else-if="user.role === 'candidate'" class="tile hero D4VyNq">
            <unit-company class="hero_content" heading="h1" :value="data.room.company" />
            <div class="hero_actions">
                <ui-button :text="t('SHOW_COMPANY')" :to="{ name: 'company', params: { id: data.room.company.id, slug: data.room.company.slug }}" />
            </div>
        </article>


        <!-- candidate -->

        <article v-else class="tile hero D4VyNq">
            <unit-candidate class="hero_content" heading="h1" :value="data.room.candidate" />
            <div class="hero_actions">
                <ui-button :text="t('SHOW_CANDIDATE')" :to="{ name: 'candidate', params: { id: data.room.candidate.id } }" />
                <ui-button v-if="data.room.candidate.cv" :text="t('DOWNLOAD_CV')" @click="download(data.room.candidate.cv)" />
            </div>
        </article>


        <!-- messages -->

        <div class="K8MCgQ_messages tile">
            <item-message
                v-for="message in data.messages"
                :key="message.id"
                :value="message"
                :room="data.room">
                <div class="K8MCgQ_actions row" v-if="user.type === 'company'">

                    <ui-button
                        type="approve"
                        :text="status === 'APPROVED' ? t('STATUS_APPROVED') : t('BUTTON_APPROVE')"
                        :class="{ _active: status === 'PENDING' }"
                        :disabled="status === 'APPROVED'"
                        @click="setStatus('APPROVED', t('MODAL_APPROVE'), t('BUTTON_APPROVE'))"
                    />

                    <ui-button
                        type="reject"
                        :text="status === 'REJECTED' ? t('STATUS_REJECTED') : t('BUTTON_REJECT')"
                        :class="{ _active: status === 'PENDING' }"
                        :disabled="status === 'REJECTED'"
                        @click="setStatus('REJECTED', t('MODAL_REJECT'), t('BUTTON_REJECT'))"
                    />

                </div>
            </item-message>
        </div>


        <!-- form -->

        <form class="K8MCgQ_form tile" @submit.prevent="submit">

            <div class="K8MCgQ_form_input" :class="{ _focused }">
                <textarea
                    v-model="message"
                    rows="1"
                    ref="textarea"
                    :disabled="send.pending"
                    :placeholder="t('FORM_PLACEHOLDER')"
                    @input="resize"
                    @focus="_focused = true"
                    @blur="_focused = false"
                />
                <ui-button
                    :text="t('FORM_BUTTON')"
                    :loading="send.pending"
                    submit
                />
            </div>


            <ui-error v-if="send.error" :value="send.error" />

        </form>


    </section>
</template>



<!--
    Scripts
-->

<script setup>

    import { TEMPLATES_STATUSES, STATUS_TEMPLATES } from '@this/shared/constants.js'
    import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
    import { usePreload, useText, useUser, useAPI, useMeta, useModal, useIo, useIoReload } from '#root/global/composables.js'
    import { download } from '#root/global/utils.js'
    import { UnitJob, UnitCompany, UnitCandidate, ItemMessage, UiButton, UiError } from '#root/global/components.js'



    // -------------------
    // Preload
    // -------------------

    defineOptions({

        texts: [
            'route-account-room',
            'unit-job',
            'm-message',
            'item-message',
        ],

        lists: [
            'languages',
            'education_fields',
            'education_levels',
            'job_types',
        ],

        preload ({ api, qs }, to) {

            const limit = 10;
            const page = qs.integer(to.query.page);
            const room = qs.integer(to.params.id)

            return {
                room: api('account-rooms-item').fetch(room),
                messages: api('account-messages-list').fetch({ room }),
                count: api('account-messages-count').fetch({ room }),
            }
        }

    })



    // -------------------
    // Data
    // -------------------

    const t = useText('route-account-room');
    const send = useAPI('account-messages-create');
    const data = usePreload();
    const user = useUser();
    const modal = useModal();
    const io = useIo();
    const message = ref(null);
    const textarea = ref(null);
    const _focused = ref(false);

    const status = computed(() => {
        return data.room.job.status;
    })

    const room = computed(() => ({
        candidate: data.room.candidate.id,
        company: data.room.company.id,
        job: data.room.job.id,
    }));

    const title = computed(() => {
        if (data.room.job.id) return data.room.job.title;
        if (user.role === 'candidate') return data.room.company.name;
        else return data.room.candidate.first_name + ' ' + data.room.candidate.last_name;
    })



    // -------------------
    // Actions
    // -------------------

    function resize () {
        textarea.value.style.height = 'auto';
        textarea.value.style.height = textarea.value.scrollHeight + 'px';
    }

    function submit () {
        send.quiet({ room, message: message.value });
        message.value = null;
        nextTick(resize)
    }

    function setStatus (status, title, button) {
        modal.show('message', {
            room,
            title,
            button,
            edits: {
                template: STATUS_TEMPLATES[status]
            }
        })
    }

    function onFocus () {
        const active = document.hasFocus() && !document.hidden;
        const event = active ? 'focus' : 'blur';
        io.emit(event, data.room.id);
    }



    // -------------------
    // Listeners
    // -------------------

    send.onComplete(() => {
        textarea.value.focus();
    })

    io.on('message', message => {
        if (message.room !== data.room.id) return;
        data.messages.push(message);
        const status = TEMPLATES_STATUSES[message.template];
        if (status) data.room.job.status = status;
    })

    onMounted(() => {
        textarea.value.style.height = textarea.value.scrollHeight + 'px';
        io.emit('join', data.room.id);
        document.addEventListener('visibilitychange', onFocus);
        window.addEventListener('focus', onFocus);
        window.addEventListener('blur', onFocus);
    })

    onUnmounted(() => {
        io.emit('leave', data.room.id);
        document.removeEventListener('visibilitychange', onFocus);
        window.removeEventListener('focus', onFocus);
        window.removeEventListener('blur', onFocus);
    })

    useMeta(reactive({ title }));
    useIoReload(['restore']);



</script>