import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { HttpError, http } from '@/shared/lib/httpClient';
import { fetchRandomPeople } from '../api/randomUser.api';
import type { PeopleSource, Person, PersonName } from './people.types';

type PersonPayload = Omit<Person, 'source'>;

function normalizeName(name: PersonName): PersonName {
    return {
        title: String(name.title ?? '').trim(),
        first: String(name.first ?? '').trim(),
        last: String(name.last ?? '').trim()
    };
}

function toPayload(p: Person): PersonPayload {
    const { source, ...rest } = p;
    return rest;
}

export const usePeopleStore = defineStore('people', () => {
    const randomPeople = ref<Person[]>([]);
    const savedPeople = ref<Person[]>([]);

    const randomTotal = computed(() => randomPeople.value.length);
    const savedTotal = computed(() => savedPeople.value.length);

    function getById(source: PeopleSource, id: string): Person | null {
        const list = source === 'random' ? randomPeople.value : savedPeople.value;
        return list.find((p) => p.id === id) ?? null;
    }

    async function fetchRandom(): Promise<void> {
        const list = await fetchRandomPeople(10);
        randomPeople.value = list;
    }

    async function loadSaved(): Promise<void> {
        const list = await http<PersonPayload[]>('/api/users');
        const arr = Array.isArray(list) ? list : [];
        savedPeople.value = arr.map((p) => ({ ...p, source: 'saved' }));
    }

    async function saveToHistory(person: Person): Promise<void> {
        // POST to server, then refresh list (simple + reliable for assignment)
        await http('/api/users', { method: 'POST', body: toPayload(person) });
        await loadSaved();
    }

    async function deleteFromHistory(id: string): Promise<void> {
        await http(`/api/users/${encodeURIComponent(id)}`, { method: 'DELETE' });
        await loadSaved();
    }

    async function updateName(source: PeopleSource, id: string, patch: PersonName): Promise<void> {
        const nextName = normalizeName(patch);

        if (source === 'random') {
            const p = randomPeople.value.find((x) => x.id === id);
            if (!p) throw new HttpError(404, 'User not found');
            p.name = nextName;
            return;
        }

        // saved - server update
        await http(`/api/users/${encodeURIComponent(id)}`, {
            method: 'PATCH',
            body: { name: nextName }
        });

        // update local list without full reload (faster + still simple)
        const p = savedPeople.value.find((x) => x.id === id);
        if (p) p.name = nextName;
    }

    return {
        randomPeople,
        savedPeople,
        randomTotal,
        savedTotal,
        getById,
        fetchRandom,
        loadSaved,
        saveToHistory,
        deleteFromHistory,
        updateName
    };
});
