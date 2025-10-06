import { useState, useRef, ChangeEvent } from "react";
import { toast } from "sonner";

interface Props {
  api_key: string | null;
}

export default function PhotoUploadSection({ api_key }: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const fileToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setLoading(true);

    toast("Моля, изчакайте — качването може да отнеме време...", {
      icon: "⏳",
    });

    try {
      const fileData = await Promise.all(
        files.map(async (file) => {
          const base64 = await fileToBase64(file);
          return {
            name: file.name,
            type: file.type,
            content: base64.split(",")[1],
          };
        })
      );

      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbzDV5VONqU821MslSilc_y9zcE1o3vuiyuyg73L4rk9gFQN7FBQX37NVeLKmrRs5H4TiQ/exec?key=${api_key}`,
        {
          redirect: "follow",
          method: "POST",
          body: JSON.stringify({ files: fileData }),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Благодарим за вашето потвърждение! Снимките са качени успешно.");
        setFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // clears input
        }
      } else {
        toast.error("Възникна грешка при качването. Моля, опитайте отново.");
      }
    } catch (err: any) {
      console.error("Error uploading photos:", err);
      toast.error("Грешка при качването. Моля, опитайте отново.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="photos" className="w-full py-12 px-6 bg-sand">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h2 className="text-3xl md:text-4xl mb-4 text-olivewood">
          Споделете вашите снимки
        </h2>
        <p className="text-lg text-bark max-w-xl mx-auto">
          Ако сте заснели красиви моменти от сватбата, може да ги качите тук.
        </p>

        <div className="mt-6 bg-wedding-white/90 backdrop-blur-sm border-sand shadow-xl rounded-md p-6 mx-auto space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="border border-sand rounded-md p-2 w-full"
          />

          <button
            onClick={handleUpload}
            disabled={loading || files.length === 0}
            className="w-full bg-olivewood hover:bg-sage text-parchment h-10 rounded-md"
          >
            {loading ? "Качване..." : "Качи снимките"}
          </button>

          <p className="text-sm text-sage">
            Може да видите снимките{" "}
            <a
              href="https://drive.google.com/drive/folders/1ms48ZYTvu_Hcgx3CLct44U222Qbrhx_p?usp=sharing"
              target="_blank"
              className="underline"
            >
              тук
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
