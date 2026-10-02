import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { getVagasInfo } from "@/lib/vagas";
import ProductDetailClient from "./ProductDetailClient";
import Footer from "../../components/Footer";
import type { Produto, VagasInfo } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ id?: string }>;
}

async function getProdutoBySlug(slug: string, idParam?: string): Promise<Produto | null> {
  if (!isAdminConfigured()) {
    return null;
  }

  // 1. Se foi passado ID explícito via query param (?id=...)
  if (idParam && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idParam)) {
    const { data: byParamId } = await supabaseAdmin!
      .from("produtos")
      .select("*")
      .eq("id", idParam)
      .eq("ativo", true)
      .maybeSingle();

    if (byParamId) return byParamId;
  }

  // 2. Se o próprio slug da rota é um UUID de produto (ex: /produtos/e1928374-...)
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

  if (isUuid) {
    const { data: byId } = await supabaseAdmin!
      .from("produtos")
      .select("*")
      .eq("id", slug)
      .eq("ativo", true)
      .maybeSingle();

    if (byId) return byId;
  }

  // 3. Busca por slug
  const { data: bySlug } = await supabaseAdmin!
    .from("produtos")
    .select("*")
    .eq("slug", slug)
    .eq("ativo", true)
    .order("ordem", { ascending: true })
    .limit(1)
    .maybeSingle();

  return bySlug || null;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { id: idParam } = (await searchParams) || {};
  const produto = await getProdutoBySlug(slug, idParam);

  if (!produto) {
    return {
      title: "Produto não encontrado — INstituto Kalapa",
      description: "A vivência procurada não foi encontrada.",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://instituto-kalapa.vercel.app";
  const pageUrl = `${siteUrl}/produtos/${produto.id}`;
  const title = `${produto.nome} — INstituto Kalapa`;
  const description =
    produto.descricao_curta ||
    produto.descricao?.slice(0, 160) ||
    "Vivência terapêutica em grupo no INstituto Kalapa. Acolhimento e transformação.";
  const imageUrl = produto.imagem_url || `${siteUrl}/logo-kalapa.png`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      type: "website",
      locale: "pt_BR",
      siteName: "INstituto Kalapa",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: produto.nome,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProdutoDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { id: idParam } = (await searchParams) || {};
  const produto = await getProdutoBySlug(slug, idParam);

  if (!produto) {
    // Se o slug for o nome de uma categoria ou termo genérico, redireciona para a listagem correspondente
    if (slug === "vivencias" || slug === "vivencia" || slug === "atendimentos" || slug === "atendimento" || slug === "calendario") {
      const cat = slug === "vivencia" ? "vivencias" : slug === "atendimento" ? "atendimentos" : slug;
      redirect(`/produtos?categoria=${cat}`);
    }
    notFound();
  }

  let vagasInfo: VagasInfo | null = null;
  if (produto.vagas_maximas != null) {
    try {
      vagasInfo = await getVagasInfo(produto.id);
    } catch {
      // ignore
    }
  }

  return (
    <main className="min-h-screen bg-brand-offwhite pt-20">
      <ProductDetailClient produto={produto} vagas={vagasInfo} />
      <Footer />
    </main>
  );
}
