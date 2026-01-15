import { http } from '@/shared/lib/httpClient';
import type { Person } from '../model/people.types';

type RandomUserResponse = {
    results: any[];
};

function safeStr(v: unknown): string {
    return typeof v === 'string' ? v : v == null ? '' : String(v);
}

function safeNum(v: unknown): number {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
}

export function mapRandomUserToPerson(u: any): Person {
    const id = safeStr(u?.login?.uuid) || safeStr(u?.email) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const dobDate = safeStr(u?.dob?.date);
    const yearOfBirth = dobDate ? new Date(dobDate).getFullYear() : 0;

    const streetNo = safeStr(u?.location?.street?.number);
    const streetName = safeStr(u?.location?.street?.name);
    const streetLine = `${streetNo} ${streetName}`.trim();

    return {
        id,
        source: 'random',
        name: {
            title: safeStr(u?.name?.title),
            first: safeStr(u?.name?.first),
            last: safeStr(u?.name?.last)
        },
        gender: safeStr(u?.gender),
        email: safeStr(u?.email),
        phone: safeStr(u?.phone),
        age: safeNum(u?.dob?.age),
        yearOfBirth,
        address: {
            streetLine,
            city: safeStr(u?.location?.city),
            state: safeStr(u?.location?.state),
            country: safeStr(u?.location?.country)
        },
        thumbnailUrl: safeStr(u?.picture?.thumbnail),
        pictureUrl: safeStr(u?.picture?.large)
    };
}

export async function fetchRandomPeople(count = 10): Promise<Person[]> {
    const url = `https://randomuser.me/api/?results=${encodeURIComponent(String(count))}`;
    const data = await http<RandomUserResponse>(url);
    const results = Array.isArray(data?.results) ? data.results : [];
    return results.map(mapRandomUserToPerson);
}
