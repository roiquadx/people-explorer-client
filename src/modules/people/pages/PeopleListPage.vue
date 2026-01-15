<template>
    <div class="page">
        <div class="page__head">
            <div>
                <h1 class="title">{{ pageTitle }}</h1>
                <p class="muted">{{ subtitle }}</p>
            </div>

            <div class="page__headActions">
                <BaseButton v-if="source === 'random'" type="button" :loading="refetching" @click="onRefetch"> Refetch </BaseButton>
                <BaseButton v-else variant="secondary" type="button" :loading="loading" @click="onReload"> Reload </BaseButton>
            </div>
        </div>

        <BaseCard>
            <div class="filters">
                <BaseInput v-model="nameQuery" label="Filter by name" placeholder="Type a name..." />
                <BaseSelect v-model="country" label="Country" :options="countryOptions" />
            </div>
        </BaseCard>

        <AppLoader v-if="loading" />

        <AppErrorState v-else-if="error" title="Failed to load" :message="error.message" :onRetry="onRetry" />

        <AppEmptyState v-else-if="filtered.length === 0" title="No results" description="Try adjusting filters." />

        <BaseCard v-else class="list">
            <div class="row row--head">
                <div></div>
                <div>Name</div>
                <div>Gender</div>
                <div>Country</div>
                <div>Phone</div>
                <div>Email</div>
            </div>

            <button v-for="p in filtered" :key="p.id" type="button" class="row row--item" @click="openDetails(p.id)">
                <img class="avatar" :src="p.thumbnailUrl" alt="" />
                <div class="cell cell--name">
                    <div class="name">{{ fullName(p) }}</div>
                </div>
                <div class="cell">{{ p.gender }}</div>
                <div class="cell">{{ p.address.country }}</div>
                <div class="cell">{{ p.phone }}</div>
                <div class="cell cell--email">{{ p.email }}</div>
            </button>
        </BaseCard>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseButton from '@/shared/components/base/BaseButton.vue';
import BaseCard from '@/shared/components/base/BaseCard.vue';
import BaseInput from '@/shared/components/base/BaseInput.vue';
import BaseSelect, { type SelectOption } from '@/shared/components/base/BaseSelect.vue';
import AppEmptyState from '@/shared/components/app/AppEmptyState.vue';
import AppErrorState from '@/shared/components/app/AppErrorState.vue';
import AppLoader from '@/shared/components/app/AppLoader.vue';
import { useAsync } from '@/shared/composables/useAsync';
import { usePeopleStore } from '../model/people.store';
import type { PeopleSource, Person } from '../model/people.types';

const props = defineProps<{ source: PeopleSource }>();

const router = useRouter();
const store = usePeopleStore();

const nameQuery = ref('');
const country = ref('all');

const people = computed(() => (props.source === 'random' ? store.randomPeople : store.savedPeople));

const pageTitle = computed(() => (props.source === 'random' ? 'Random People' : 'History'));
const subtitle = computed(() =>
    props.source === 'random' ? `Showing ${store.randomTotal} profiles from randomuser.me` : `Showing ${store.savedTotal} saved profiles`
);

function fullName(p: Person): string {
    return [p.name.title, p.name.first, p.name.last].filter(Boolean).join(' ');
}

const countryOptions = computed<SelectOption[]>(() => {
    const countries = new Set<string>();
    for (const p of people.value) countries.add(p.address.country);
    return [
        { label: 'All', value: 'all' },
        ...Array.from(countries)
            .sort()
            .map((c) => ({ label: c, value: c }))
    ];
});

const filtered = computed(() => {
    const q = nameQuery.value.trim().toLowerCase();
    return people.value
        .filter((p) => (q ? fullName(p).toLowerCase().includes(q) : true))
        .filter((p) => (country.value === 'all' ? true : p.address.country === country.value));
});

const { loading, error, execute } = useAsync(async () => {
    if (props.source === 'random') {
        if (store.randomPeople.length === 0) await store.fetchRandom();
        return;
    }

    await store.loadSaved();
});

const { loading: refetching, execute: doRefetch } = useAsync(async () => {
    await store.fetchRandom();
});

onMounted(() => {
    execute();
});

function onRetry() {
    execute();
}

function onRefetch() {
    doRefetch();
}

function onReload() {
    execute();
}

function openDetails(id: string) {
    router.push(`/profile/${props.source}/${encodeURIComponent(id)}`);
}
</script>

<style scoped lang="scss">
.filters {
    display: grid;
    gap: 12px;
    grid-template-columns: 1fr 260px;
}

@media (max-width: 720px) {
    .filters {
        grid-template-columns: 1fr;
    }
}

.list {
    padding: 0;
    overflow: hidden;
}

.row {
    display: grid;
    grid-template-columns: 52px 1.4fr 0.7fr 0.9fr 1fr 1.6fr;
    gap: 10px;
    align-items: center;
    padding: 12px 16px;
}

.row--head {
    background: rgba(0, 0, 0, 0.03);
    font-size: 12px;
    font-weight: 700;
}

.row--item {
    width: 100%;
    text-align: left;
    border: 0;
    background: transparent;
    cursor: pointer;
    border-top: 1px solid var(--color-border);
}

.row--item:hover {
    background: rgba(0, 0, 0, 0.02);
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid rgba(0, 0, 0, 0.08);
}

.name {
    font-weight: 650;
}

.cell--email {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
