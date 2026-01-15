<template>
    <div class="page">
        <AppLoader v-if="isLeaving" />

        <AppErrorState
            v-else-if="!person"
            title="Profile not found"
            message="Try going back and selecting a profile again."
            btn-label="Go Back"
            :onRetry="goBack" />

        <template v-else>
            <div class="page__head">
                <div>
                    <h1 class="title">Profile</h1>
                    <p class="muted">{{ fullName }}</p>
                </div>

                <BaseButton variant="secondary" type="button" @click="goBack">Back</BaseButton>
            </div>

            <div class="grid">
                <BaseCard class="left">
                    <img class="photo" :src="person.pictureUrl" alt="" />

                    <div class="buttons">
                        <BaseButton v-if="isRandom" type="button" :loading="saving" @click="onSave">Save</BaseButton>

                        <BaseButton v-if="!isRandom" variant="danger" type="button" :loading="deleting" @click="onDelete"> Delete </BaseButton>

                        <BaseButton type="button" :loading="updating" @click="onUpdate">Update</BaseButton>
                    </div>
                </BaseCard>

                <BaseCard class="right">
                    <div class="section">
                        <div class="section__title">Personal</div>
                        <div class="form">
                            <div class="row">
                                <div class="label">Gender</div>
                                <div class="value">{{ person.gender }}</div>
                            </div>

                            <div class="row row--edit">
                                <div class="label">Name</div>
                                <div class="inputs">
                                    <BaseInput v-model="nameTitle" placeholder="Title" />
                                    <BaseInput v-model="nameFirst" placeholder="First" />
                                    <BaseInput v-model="nameLast" placeholder="Last" />
                                </div>
                            </div>

                            <div class="row">
                                <div class="label">Age</div>
                                <div class="value">{{ person.age }} ({{ person.yearOfBirth }})</div>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section__title">Address</div>
                        <div class="form">
                            <div class="row">
                                <div class="label">Street</div>
                                <div class="value">{{ person.address.streetLine }}</div>
                            </div>
                            <div class="row">
                                <div class="label">City</div>
                                <div class="value">{{ person.address.city }}</div>
                            </div>
                            <div class="row">
                                <div class="label">State</div>
                                <div class="value">{{ person.address.state }}</div>
                            </div>
                            <div class="row">
                                <div class="label">Country</div>
                                <div class="value">{{ person.address.country }}</div>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <div class="section__title">Contact</div>
                        <div class="form">
                            <div class="row">
                                <div class="label">Email</div>
                                <div class="value">{{ person.email }}</div>
                            </div>
                            <div class="row">
                                <div class="label">Phone</div>
                                <div class="value">{{ person.phone }}</div>
                            </div>
                        </div>
                    </div>

                    <p v-if="info" class="info">{{ info }}</p>
                </BaseCard>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseButton from '@/shared/components/base/BaseButton.vue';
import BaseCard from '@/shared/components/base/BaseCard.vue';
import BaseInput from '@/shared/components/base/BaseInput.vue';
import AppErrorState from '@/shared/components/app/AppErrorState.vue';
import AppLoader from '@/shared/components/app/AppLoader.vue';
import { useAsync } from '@/shared/composables/useAsync';
import { usePeopleStore } from '../model/people.store';
import type { PeopleSource, PersonName } from '../model/people.types';

const route = useRoute();
const router = useRouter();
const store = usePeopleStore();

const source = computed(() => String(route.params.source) as PeopleSource);
const id = computed(() => String(route.params.id));

const person = computed(() => store.getById(source.value, id.value));
const isRandom = computed(() => source.value === 'random');

const isLeaving = ref(false);
const nameTitle = ref('');
const nameFirst = ref('');
const nameLast = ref('');

const info = ref('');

onMounted(async () => {
    // If user refreshed the page on a saved profile, reload from server.
    if (!person.value && source.value === 'saved') {
        try {
            await store.loadSaved();
        } catch {
            // ignore; the UI already shows an error state
        }
    }
});

watch(
    () => person.value?.id,
    () => {
        if (!person.value) return;
        nameTitle.value = person.value.name.title;
        nameFirst.value = person.value.name.first;
        nameLast.value = person.value.name.last;
    },
    { immediate: true }
);

const fullName = computed(() => {
    if (!person.value) return '';
    return [person.value.name.title, person.value.name.first, person.value.name.last].filter(Boolean).join(' ');
});

function goBack() {
    // If page opened directly (no history), fallback to the list by source
    if (window.history.length <= 1) {
        router.push(source.value === 'saved' ? '/history' : '/random');
        return;
    }
    router.back();
}

function getNamePatch(): PersonName {
    return {
        title: nameTitle.value,
        first: nameFirst.value,
        last: nameLast.value
    };
}

const {
    loading: updating,
    error: updateError,
    execute: doUpdate
} = useAsync(async () => {
    await store.updateName(source.value, id.value, getNamePatch());
    info.value = 'Name updated.';
});

const {
    loading: saving,
    error: saveError,
    execute: doSave
} = useAsync(async () => {
    if (!person.value) return;

    const payload = {
        ...person.value,
        name: getNamePatch()
    };

    await store.saveToHistory(payload);
    info.value = 'Saved to history.';
    await router.push('/history');
});

const {
    loading: deleting,
    error: deleteError,
    execute: doDelete
} = useAsync(async () => {
    await store.deleteFromHistory(id.value);
    info.value = 'Deleted.';
    await router.push('/history');
});

async function onUpdate() {
    info.value = '';
    try {
        await doUpdate();
    } catch {
        info.value = updateError.value?.message ?? 'Update failed.';
    }
}

async function onSave() {
    info.value = '';
    try {
        await doSave();
    } catch {
        info.value = saveError.value?.message ?? 'Save failed.';
    }
}

async function onDelete() {
    info.value = '';
    isLeaving.value = true;
    try {
        await doDelete();
    } catch {
        isLeaving.value = false;
        info.value = deleteError.value?.message ?? 'Delete failed.';
    }
}
</script>

<style scoped lang="scss">
.grid {
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 16px;
}

@media (max-width: 900px) {
    .grid {
        grid-template-columns: 1fr;
    }
}

.photo {
    width: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid rgba(0, 0, 0, 0.08);
}

.buttons {
    margin-top: 12px;
    display: grid;
    gap: 10px;
}

.section {
    display: grid;
    gap: 8px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 16px;
}

.section:last-child {
    border-bottom: 0;
    margin-bottom: 0;
    padding-bottom: 0;
}

.section__title {
    font-weight: 700;
}

.form {
    display: grid;
    gap: 10px;
}

.row {
    display: grid;
    grid-template-columns: 120px 1fr;
    gap: 12px;
    align-items: center;
}

.row--edit {
    align-items: start;
}

.label {
    font-size: 13px;
    color: var(--color-text-muted);
    font-weight: 650;
}

.value {
    word-break: break-word;
}

.inputs {
    display: grid;
    grid-template-columns: 120px 1fr 1fr;
    gap: 10px;
}

@media (max-width: 520px) {
    .inputs {
        grid-template-columns: 1fr;
    }
}

.info {
    margin: 14px 0 0;
    color: var(--color-text-muted);
    font-size: 13px;
}
</style>
