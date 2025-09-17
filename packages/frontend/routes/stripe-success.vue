<!--
    Styles
-->

<style lang="scss">

    .obkbLt {

        max-width: 560px;
        text-align: center;

        &_icon {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: $blue-light;
            color: $blue;
            margin-bottom: $gap;
        }

        h1 {
            margin-bottom: 16px;
        }

        &_progress {
            height: 4px;
            border-radius: 2px;
            background: $blue-light;
            margin: 24px auto;
            overflow: hidden;
            max-width: 360px;

            div {
                height: 100%;
                width: 0;
                background: $blue;
                transition-property: width;
                transition-timing-function: linear;

                &._active {
                    width: 100%;
                }

            }

        }

    }

</style>



<!--
    Template
-->

<template>
    <main />
</template>



<!--
    Scripts
-->

<script setup>

    defineOptions({

        async preload ({ api, qs }, to) {
            const job = qs.integer(to.query.job);
            await api('stripe-success').fetch();
            if (job) await api('account-jobs-upsert').fetch(job, { premium: true });
            return { job }
        },

        redirect (to) {
            const { job } = to.meta.preload;
            return job ? { name: 'account-jobs' } : { name: 'account-subscription' };
        }

    })

</script>