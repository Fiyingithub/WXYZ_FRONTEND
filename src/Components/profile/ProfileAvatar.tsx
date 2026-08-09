const getHue = (seed: string) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
};

interface ProfileAvatarProps {
  seed: string;
  size?: "md" | "lg";
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ seed, size = "lg" }) => {
  const dimensions = size === "lg" ? "w-20 h-20 text-2xl" : "w-10 h-10 text-sm";

  return (
    <div
      className={`${dimensions} rounded-full flex items-center justify-center text-white font-semibold shrink-0 ring-4 ring-white shadow-md`}
      style={{ backgroundColor: `hsl(${getHue(seed || "?")}, 65%, 55%)` }}
    >
      {(seed || "?").slice(0, 2).toUpperCase()}
    </div>
  );
};