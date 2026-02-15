import { Metadata } from "next";
import { contentService } from "@/services/contentServices";
import BlogDetailClient from "./BlogDetailClient";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = await params;
  const res = await contentService.getPosts();
  const allPosts = Array.isArray(res) ? res : res?.data?.data || [];
  const post = allPosts.find((p: any) => p.slug === slug);

  if (!post) return { title: "Edify Nepal" };

  const plainDescription = post.description?.replace(/<[^>]*>?/gm, "").slice(0, 160);
  const fullImageUrl = post.photo?.startsWith("http") ? post.photo : `https://edifynepal.com${post.photo}`;

  return {
    title: post.title,
    description: plainDescription,
    openGraph: {
      title: post.title,
      description: plainDescription,
      url: `https://edifynepal.com/blog/${slug}`,
      images: [{ url: fullImageUrl || "/default-share-image.jpg" }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: plainDescription,
      images: [fullImageUrl || "/default-share-image.jpg"],
    },
  };
}

export default async function Page({ params }: any) {
  const { slug } = await params;
  let initialPost = null;

  try {
    const res = await contentService.getPosts();
    const allPosts = Array.isArray(res) ? res : res?.data?.data || [];
    const foundPost = allPosts.find((p: any) => p.slug === slug);
    if (foundPost) {
      initialPost = await contentService.getPostById(foundPost.id);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }

  return <BlogDetailClient slug={slug} initialPost={initialPost} />;
}