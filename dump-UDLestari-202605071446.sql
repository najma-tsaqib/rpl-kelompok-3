--
-- PostgreSQL database dump
--

\restrict BJeYec8qc2xlTdEZdtfC8FibwRBrd4J9PVk2Zv2ZKDpP8DHM8fhfzidoEthW5ts

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2026-05-07 14:46:58

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 5086 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 21578)
-- Name: admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin (
    id_admin integer NOT NULL,
    username character varying(50) NOT NULL,
    password text NOT NULL
);


ALTER TABLE public.admin OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 21577)
-- Name: admin_id_admin_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_id_admin_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_id_admin_seq OWNER TO postgres;

--
-- TOC entry 5087 (class 0 OID 0)
-- Dependencies: 220
-- Name: admin_id_admin_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_id_admin_seq OWNED BY public.admin.id_admin;


--
-- TOC entry 227 (class 1259 OID 21631)
-- Name: detail_pesanan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detail_pesanan (
    id_detail integer NOT NULL,
    id_pesanan integer,
    id_produk integer,
    jumlah integer NOT NULL,
    subtotal integer
);


ALTER TABLE public.detail_pesanan OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 21630)
-- Name: detail_pesanan_id_detail_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detail_pesanan_id_detail_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detail_pesanan_id_detail_seq OWNER TO postgres;

--
-- TOC entry 5088 (class 0 OID 0)
-- Dependencies: 226
-- Name: detail_pesanan_id_detail_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detail_pesanan_id_detail_seq OWNED BY public.detail_pesanan.id_detail;


--
-- TOC entry 229 (class 1259 OID 21650)
-- Name: pembayaran; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pembayaran (
    id_pembayaran integer NOT NULL,
    id_pesanan integer,
    metode_pembayaran character varying(20),
    bukti_transfer text,
    status_pembayaran character varying(50)
);


ALTER TABLE public.pembayaran OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 21649)
-- Name: pembayaran_id_pembayaran_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pembayaran_id_pembayaran_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pembayaran_id_pembayaran_seq OWNER TO postgres;

--
-- TOC entry 5089 (class 0 OID 0)
-- Dependencies: 228
-- Name: pembayaran_id_pembayaran_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pembayaran_id_pembayaran_seq OWNED BY public.pembayaran.id_pembayaran;


--
-- TOC entry 223 (class 1259 OID 21592)
-- Name: pesanan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pesanan (
    id_pesanan integer NOT NULL,
    id_customer integer,
    tanggal_pesanan timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status_pesanan character varying(50),
    total_harga integer
);


ALTER TABLE public.pesanan OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 21591)
-- Name: pesanan_id_pesanan_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pesanan_id_pesanan_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pesanan_id_pesanan_seq OWNER TO postgres;

--
-- TOC entry 5090 (class 0 OID 0)
-- Dependencies: 222
-- Name: pesanan_id_pesanan_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pesanan_id_pesanan_seq OWNED BY public.pesanan.id_pesanan;


--
-- TOC entry 225 (class 1259 OID 21620)
-- Name: produk; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produk (
    id_produk integer NOT NULL,
    nama_produk character varying(100) NOT NULL,
    harga integer NOT NULL,
    stok integer NOT NULL
);


ALTER TABLE public.produk OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 21619)
-- Name: produk_id_produk_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.produk_id_produk_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.produk_id_produk_seq OWNER TO postgres;

--
-- TOC entry 5091 (class 0 OID 0)
-- Dependencies: 224
-- Name: produk_id_produk_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.produk_id_produk_seq OWNED BY public.produk.id_produk;


--
-- TOC entry 4901 (class 2604 OID 21581)
-- Name: admin id_admin; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin ALTER COLUMN id_admin SET DEFAULT nextval('public.admin_id_admin_seq'::regclass);


--
-- TOC entry 4905 (class 2604 OID 21634)
-- Name: detail_pesanan id_detail; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detail_pesanan ALTER COLUMN id_detail SET DEFAULT nextval('public.detail_pesanan_id_detail_seq'::regclass);


--
-- TOC entry 4906 (class 2604 OID 21653)
-- Name: pembayaran id_pembayaran; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pembayaran ALTER COLUMN id_pembayaran SET DEFAULT nextval('public.pembayaran_id_pembayaran_seq'::regclass);


--
-- TOC entry 4902 (class 2604 OID 21595)
-- Name: pesanan id_pesanan; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pesanan ALTER COLUMN id_pesanan SET DEFAULT nextval('public.pesanan_id_pesanan_seq'::regclass);


--
-- TOC entry 4904 (class 2604 OID 21623)
-- Name: produk id_produk; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produk ALTER COLUMN id_produk SET DEFAULT nextval('public.produk_id_produk_seq'::regclass);


--
-- TOC entry 5072 (class 0 OID 21578)
-- Dependencies: 221
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin (id_admin, username, password) FROM stdin;
1	admin	admin123
\.


--
-- TOC entry 5078 (class 0 OID 21631)
-- Dependencies: 227
-- Data for Name: detail_pesanan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detail_pesanan (id_detail, id_pesanan, id_produk, jumlah, subtotal) FROM stdin;
\.


--
-- TOC entry 5080 (class 0 OID 21650)
-- Dependencies: 229
-- Data for Name: pembayaran; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pembayaran (id_pembayaran, id_pesanan, metode_pembayaran, bukti_transfer, status_pembayaran) FROM stdin;
\.


--
-- TOC entry 5074 (class 0 OID 21592)
-- Dependencies: 223
-- Data for Name: pesanan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pesanan (id_pesanan, id_customer, tanggal_pesanan, status_pesanan, total_harga) FROM stdin;
\.


--
-- TOC entry 5076 (class 0 OID 21620)
-- Dependencies: 225
-- Data for Name: produk; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.produk (id_produk, nama_produk, harga, stok) FROM stdin;
\.


--
-- TOC entry 5092 (class 0 OID 0)
-- Dependencies: 220
-- Name: admin_id_admin_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_id_admin_seq', 1, true);


--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 226
-- Name: detail_pesanan_id_detail_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detail_pesanan_id_detail_seq', 1, false);


--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 228
-- Name: pembayaran_id_pembayaran_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pembayaran_id_pembayaran_seq', 1, false);


--
-- TOC entry 5095 (class 0 OID 0)
-- Dependencies: 222
-- Name: pesanan_id_pesanan_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pesanan_id_pesanan_seq', 1, false);


--
-- TOC entry 5096 (class 0 OID 0)
-- Dependencies: 224
-- Name: produk_id_produk_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.produk_id_produk_seq', 1, false);


--
-- TOC entry 4908 (class 2606 OID 21588)
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id_admin);


--
-- TOC entry 4910 (class 2606 OID 21590)
-- Name: admin admin_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_username_key UNIQUE (username);


--
-- TOC entry 4916 (class 2606 OID 21638)
-- Name: detail_pesanan detail_pesanan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detail_pesanan
    ADD CONSTRAINT detail_pesanan_pkey PRIMARY KEY (id_detail);


--
-- TOC entry 4918 (class 2606 OID 21660)
-- Name: pembayaran pembayaran_id_pesanan_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pembayaran
    ADD CONSTRAINT pembayaran_id_pesanan_key UNIQUE (id_pesanan);


--
-- TOC entry 4920 (class 2606 OID 21658)
-- Name: pembayaran pembayaran_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pembayaran
    ADD CONSTRAINT pembayaran_pkey PRIMARY KEY (id_pembayaran);


--
-- TOC entry 4912 (class 2606 OID 21599)
-- Name: pesanan pesanan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pesanan
    ADD CONSTRAINT pesanan_pkey PRIMARY KEY (id_pesanan);


--
-- TOC entry 4914 (class 2606 OID 21629)
-- Name: produk produk_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produk
    ADD CONSTRAINT produk_pkey PRIMARY KEY (id_produk);


--
-- TOC entry 4921 (class 2606 OID 21639)
-- Name: detail_pesanan detail_pesanan_id_pesanan_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detail_pesanan
    ADD CONSTRAINT detail_pesanan_id_pesanan_fkey FOREIGN KEY (id_pesanan) REFERENCES public.pesanan(id_pesanan) ON DELETE CASCADE;


--
-- TOC entry 4922 (class 2606 OID 21644)
-- Name: detail_pesanan detail_pesanan_id_produk_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detail_pesanan
    ADD CONSTRAINT detail_pesanan_id_produk_fkey FOREIGN KEY (id_produk) REFERENCES public.produk(id_produk);


--
-- TOC entry 4923 (class 2606 OID 21661)
-- Name: pembayaran pembayaran_id_pesanan_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pembayaran
    ADD CONSTRAINT pembayaran_id_pesanan_fkey FOREIGN KEY (id_pesanan) REFERENCES public.pesanan(id_pesanan) ON DELETE CASCADE;


-- Completed on 2026-05-07 14:46:58

--
-- PostgreSQL database dump complete
--

\unrestrict BJeYec8qc2xlTdEZdtfC8FibwRBrd4J9PVk2Zv2ZKDpP8DHM8fhfzidoEthW5ts

