/**
 * Project credit team shown in the site footer.
 * To add a photo: place the file in `src/assets/team/` using the `photoKey`
 * (e.g. `shafqat-rashid.jpg`) — JPEG/PNG/WebP. No other fields needed.
 */

const teamPhotos = import.meta.glob<string>("../assets/team/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});

export type ProjectTeamMember = {
  id: string;
  name: string;
  role: string;
  /** Filename stem under src/assets/team/ (without extension) */
  photoKey: string;
  initials: string;
};

export const PROJECT_TEAM: ProjectTeamMember[] = [
  {
    id: "trainer",
    name: "Sajid Mir",
    role: "Web Development Trainer",
    photoKey: "sajid-mir",
    initials: "SM",
  },
  {
    id: "developer",
    name: "Shafqat Rashid",
    role: "Developer",
    photoKey: "shafqat-rashid",
    initials: "SR",
  },
];

export function resolveTeamPhoto(photoKey: string): string | null {
  const match = Object.entries(teamPhotos).find(([path]) => {
    const file = path.split(/[/\\]/).pop() ?? "";
    return file.replace(/\.(jpe?g|png|webp)$/i, "") === photoKey;
  });
  return match?.[1] ?? null;
}
