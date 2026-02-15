"use client";

import DynamicAdsProvider from "./dynamicAdsProvider";



export function HeaderAds() {
  return <DynamicAdsProvider position="homepage_full_1" className="px-4 max-w-7xl mx-auto py-4" />;
}

export function SidebarAds() {
 
  return <DynamicAdsProvider position="homepage_sidebar_1" className="space-y-4" />;
}

export function FooterAds() {
  return <DynamicAdsProvider position="homepage_full_4" className="px-4 max-w-7xl mx-auto py-6" />;
}

export function PostSidebarAds() {
  return <DynamicAdsProvider position="post_sidebar_1" />;
}

export function PostFullAds() {
  return <DynamicAdsProvider position="post_full_1" className="my-6" />;
}

export function AdPageCenter() {
  return <DynamicAdsProvider position="advertisement" className="flex justify-center" />;
}