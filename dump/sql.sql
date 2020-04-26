create table duk
(
    klausimas varchar(255) not null,
    atsakymas text         not null,
    id_duk    serial       not null
        constraint duk_pkey
            primary key
);

alter table duk
    owner to postgres;

create table kurejai
(
    pavadinimas varchar(255) not null,
    logotipas   varchar(255) not null,
    hipersaitas varchar(255) not null,
    id_kurejai  serial       not null
        constraint kurejai_pkey
            primary key
);

alter table kurejai
    owner to postgres;

create unique index kurejai_pavadinimas_uindex
    on kurejai (pavadinimas);

create table vartotojai
(
    slapyvardis              varchar(255)                   not null,
    slaptazodis              varchar(255)                   not null,
    el_pastas                varchar(255)                   not null,
    paskutinis_prisijungimas timestamp without time zone    not null,
    registracijos_data       timestamp without time zone    not null,
    balansas                 double precision               not null,
    aktyvuotas               boolean                        not null,
    id_vartotojai            serial                         not null
        constraint vartotojai_pkey
            primary key
);

alter table vartotojai
    owner to postgres;

create unique index vartotojai_slapyvardis_uindex
    on vartotojai (slapyvardis);

create unique index vartotojai_el_pastas_uindex
    on vartotojai (el_pastas);

create table krepseliai
(
    data                       timestamp without time zone        not null,
    kaina                      double precision not null,
    id_krepseliai              serial           not null
        constraint krepseliai_pkey
            primary key,
    fk_vartotojaiid_vartotojai integer          not null
        constraint issaugotas
            references vartotojai
);

alter table krepseliai
    owner to postgres;

create table uzsakymai
(
    data                       varchar(255)     not null,
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

alter table uzsakymai
    owner to postgres;

create table zaidimai
(
    pavadinimas          varchar(255)     not null,
    isleidimo_data       timestamp without time zone        not null,
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

alter table zaidimai
    owner to postgres;

create table atsiliepimai
(
    ivertinimas                integer   not null,
    komentaras                 text      not null,
    data                       timestamp without time zone not null,
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

alter table atsiliepimai
    owner to postgres;

create table mokejimai
(
    tipas                      varchar(255)     not null,
    kaina                      double precision not null,
    data                       timestamp without time zone        not null,
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

alter table mokejimai
    owner to postgres;

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

alter table nuotraukos
    owner to postgres;

create table zaidimu_uzsakymai
(
    fk_zaidimaiid_zaidimai   integer not null
        constraint zaidimu_uzsakymai
            references zaidimai,
    fk_uzsakymaiid_uzsakymai integer not null,
    kiekis                   integer not null,
    constraint zaidimu_uzsakymai_pkey
        primary key (fk_zaidimaiid_zaidimai, fk_uzsakymaiid_uzsakymai)
);

alter table zaidimu_uzsakymai
    owner to postgres;

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

alter table zaidimu_krepseliai
    owner to postgres;

create table pasiekimai
(
    pavadinimas            varchar(255) not null,
    taskai                 integer      not null,
    id_pasiekimai          serial       not null
        constraint pasiekimai_pkey
            primary key,
    fk_zaidimaiid_zaidimai integer      not null
        constraint turimi
            references zaidimai
);

alter table pasiekimai
    owner to postgres;

CREATE TABLE grupes
(
	pavadinimas varchar(255),
	id_grupes integer,
	fk_vartotojaiid_vartotojai integer NOT NULL,
	PRIMARY KEY(id_grupes),
	CONSTRAINT valdo FOREIGN KEY(fk_vartotojaiid_vartotojai) REFERENCES vartotojai (id_vartotojai)
);