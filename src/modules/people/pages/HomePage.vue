<template>
    <div class="page">
        <div class="page__head">
            <div>
                <h1 class="title">People Explorer</h1>
                <p class="muted">Fetch 10 random profiles or view your saved history.</p>
            </div>
        </div>

        <BaseCard class="card">
            <div class="actions">
                <BaseButton type="button" :loading="loading" @click="onFetch">Fetch</BaseButton>
                <BaseButton variant="secondary" type="button" :loading="loading" @click="onHistory">History</BaseButton>
            </div>

            <AppErrorState v-if="error" title="Something went wrong" :message="error.message" :onRetry="onRetry" />
        </BaseCard>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseButton from '@/shared/components/base/BaseButton.vue';
import BaseCard from '@/shared/components/base/BaseCard.vue';
import AppErrorState from '@/shared/components/app/AppErrorState.vue';
import { useAsync } from '@/shared/composables/useAsync';
import { usePeopleStore } from '../model/people.store';

const router = useRouter();
const store = usePeopleStore();

const lastAction = ref<'random' | 'history'>('random');

const { loading, error, execute } = useAsync(async (which: 'random' | 'history') => {
    lastAction.value = which;

    if (which === 'random') {
        await store.fetchRandom();
        await router.push('/random');
        return;
    }

    await store.loadSaved();
    await router.push('/history');
});

function onFetch() {
    execute('random');
}

function onHistory() {
    execute('history');
}

function onRetry() {
    execute(lastAction.value);
}
</script>

<style scoped lang="scss">
.card {
    display: grid;
    gap: 14px;
}

.actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}
</style>
