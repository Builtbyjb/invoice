import { useState, useEffect } from "react";

type ImagePreviewProps = {
  source: string | Blob | null;
};

export default function ImagePreview({ source }: ImagePreviewProps) {
  const [url, setUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    let previewUrl = "";
    (() => {
      if (source === null) return;

      if (source instanceof Blob) {
        previewUrl = URL.createObjectURL(source);
        setUrl(previewUrl);
      } else {
        setUrl(source);
      }
    })();

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [source]);

  return (
    <div>
      <img src={url ? url : "/placeholder-image.png"} alt="Preview" className="rounded-2xl w-24" />
    </div>
  );
}
