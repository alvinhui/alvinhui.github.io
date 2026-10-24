import { getImage } from 'astro:assets';
import { parseDateFromId } from './utils';

/** List / album-page display width (CSS ~full content column; 2x for retina). */
export const PHOTO_THUMB_WIDTH = 1200;

export interface Album {
  folder: string;
  name: string;
  date: Date;
  cover: ImageMetadata;
  count: number;
}

export interface AlbumCoverThumb {
  src: string;
  width: number;
  height: number;
}

export function getAlbums(): Album[] {
  const imageFiles = import.meta.glob<{ default: ImageMetadata }>(
    '/src/content/image/**/*.{jpg,jpeg,png,gif,webp}',
    { eager: true }
  );

  const albumMap = new Map<string, Album>();

  for (const [path, mod] of Object.entries(imageFiles)) {
    const parts = path.replace('/src/content/image/', '').split('/');
    if (parts.length < 2) continue;
    const folder = parts[0];

    if (!albumMap.has(folder)) {
      const dateMatch = folder.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
      const name = dateMatch ? dateMatch[2] : folder;
      const date = parseDateFromId(folder);
      albumMap.set(folder, { folder, name, date, cover: mod.default, count: 1 });
    } else {
      albumMap.get(folder)!.count++;
    }
  }

  return Array.from(albumMap.values()).sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
}

export function groupAlbumsByYear(albums: Album[]): Record<string, Album[]> {
  const albumsByYear: Record<string, Album[]> = {};
  for (const album of albums) {
    const year = album.date.getFullYear().toString();
    if (!albumsByYear[year]) albumsByYear[year] = [];
    albumsByYear[year].push(album);
  }
  return albumsByYear;
}

/** Build-time WebP thumbnail for list covers / album page grid (not full originals). */
export async function getPhotoThumb(
  image: ImageMetadata,
  width = PHOTO_THUMB_WIDTH
): Promise<AlbumCoverThumb> {
  const optimized = await getImage({
    src: image,
    width,
    format: 'webp',
    quality: 75,
  });

  return {
    src: optimized.src,
    width: Number(optimized.attributes.width ?? width),
    height: Number(
      optimized.attributes.height ?? Math.round(width * (image.height / image.width))
    ),
  };
}
