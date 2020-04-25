create database games
	with owner postgres;

create table if not exists public.duk
(
	klausimas varchar(255) not null,
	atsakymas text not null,
	id_duk serial not null
		constraint duk_pkey
			primary key
);

alter table public.duk owner to postgres;

create table if not exists public.kurejai
(
	pavadinimas varchar(255) not null,
	logotipas varchar(255) not null,
	hipersaitas varchar(255) not null,
	id_kurejai serial not null
		constraint kurejai_pkey
			primary key
);

alter table public.kurejai owner to postgres;

create unique index if not exists kurejai_pavadinimas_uindex
	on public.kurejai (pavadinimas);

create table if not exists public.vartotojai
(
	slapyvardis varchar(255) not null,
	slaptazodis varchar(255) not null,
	el_pastas varchar(255) not null,
	paskutinis_prisijungimas varchar(255) not null,
	registracijos_data varchar(255) not null,
	balansas double precision not null,
	aktyvuotas boolean not null,
	id_vartotojai serial not null
		constraint vartotojai_pkey
			primary key
);

alter table public.vartotojai owner to postgres;

create unique index if not exists vartotojai_slapyvardis_uindex
	on public.vartotojai (slapyvardis);

create unique index if not exists vartotojai_el_pastas_uindex
	on public.vartotojai (el_pastas);

create table if not exists public.grupes
(
	pavadinimas varchar(255) not null,
	id_grupes serial not null
		constraint grupes_pkey
			primary key,
	fk_vartotojaiid_vartotojai integer not null
		constraint valdo
			references public.vartotojai,
	ikurimo_data timestamp not null
);

alter table public.grupes owner to postgres;

create table if not exists public.krepseliai
(
	data timestamp not null,
	kaina double precision not null,
	id_krepseliai serial not null
		constraint krepseliai_pkey
			primary key,
	fk_vartotojaiid_vartotojai integer not null
		constraint issaugotas
			references public.vartotojai
);

alter table public.krepseliai owner to postgres;

create table if not exists public.uzsakymai
(
	data varchar(255) not null,
	busena varchar(255) not null,
	kaina double precision not null,
	pvm double precision not null,
	id_uzsakymai serial not null
		constraint uzsakymai_pkey
			primary key,
	fk_vartotojaiid_vartotojai integer not null
		constraint pateikia
			references public.vartotojai
);

alter table public.uzsakymai owner to postgres;

create table if not exists public.zaidimai
(
	pavadinimas varchar(255) not null,
	isleidimo_data timestamp not null,
	kaina double precision not null,
	varikliukas varchar(255) not null,
	zanras varchar(255),
	rezimas varchar(255) not null,
	platforma varchar(255) not null,
	id_zaidimai serial not null
		constraint zaidimai_pkey
			primary key,
	fk_kurejaiid_kurejai integer not null
		constraint sukure
			references public.kurejai
);

alter table public.zaidimai owner to postgres;

create table if not exists public.atsiliepimai
(
	ivertinimas integer not null,
	komentaras text not null,
	data timestamp not null,
	id_atsiliepimai serial not null
		constraint atsiliepimai_pkey
			primary key,
	fk_zaidimaiid_zaidimai integer not null
		constraint turi
			references public.zaidimai,
	fk_vartotojaiid_vartotojai integer not null
		constraint paraso
			references public.vartotojai
);

alter table public.atsiliepimai owner to postgres;

create table if not exists public.mokejimai
(
	tipas varchar(255) not null,
	kaina double precision not null,
	data timestamp not null,
	id_mokejimai serial not null
		constraint mokejimai_pkey
			primary key,
	fk_uzsakymaiid_uzsakymai integer not null
		constraint israso
			references public.uzsakymai,
	fk_vartotojaiid_vartotojai integer not null
		constraint atlieka
			references public.vartotojai
);

alter table public.mokejimai owner to postgres;

create table if not exists public.nuotraukos
(
	nuoroda varchar(255) not null,
	id_nuotraukos serial not null
		constraint nuotraukos_pkey
			primary key,
	fk_zaidimaiid_zaidimai integer not null
		constraint prideta
			references public.zaidimai
);

alter table public.nuotraukos owner to postgres;

create table if not exists public.zaidimu_uzsakymai
(
	fk_zaidimaiid_zaidimai integer not null
		constraint zaidimu_uzsakymai
			references public.zaidimai,
	fk_uzsakymaiid_uzsakymai integer not null,
	constraint zaidimu_uzsakymai_pkey
		primary key (fk_zaidimaiid_zaidimai, fk_uzsakymaiid_uzsakymai)
);

alter table public.zaidimu_uzsakymai owner to postgres;

create table if not exists public.vartotoju_grupes
(
	fk_grupesid_grupes integer not null
		constraint vartotoju_grupes
			references public.grupes,
	fk_vartotojaiid_vartotojai integer not null,
	constraint vartotoju_grupes_pkey
		primary key (fk_grupesid_grupes, fk_vartotojaiid_vartotojai)
);

alter table public.vartotoju_grupes owner to postgres;

create table if not exists public.zaidimu_krepseliai
(
	fk_zaidimaiid_zaidimai integer not null
		constraint zaidimu_krepseliai
			references public.zaidimai,
	fk_krepseliaiid_krepseliai integer not null,
	constraint zaidimu_krepseliai_pkey
		primary key (fk_zaidimaiid_zaidimai, fk_krepseliaiid_krepseliai)
);

alter table public.zaidimu_krepseliai owner to postgres;

