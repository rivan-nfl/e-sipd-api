PGDMP                          |            e-sipd     15.5 (Ubuntu 15.5-1.pgdg20.04+1)     15.5 (Ubuntu 15.5-1.pgdg20.04+1) 7    C           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            D           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            E           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            F           1262    16550    e-sipd    DATABASE     t   CREATE DATABASE "e-sipd" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';
    DROP DATABASE "e-sipd";
                postgres    false            R           1247    16552 	   user_role    TYPE     Q   CREATE TYPE public.user_role AS ENUM (
    'admin',
    'dipa',
    'anggota'
);
    DROP TYPE public.user_role;
       public          postgres    false            �            1259    16587    anggaran_harian    TABLE     r  CREATE TABLE public.anggaran_harian (
    id integer NOT NULL,
    pangkat character varying(50) NOT NULL,
    tingkat character varying(50) NOT NULL,
    anggaran_luar_kota character varying(50) NOT NULL,
    anggaran_dalam_kota character varying(50) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);
 #   DROP TABLE public.anggaran_harian;
       public         heap    postgres    false            �            1259    16586    anggaran_harian_id_seq    SEQUENCE     �   CREATE SEQUENCE public.anggaran_harian_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.anggaran_harian_id_seq;
       public          postgres    false    221            G           0    0    anggaran_harian_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.anggaran_harian_id_seq OWNED BY public.anggaran_harian.id;
          public          postgres    false    220            �            1259    16571    esipd    TABLE     "  CREATE TABLE public.esipd (
    id integer NOT NULL,
    keterangan character varying(500) NOT NULL,
    nomor_sprint character varying(50) NOT NULL,
    nomor_sppd character varying(50) NOT NULL,
    jenis_perjalanan character varying(50) NOT NULL,
    daerah_tujuan character varying(50) NOT NULL,
    kota_asal character varying(50) NOT NULL,
    kota_tujuan character varying(50) NOT NULL,
    tgl_berangkat character varying(50) NOT NULL,
    tgl_kembali character varying(50) NOT NULL,
    transportasi character varying(50) NOT NULL,
    pengirim integer NOT NULL,
    penerima character varying(50) NOT NULL,
    penerima_id integer NOT NULL,
    status character varying(50) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);
    DROP TABLE public.esipd;
       public         heap    postgres    false            �            1259    16570    esipd_id_seq    SEQUENCE     �   CREATE SEQUENCE public.esipd_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.esipd_id_seq;
       public          postgres    false    217            H           0    0    esipd_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.esipd_id_seq OWNED BY public.esipd.id;
          public          postgres    false    216            �            1259    16610    laporan_perjalanan    TABLE     /  CREATE TABLE public.laporan_perjalanan (
    id integer NOT NULL,
    keterangan character varying(500) NOT NULL,
    nomor_sprint character varying(50) NOT NULL,
    nomor_sppd character varying(50) NOT NULL,
    jenis_perjalanan character varying(50) NOT NULL,
    daerah_tujuan character varying(50) NOT NULL,
    kota_asal character varying(50) NOT NULL,
    kota_tujuan character varying(50) NOT NULL,
    tgl_berangkat character varying(50) NOT NULL,
    tgl_kembali character varying(50) NOT NULL,
    transportasi character varying(50) NOT NULL,
    pengirim integer NOT NULL,
    penerima character varying(50) NOT NULL,
    penerima_id integer NOT NULL,
    status character varying(50) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);
 &   DROP TABLE public.laporan_perjalanan;
       public         heap    postgres    false            �            1259    16609    laporan_perjalanan_id_seq    SEQUENCE     �   CREATE SEQUENCE public.laporan_perjalanan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.laporan_perjalanan_id_seq;
       public          postgres    false    227            I           0    0    laporan_perjalanan_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.laporan_perjalanan_id_seq OWNED BY public.laporan_perjalanan.id;
          public          postgres    false    226            �            1259    16594 
   notifikasi    TABLE     �  CREATE TABLE public.notifikasi (
    id integer NOT NULL,
    user_id integer NOT NULL,
    user_role character varying(50) NOT NULL,
    id_perjalanan integer NOT NULL,
    title character varying(100) NOT NULL,
    deskripsi character varying(100) NOT NULL,
    detail character varying(500) NOT NULL,
    status character varying(50) NOT NULL,
    perjalanan_status character varying(50) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);
    DROP TABLE public.notifikasi;
       public         heap    postgres    false            �            1259    16593    notifikasi_id_seq    SEQUENCE     �   CREATE SEQUENCE public.notifikasi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.notifikasi_id_seq;
       public          postgres    false    223            J           0    0    notifikasi_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.notifikasi_id_seq OWNED BY public.notifikasi.id;
          public          postgres    false    222            �            1259    16603    pangkat    TABLE       CREATE TABLE public.pangkat (
    id integer NOT NULL,
    pangkat character varying(50) NOT NULL,
    sub_pangkat character varying(50) NOT NULL,
    tingkat character varying(50) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);
    DROP TABLE public.pangkat;
       public         heap    postgres    false            �            1259    16602    pangkat_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pangkat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.pangkat_id_seq;
       public          postgres    false    225            K           0    0    pangkat_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.pangkat_id_seq OWNED BY public.pangkat.id;
          public          postgres    false    224            �            1259    16580    transportasi    TABLE     �  CREATE TABLE public.transportasi (
    id integer NOT NULL,
    nama character varying(50) NOT NULL,
    provinsi character varying(50) NOT NULL,
    lokasi_awal character varying(50) NOT NULL,
    lokasi_tujuan character varying(50) NOT NULL,
    type character varying(50) NOT NULL,
    biaya character varying(50) NOT NULL,
    jarak character varying(50) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);
     DROP TABLE public.transportasi;
       public         heap    postgres    false            �            1259    16579    transportasi_id_seq    SEQUENCE     �   CREATE SEQUENCE public.transportasi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.transportasi_id_seq;
       public          postgres    false    219            L           0    0    transportasi_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.transportasi_id_seq OWNED BY public.transportasi.id;
          public          postgres    false    218            �            1259    16560    users    TABLE     9  CREATE TABLE public.users (
    id integer NOT NULL,
    nama character varying(50) NOT NULL,
    nrp character varying(50) NOT NULL,
    alamat character varying(255) NOT NULL,
    pangkat character varying(50) NOT NULL,
    jabatan character varying(50) NOT NULL,
    bagian character varying(50),
    foto character varying(255),
    username character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role public.user_role NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false    850            �            1259    16559    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    215            M           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    214            �           2604    16590    anggaran_harian id    DEFAULT     x   ALTER TABLE ONLY public.anggaran_harian ALTER COLUMN id SET DEFAULT nextval('public.anggaran_harian_id_seq'::regclass);
 A   ALTER TABLE public.anggaran_harian ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    221    221            �           2604    16574    esipd id    DEFAULT     d   ALTER TABLE ONLY public.esipd ALTER COLUMN id SET DEFAULT nextval('public.esipd_id_seq'::regclass);
 7   ALTER TABLE public.esipd ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    217    217            �           2604    16613    laporan_perjalanan id    DEFAULT     ~   ALTER TABLE ONLY public.laporan_perjalanan ALTER COLUMN id SET DEFAULT nextval('public.laporan_perjalanan_id_seq'::regclass);
 D   ALTER TABLE public.laporan_perjalanan ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    227    226    227            �           2604    16597    notifikasi id    DEFAULT     n   ALTER TABLE ONLY public.notifikasi ALTER COLUMN id SET DEFAULT nextval('public.notifikasi_id_seq'::regclass);
 <   ALTER TABLE public.notifikasi ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    223    223            �           2604    16606 
   pangkat id    DEFAULT     h   ALTER TABLE ONLY public.pangkat ALTER COLUMN id SET DEFAULT nextval('public.pangkat_id_seq'::regclass);
 9   ALTER TABLE public.pangkat ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    225    224    225            �           2604    16583    transportasi id    DEFAULT     r   ALTER TABLE ONLY public.transportasi ALTER COLUMN id SET DEFAULT nextval('public.transportasi_id_seq'::regclass);
 >   ALTER TABLE public.transportasi ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    218    219            �           2604    16563    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214    215            :          0    16587    anggaran_harian 
   TABLE DATA           �   COPY public.anggaran_harian (id, pangkat, tingkat, anggaran_luar_kota, anggaran_dalam_kota, created_at, updated_at) FROM stdin;
    public          postgres    false    221   H       6          0    16571    esipd 
   TABLE DATA           �   COPY public.esipd (id, keterangan, nomor_sprint, nomor_sppd, jenis_perjalanan, daerah_tujuan, kota_asal, kota_tujuan, tgl_berangkat, tgl_kembali, transportasi, pengirim, penerima, penerima_id, status, created_at, updated_at) FROM stdin;
    public          postgres    false    217   )H       @          0    16610    laporan_perjalanan 
   TABLE DATA           �   COPY public.laporan_perjalanan (id, keterangan, nomor_sprint, nomor_sppd, jenis_perjalanan, daerah_tujuan, kota_asal, kota_tujuan, tgl_berangkat, tgl_kembali, transportasi, pengirim, penerima, penerima_id, status, created_at, updated_at) FROM stdin;
    public          postgres    false    227   FH       <          0    16594 
   notifikasi 
   TABLE DATA           �   COPY public.notifikasi (id, user_id, user_role, id_perjalanan, title, deskripsi, detail, status, perjalanan_status, created_at, updated_at) FROM stdin;
    public          postgres    false    223   cH       >          0    16603    pangkat 
   TABLE DATA           \   COPY public.pangkat (id, pangkat, sub_pangkat, tingkat, created_at, updated_at) FROM stdin;
    public          postgres    false    225   �H       8          0    16580    transportasi 
   TABLE DATA           �   COPY public.transportasi (id, nama, provinsi, lokasi_awal, lokasi_tujuan, type, biaya, jarak, created_at, updated_at) FROM stdin;
    public          postgres    false    219   �H       4          0    16560    users 
   TABLE DATA           �   COPY public.users (id, nama, nrp, alamat, pangkat, jabatan, bagian, foto, username, password, role, created_at, updated_at) FROM stdin;
    public          postgres    false    215   �H       N           0    0    anggaran_harian_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.anggaran_harian_id_seq', 1, false);
          public          postgres    false    220            O           0    0    esipd_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.esipd_id_seq', 1, false);
          public          postgres    false    216            P           0    0    laporan_perjalanan_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.laporan_perjalanan_id_seq', 1, false);
          public          postgres    false    226            Q           0    0    notifikasi_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.notifikasi_id_seq', 1, false);
          public          postgres    false    222            R           0    0    pangkat_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.pangkat_id_seq', 1, false);
          public          postgres    false    224            S           0    0    transportasi_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.transportasi_id_seq', 1, false);
          public          postgres    false    218            T           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 1, false);
          public          postgres    false    214            �           2606    16592 $   anggaran_harian anggaran_harian_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.anggaran_harian
    ADD CONSTRAINT anggaran_harian_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.anggaran_harian DROP CONSTRAINT anggaran_harian_pkey;
       public            postgres    false    221            �           2606    16578    esipd esipd_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.esipd
    ADD CONSTRAINT esipd_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.esipd DROP CONSTRAINT esipd_pkey;
       public            postgres    false    217            �           2606    16617 *   laporan_perjalanan laporan_perjalanan_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.laporan_perjalanan
    ADD CONSTRAINT laporan_perjalanan_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.laporan_perjalanan DROP CONSTRAINT laporan_perjalanan_pkey;
       public            postgres    false    227            �           2606    16601    notifikasi notifikasi_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.notifikasi
    ADD CONSTRAINT notifikasi_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.notifikasi DROP CONSTRAINT notifikasi_pkey;
       public            postgres    false    223            �           2606    16608    pangkat pangkat_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.pangkat
    ADD CONSTRAINT pangkat_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.pangkat DROP CONSTRAINT pangkat_pkey;
       public            postgres    false    225            �           2606    16585    transportasi transportasi_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.transportasi
    ADD CONSTRAINT transportasi_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.transportasi DROP CONSTRAINT transportasi_pkey;
       public            postgres    false    219            �           2606    16567    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    215            �           2606    16569    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public            postgres    false    215            :      x������ � �      6      x������ � �      @      x������ � �      <      x������ � �      >      x������ � �      8      x������ � �      4      x������ � �     