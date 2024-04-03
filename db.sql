PGDMP                      |            e-sipd    16.2 (Postgres.app)    16.0 7    `           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            a           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            b           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            c           1262    21167    e-sipd    DATABASE     t   CREATE DATABASE "e-sipd" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';
    DROP DATABASE "e-sipd";
                postgres    false            U           1247    21169 	   user_role    TYPE     Q   CREATE TYPE public.user_role AS ENUM (
    'admin',
    'dipa',
    'anggota'
);
    DROP TYPE public.user_role;
       public          postgres    false            �            1259    21175    anggaran_harian    TABLE     '  CREATE TABLE public.anggaran_harian (
    id integer NOT NULL,
    pangkat character varying(50) NOT NULL,
    golongan character varying(50) NOT NULL,
    tingkat character varying(50) NOT NULL,
    anggaran_luar_kota character varying(50) NOT NULL,
    anggaran_dalam_kota character varying(50) NOT NULL,
    uang_penginapan character varying(50),
    uang_representasi_luar_kota character varying(50),
    uang_representasi_dalam_kota character varying(50),
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);
 #   DROP TABLE public.anggaran_harian;
       public         heap    postgres    false            �            1259    21178    anggaran_harian_id_seq    SEQUENCE     �   CREATE SEQUENCE public.anggaran_harian_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.anggaran_harian_id_seq;
       public          postgres    false    215            d           0    0    anggaran_harian_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.anggaran_harian_id_seq OWNED BY public.anggaran_harian.id;
          public          postgres    false    216            �            1259    22023    esipd    TABLE     m  CREATE TABLE public.esipd (
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
    pejalan character varying(1000),
    anggaran character varying(1000),
    status character varying(50) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);
    DROP TABLE public.esipd;
       public         heap    postgres    false            �            1259    22022    esipd_id_seq    SEQUENCE     �   CREATE SEQUENCE public.esipd_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.esipd_id_seq;
       public          postgres    false    228            e           0    0    esipd_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.esipd_id_seq OWNED BY public.esipd.id;
          public          postgres    false    227            �            1259    21185    laporan_perjalanan    TABLE     U  CREATE TABLE public.laporan_perjalanan (
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
    anggaran character varying(1000),
    status character varying(50) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);
 &   DROP TABLE public.laporan_perjalanan;
       public         heap    postgres    false            �            1259    21190    laporan_perjalanan_id_seq    SEQUENCE     �   CREATE SEQUENCE public.laporan_perjalanan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 0   DROP SEQUENCE public.laporan_perjalanan_id_seq;
       public          postgres    false    217            f           0    0    laporan_perjalanan_id_seq    SEQUENCE OWNED BY     W   ALTER SEQUENCE public.laporan_perjalanan_id_seq OWNED BY public.laporan_perjalanan.id;
          public          postgres    false    218            �            1259    21191 
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
       public         heap    postgres    false            �            1259    21196    notifikasi_id_seq    SEQUENCE     �   CREATE SEQUENCE public.notifikasi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.notifikasi_id_seq;
       public          postgres    false    219            g           0    0    notifikasi_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.notifikasi_id_seq OWNED BY public.notifikasi.id;
          public          postgres    false    220            �            1259    21197    pangkat    TABLE     F  CREATE TABLE public.pangkat (
    id integer NOT NULL,
    pangkat character varying(50) NOT NULL,
    sub_pangkat character varying(50) NOT NULL,
    golongan character varying(50) NOT NULL,
    tingkat character varying(50) NOT NULL,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);
    DROP TABLE public.pangkat;
       public         heap    postgres    false            �            1259    21200    pangkat_id_seq    SEQUENCE     �   CREATE SEQUENCE public.pangkat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.pangkat_id_seq;
       public          postgres    false    221            h           0    0    pangkat_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.pangkat_id_seq OWNED BY public.pangkat.id;
          public          postgres    false    222            �            1259    21201    transportasi    TABLE     �  CREATE TABLE public.transportasi (
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
       public         heap    postgres    false            �            1259    21204    transportasi_id_seq    SEQUENCE     �   CREATE SEQUENCE public.transportasi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.transportasi_id_seq;
       public          postgres    false    223            i           0    0    transportasi_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.transportasi_id_seq OWNED BY public.transportasi.id;
          public          postgres    false    224            �            1259    21205    users    TABLE     V  CREATE TABLE public.users (
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
    active boolean NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false    853            �            1259    21210    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    225            j           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    226            �           2604    21211    anggaran_harian id    DEFAULT     x   ALTER TABLE ONLY public.anggaran_harian ALTER COLUMN id SET DEFAULT nextval('public.anggaran_harian_id_seq'::regclass);
 A   ALTER TABLE public.anggaran_harian ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215            �           2604    22026    esipd id    DEFAULT     d   ALTER TABLE ONLY public.esipd ALTER COLUMN id SET DEFAULT nextval('public.esipd_id_seq'::regclass);
 7   ALTER TABLE public.esipd ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    227    228    228            �           2604    21213    laporan_perjalanan id    DEFAULT     ~   ALTER TABLE ONLY public.laporan_perjalanan ALTER COLUMN id SET DEFAULT nextval('public.laporan_perjalanan_id_seq'::regclass);
 D   ALTER TABLE public.laporan_perjalanan ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    218    217            �           2604    21214    notifikasi id    DEFAULT     n   ALTER TABLE ONLY public.notifikasi ALTER COLUMN id SET DEFAULT nextval('public.notifikasi_id_seq'::regclass);
 <   ALTER TABLE public.notifikasi ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    219            �           2604    21215 
   pangkat id    DEFAULT     h   ALTER TABLE ONLY public.pangkat ALTER COLUMN id SET DEFAULT nextval('public.pangkat_id_seq'::regclass);
 9   ALTER TABLE public.pangkat ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    222    221            �           2604    21216    transportasi id    DEFAULT     r   ALTER TABLE ONLY public.transportasi ALTER COLUMN id SET DEFAULT nextval('public.transportasi_id_seq'::regclass);
 >   ALTER TABLE public.transportasi ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    223            �           2604    21217    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    226    225            P          0    21175    anggaran_harian 
   TABLE DATA           �   COPY public.anggaran_harian (id, pangkat, golongan, tingkat, anggaran_luar_kota, anggaran_dalam_kota, uang_penginapan, uang_representasi_luar_kota, uang_representasi_dalam_kota, created_at, updated_at) FROM stdin;
    public          postgres    false    215   �I       ]          0    22023    esipd 
   TABLE DATA              COPY public.esipd (id, keterangan, nomor_sprint, nomor_sppd, jenis_perjalanan, daerah_tujuan, kota_asal, kota_tujuan, tgl_berangkat, tgl_kembali, transportasi, pengirim, penerima, penerima_id, pejalan, anggaran, status, created_at, updated_at) FROM stdin;
    public          postgres    false    228   J       R          0    21185    laporan_perjalanan 
   TABLE DATA             COPY public.laporan_perjalanan (id, keterangan, nomor_sprint, nomor_sppd, jenis_perjalanan, daerah_tujuan, kota_asal, kota_tujuan, tgl_berangkat, tgl_kembali, transportasi, pengirim, penerima, penerima_id, anggaran, status, created_at, updated_at) FROM stdin;
    public          postgres    false    217   �L       T          0    21191 
   notifikasi 
   TABLE DATA           �   COPY public.notifikasi (id, user_id, user_role, id_perjalanan, title, deskripsi, detail, status, perjalanan_status, created_at, updated_at) FROM stdin;
    public          postgres    false    219   �N       V          0    21197    pangkat 
   TABLE DATA           f   COPY public.pangkat (id, pangkat, sub_pangkat, golongan, tingkat, created_at, updated_at) FROM stdin;
    public          postgres    false    221   �P       X          0    21201    transportasi 
   TABLE DATA           �   COPY public.transportasi (id, nama, provinsi, lokasi_awal, lokasi_tujuan, type, biaya, jarak, created_at, updated_at) FROM stdin;
    public          postgres    false    223   KQ       Z          0    21205    users 
   TABLE DATA           �   COPY public.users (id, nama, nrp, alamat, pangkat, jabatan, bagian, foto, username, password, role, active, created_at, updated_at) FROM stdin;
    public          postgres    false    225   �Q       k           0    0    anggaran_harian_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.anggaran_harian_id_seq', 1, false);
          public          postgres    false    216            l           0    0    esipd_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.esipd_id_seq', 2, true);
          public          postgres    false    227            m           0    0    laporan_perjalanan_id_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.laporan_perjalanan_id_seq', 2, true);
          public          postgres    false    218            n           0    0    notifikasi_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.notifikasi_id_seq', 14, true);
          public          postgres    false    220            o           0    0    pangkat_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.pangkat_id_seq', 1, false);
          public          postgres    false    222            p           0    0    transportasi_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.transportasi_id_seq', 1, false);
          public          postgres    false    224            q           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 4, true);
          public          postgres    false    226            �           2606    21219 $   anggaran_harian anggaran_harian_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.anggaran_harian
    ADD CONSTRAINT anggaran_harian_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.anggaran_harian DROP CONSTRAINT anggaran_harian_pkey;
       public            postgres    false    215            �           2606    22030    esipd esipd_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.esipd
    ADD CONSTRAINT esipd_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.esipd DROP CONSTRAINT esipd_pkey;
       public            postgres    false    228            �           2606    21223 *   laporan_perjalanan laporan_perjalanan_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public.laporan_perjalanan
    ADD CONSTRAINT laporan_perjalanan_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public.laporan_perjalanan DROP CONSTRAINT laporan_perjalanan_pkey;
       public            postgres    false    217            �           2606    21225    notifikasi notifikasi_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.notifikasi
    ADD CONSTRAINT notifikasi_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.notifikasi DROP CONSTRAINT notifikasi_pkey;
       public            postgres    false    219            �           2606    21227    pangkat pangkat_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.pangkat
    ADD CONSTRAINT pangkat_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.pangkat DROP CONSTRAINT pangkat_pkey;
       public            postgres    false    221            �           2606    21229    transportasi transportasi_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public.transportasi
    ADD CONSTRAINT transportasi_pkey PRIMARY KEY (id);
 H   ALTER TABLE ONLY public.transportasi DROP CONSTRAINT transportasi_pkey;
       public            postgres    false    223            �           2606    21231    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    225            �           2606    21233    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public            postgres    false    225            P   d   x�3�H,�TN,)�4�t�414 NC30ebb ��L!�`�3���� :]J9�8��4)�R#�~C�h�����i�錮���LC�4G�1F��� q�"�      ]   �  x��U]o�0}���S� ���mU�NLQ���i�,!�'r��k��u@%@;A6i��9ל{�u|̬�ba�Dח�'}�]�Ǉ��{.gV,���XW� d"���njS�	�bY+�S��)~�	��1���˶����Tf�>�4Er­���l��A�V�[�/E!] ����"T�J�B�&ѱDd��*P-d
�l�1(H��,�r�UU���tl��+x(��r��P�IU�{5�'3����ȭ�B�HR��F�	�Z���ث�ڑ���>pT�QG�G߬g{*q�?�nd�����`��T*(L�3�o+���PQ��K(m�l#`����_S,���6�4�+�v�Yǽ�en`V�6&TY����,C?��:)tR&��Rn���_���#g�z����H�v�#�/6�a�%�������hh�Y�X�pt�C�����U�8o��������l:E�#�h�#�ƛfQ�h�{M�b
�<Q�ThAW��=�$�U��]2 �����mN�3G�WD�@j�,�V,U�
b��t�\�-��- h��:��t�/<�t�^����A����T�w���kqzJ'Ys���N�H4���7r�8���i�ݏ���F�c�6��U�I��壿�z�#;1�fR�r��;����!vpO�PБýQ���t:� '>�      R     x��TM��0=˿B�@�J��ĺ5졛�bvs*�2!^G��ld�nY��+9!�:u��CA`yfx���� 8�-d����W���J�k�k�h	[Uk�)c��lŸ�T�لR���`��X��!�>�4u��������(�D������':U
�`Ӑ^�����8��=�D�kp�8���1��"w��)��]��M]��pJ�2��"7��β�A�Ia�2����ಠc��)'�0<x���pna�!~��l�ɔ���!�p����>x�Ń�8c�u����;�� q��}�̎<4�x�S�8��Z���y��9�q�%5Y�S��D�J�&L{xu��*1�!���z�P��S���eO{��zRZ��d{Aj۹�ɣ�,
��G ���/+Kx�^㻱�Y/9��RR�K��r�D�9
�2�y5���������߉�O&�X�D��Ե͝��A��:���mj��3���6��9)*�y�?u=��#8f��qI�	Q��[O<��	i��      T   �  x����r�0���S�����e��n:�8�u�����������`��໇s%��-jO��C��]�K�䛎���e��ٷ��n���O�)�cհM�eˀ�������n����� N��)T�E�)�^	�)p�8���YL��\I�H�]�e��I��t*���E��٥�/{�B�v�q��9�p��Ѽh��\��ɥ�	�mb��N�lB-�ėy^��������m�6lV�;V�5�o�wF�u�Ta�g&Φ��fEM4�,�՘�����TѭS��hҳ�O����R!F�T�ۅ�	���N�7��8<54�2_�>�S���:4;�%.7q��qGg�Q�)�� �nt��A�f3�������N ����/+�J/�l�QwMş���D�3\":��ޕ�a��ӊfp�:ix*�P?/+R&$��ə�d�'s<{-N�}y~��QXnpV5�m�:��l�F�3_�Ҹ�`;�;_޳���3�����/N)��+��      V   E   x�3�H-*�,J������K��4�t��".#�\pjQJ"��1�L)��T�E&�Ә�*���� ֜�      X   y   x�3���O����J,OT��--�.-JLJ�L��ML�,��LI�I̍��/I�44 N#22�54�52V04�22�26�3�4�%�e��Z���4��I�ɘ��rJ�(�Ƅ��3%ٞ=... ��j�      Z   �   x��нn� ��"/`�1��H�u���Pת�D�ӷ����S�.����@;�q!��;a��3����E����R�$�n��5��0Ri %�MOM�+���<�
.�!��w�=���k���	&T�d��;�Z�[��+1�詟`I{
C�n��g�й�'�����m���Y˱B�u!��J��K�`�QM����׾K�m_�r�]�t�F?��!�oA%�/FI�     