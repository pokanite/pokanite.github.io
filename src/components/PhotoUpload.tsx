import { useState } from "react";

export default function PhotoUploadSection() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => setFiles(Array.from(e.target.files));

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setMessage("");

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

      const response = await fetch("YOUR_WEB_APP_URL_HERE", {
        method: "POST",
        body: JSON.stringify({ files: fileData }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (data.success) {
        setMessage("Снимките са качени успешно!");
        setFiles([]);
      } else {
        setMessage("Грешка при качването: " + data.error);
      }
    } catch (err) {
      setMessage("Грешка при качването: " + err.message);
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

        <div className="mt-6 bg-wedding-white/90 backdrop-blur-sm border border-sand/50 rounded-2xl shadow-md p-6 mx-auto space-y-3">
          <input
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

          {message && <p className="text-bark text-sm">{message}</p>}

          <p className="text-sm text-sage">
            Може да видите снимките <a href="YOUR_GOOGLE_DRIVE_FOLDER_LINK" target="_blank" className="underline">тук</a>.
          </p>
        </div>
      </div>
    </section>
  );
}
