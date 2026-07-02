interface Props {
  title: string;
  videoId: string;
}

export function KickoffVideo({ title, videoId }: Props) {
  return (
    <div className="mb-12">
      <h3 className="mb-4 text-center text-lg font-semibold text-[#244260]">
        {title}
      </h3>

      <div className="relative overflow-hidden rounded-lg pt-[56.25%] shadow-lg">
        <iframe
          src={`https://player.vimeo.com/video/${videoId}`}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title}
        />
      </div>
    </div>
  );
}