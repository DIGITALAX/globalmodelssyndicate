import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { LOCALES } from "@/app/lib/constants";

const BASE_URL = "https://gms.globaldesignernetwork.com";

const readPublicFiles = (dirName: string, exts: string[]) => {
  try {
    const dirPath = path.join(process.cwd(), "public", dirName);
    const entries = fs.readdirSync(dirPath);
    return entries.filter((entry) =>
      exts.some((ext) => entry.toLowerCase().endsWith(ext))
    );
  } catch {
    return [];
  }
};

const withTrailingSlash: any = (url: string) => (url.endsWith("/") ? url : `${url}/`);

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/market", "/indie-models", "/account"];

  const images = readPublicFiles("images", [".png", ".jpg", ".jpeg", ".webp"]);
  const videos = readPublicFiles("videos", [".mp4", ".webm", ".mov"]);

  const imageUrls = images.map((name) => `${BASE_URL}/images/${name}`);

  const imageByBase = new Map(
    images.map((name) => [name.replace(/\.[^/.]+$/, ""), name])
  );

  const videoUrls: MetadataRoute.Sitemap[number]["videos"] = videos.map(
    (name) => {
      const base = name.replace(/\.[^/.]+$/, "");
      const title = base.replace(/-/g, " ");
      const thumbName = imageByBase.get(base) || "fondo.png";
      return {
        url: `${BASE_URL}/videos/${name}`,
        title,
        description: `Video: ${title}`,
        thumbnail_loc: `${BASE_URL}/images/${thumbName}`,
      };
    }
  );

  const entries: MetadataRoute.Sitemap = [];

  staticPaths.forEach((p) => {
    const url = withTrailingSlash(`${BASE_URL}${p}`);
      entries.push({
        url,
        lastModified: new Date(),
        images: p === "" ? imageUrls : undefined,
        videos: p === "" ? videoUrls : undefined,
      });
  });

  LOCALES.forEach((locale) => {
    staticPaths.forEach((p) => {
      const localePath = p ? `/${locale}${p}` : `/${locale}`;
      entries.push({
        url: withTrailingSlash(`${BASE_URL}${localePath}`),
        lastModified: new Date(),
      });
    });
  });

  return entries;
}
