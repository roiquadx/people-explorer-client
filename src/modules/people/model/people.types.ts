export type PeopleSource = 'random' | 'saved';

export type PersonAddress = {
    streetLine: string;
    city: string;
    state: string;
    country: string;
};

export type PersonName = {
    title: string;
    first: string;
    last: string;
};

export type Person = {
    id: string;
    source: PeopleSource;

    name: PersonName;
    gender: string;
    email: string;
    phone: string;

    age: number;
    yearOfBirth: number;
    address: PersonAddress;

    thumbnailUrl: string;
    pictureUrl: string;
};
