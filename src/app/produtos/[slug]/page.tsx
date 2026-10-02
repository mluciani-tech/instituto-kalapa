import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { supabaseAdmin, isAdminConfigured } from "@/lib/supabase";
import { getVagasInfo } from "@/lib/vagas";
import ProductDetailClient from "./ProductDetailClient";
import Footer from "../../components/Footer";
import type { Produto, VagasInfo } from "@/lib/types";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getProdutoBySlug(
  slug: string,
  idParam?: string
): Promise<{ produto: Produto | null; redirectCategoria?: string }> {
  if (!isAdminConfigured()) {
    return { produto: null };
  }

  // 1. Se foi passado ID explícito via query param (?id=...)
  if (idParam && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idParam)) {
    const { data: byParamId } = await supabaseAdmin!
      .from("produtos")
      .select("*")
      .eq("id", idParam)
      .eq("ativo", true)
      .maybeSingle();

    if (byParamId) return { produto: byParamId };
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

    if (byId) return { produto: byId };
  }

  // 3. Termos ou categorias genéricas sempre redirecionam para o catálogo
  const genericSlugs: Record<string, string> = {
    vivencia: "vivencias",
    vivencias: "vivencias",
    atendimento: "atendimentos",
    atendimentos: "atendimentos",
    calendario: "calendario",
    "terapia-adulto": "atendimentos",
  };
  const lowerSlug = slug.toLowerCase();
  if (genericSlugs[lowerSlug]) {
    return { produto: null, redirectCategoria: genericSlugs[lowerSlug] };
  }

  // 4. Busca todos os produtos ativos com este slug
  const { data: bySlugList } = await supabaseAdmin!
    .from("produtos")
    .select("*")
    .eq("slug", slug)
    .eq("ativo", true)
    .order("ordem", { ascending: true });

  if (bySlugList && bySlugList.length > 1) {
    // Se múltiplos produtos ativos compartilham o mesmo slug, redireciona para a listagem para mostrar todos
    return { produto: null, redirectCategoria: slug };
  }

  if (bySlugList && bySlugList.length === 1) {
    return { produto: bySlugList[0] };
  }

  return { produto: null };
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolvedSearchParams = (await searchParams) || {};
  const idParam = typeof resolvedSearchParams.id === "string" ? resolvedSearchParams.id : undefined;
  const { produto } = await getProdutoBySlug(slug, idParam);

  if (!produto) {
    return {
      title: "Produtos — INstituto Kalapa",
      description: "Conheça nossas vivências e atendimentos terapêuticos.",
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
  const resolvedSearchParams = (await searchParams) || {};
  const idParam = typeof resolvedSearchParams.id === "string" ? resolvedSearchParams.id : undefined;
  const { produto, redirectCategoria } = await getProdutoBySlug(slug, idParam);

  if (redirectCategoria) {
    redirect(`/produtos?categoria=${redirectCategoria}`);
  }

  if (!produto) {
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
