create table duk
(
    klausimas varchar(255) not null,
    atsakymas text         not null,
    id_duk    serial       not null
        constraint duk_pkey
            primary key
);

create table grupes
(
    pavadinimas varchar(255) not null,
    id_grupes   integer      not null
        constraint grupes_pkey
            primary key
);

create table kurejai
(
    pavadinimas varchar(255) not null,
    logotipas   varchar(255) not null,
    hipersaitas varchar(255) not null,
    id_kurejai  serial       not null
        constraint kurejai_pkey
            primary key
);

create unique index kurejai_pavadinimas_uindex
    on kurejai (pavadinimas);

create table vartotojai
(
    slapyvardis              varchar(255)     not null,
    slaptazodis              varchar(255)     not null,
    el_pastas                varchar(255)     not null,
    paskutinis_prisijungimas timestamp        not null,
    registracijos_data       timestamp        not null,
    balansas                 double precision not null,
    aktyvuotas               boolean          not null,
    id_vartotojai            serial           not null
        constraint vartotojai_pkey
            primary key
);

create unique index vartotojai_slapyvardis_uindex
    on vartotojai (slapyvardis);

create unique index vartotojai_el_pastas_uindex
    on vartotojai (el_pastas);

create table krepseliai
(
    data                       timestamp        not null,
    kaina                      double precision not null,
    id_krepseliai              serial           not null
        constraint krepseliai_pkey
            primary key,
    fk_vartotojaiid_vartotojai integer          not null
        constraint issaugotas
            references vartotojai
);

create table uzsakymai
(
    data                       timestamp        not null,
    busena                     varchar(255)     not null,
    kaina                      double precision not null,
    pvm                        double precision not null,
    id_uzsakymai               serial           not null
        constraint uzsakymai_pkey
            primary key,
    fk_vartotojaiid_vartotojai integer          not null
        constraint pateikia
            references vartotojai
);

create table zaidimai
(
    pavadinimas          varchar(255)     not null,
    isleidimo_data       timestamp        not null,
    kaina                double precision not null,
    varikliukas          varchar(255)     not null,
    zanras               varchar(255),
    rezimas              varchar(255)     not null,
    platforma            varchar(255)     not null,
    id_zaidimai          serial           not null
        constraint zaidimai_pkey
            primary key,
    fk_kurejaiid_kurejai integer          not null
        constraint sukure
            references kurejai
);

create unique index unikalus_zaidimas
    on zaidimai (pavadinimas, platforma);

create table vartotoju_grupes
(
    fk_grupesid_grupes         integer not null
        constraint vartotoju_grupes
            references grupes,
    fk_vartotojaiid_vartotojai integer not null,
    constraint vartotoju_grupes_pkey
        primary key (fk_grupesid_grupes, fk_vartotojaiid_vartotojai)
);

create table atsiliepimai
(
    ivertinimas                integer   not null,
    komentaras                 text      not null,
    data                       timestamp not null,
    id_atsiliepimai            serial    not null
        constraint atsiliepimai_pkey
            primary key,
    fk_zaidimaiid_zaidimai     integer   not null
        constraint turi
            references zaidimai,
    fk_vartotojaiid_vartotojai integer   not null
        constraint paraso
            references vartotojai
);

create table mokejimai
(
    tipas                      varchar(255)     not null,
    kaina                      double precision not null,
    data                       timestamp        not null,
    id_mokejimai               serial           not null
        constraint mokejimai_pkey
            primary key,
    fk_uzsakymaiid_uzsakymai   integer          not null
        constraint israso
            references uzsakymai,
    fk_vartotojaiid_vartotojai integer          not null
        constraint atlieka
            references vartotojai
);

create table nuotraukos
(
    nuoroda                varchar(255) not null,
    id_nuotraukos          serial       not null
        constraint nuotraukos_pkey
            primary key,
    fk_zaidimaiid_zaidimai integer      not null
        constraint prideta
            references zaidimai
);

create table zaidimu_uzsakymai
(
    fk_zaidimaiid_zaidimai   integer not null
        constraint zaidimu_uzsakymai
            references zaidimai,
    fk_uzsakymaiid_uzsakymai integer not null,
    kiekis                   integer not null,
    id_zaidimu_uzsakymai     serial  not null
        constraint zaidimu_uzsakymai_pk
            primary key,
    constraint zaidimu_uzsakymai_pkey
        unique (fk_zaidimaiid_zaidimai, fk_uzsakymaiid_uzsakymai)
);

create unique index zaidimu_uzsakymai_id_zaidimu_uzsakymai_uindex
    on zaidimu_uzsakymai (id_zaidimu_uzsakymai);

create table zaidimu_krepseliai
(
    fk_zaidimaiid_zaidimai     integer not null
        constraint zaidimu_krepseliai
            references zaidimai,
    fk_krepseliaiid_krepseliai integer not null,
    kiekis                     integer not null,
    constraint zaidimu_krepseliai_pkey
        primary key (fk_zaidimaiid_zaidimai, fk_krepseliaiid_krepseliai)
);