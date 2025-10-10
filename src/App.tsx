import { useEffect, useMemo, useState } from "react";
import { HeroSection } from "./components/HeroSection";
import { RSVPForm } from "./components/RSVPForm";
import { PuffLoader } from 'react-spinners';
import { Toaster } from "./components/ui/sonner";
import WeddingTimeline from "./components/Timeline";
import PhotoUpload from "./components/PhotoUpload";
import LocationSection from "./components/LocationSection";
import WishesSection from "./components/WishesSection";

export interface Invite {
  name1: string;
  name2: string;

  answerUntilTimestamp: number;
  startTimeTimestamp: number;

  location: {
    city: string;
    text: string;
    mapsPlaceId: string;
  };

  mapsApiKey: string;
  photoAlbumLink: string;

  googleScriptRSVP: string;
  googleScriptUpload: string;
}

export function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [invite, setInvite] = useState<Invite | undefined>(undefined);

  const inviteId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("inviteId");
  }, [window.location.search]);

  const key = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("key");
  }, [window.location.search]);

  useEffect(() => {
    fetch(`https://${inviteId}.lambda-url.eu-central-1.on.aws?key=${key}`)
      .then(async (response) => {
        if (response.ok) {
          const data = (await response.json()) as Invite;
          setInvite(data)
        }
      }).catch(() => { })
      .finally(() => {
        setLoading(false);
      })
  }, [inviteId])

  if (loading) {
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-sand">
        <div className="relative z-10">
          <PuffLoader
            color="#2d2f22"
            loading={loading}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen bg-sand text-center px-6">
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Нещо се обърка
          </h1>
          <p className="text-gray-600 mb-4">
            Възникна грешка при зареждане на Вашата покана.
            Моля, проверете дали линкът е правилен или опитайте отново.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 rounded-xl bg-olivewood text-white font-medium hover:bg-olivewood/90 transition"
          >
            Презареди
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <HeroSection invite={invite} />
      <WeddingTimeline />
      <LocationSection invite={invite} />
      <WishesSection />
      <PhotoUpload api_key={key} invite={invite} />
      <RSVPForm api_key={key} invite={invite} />

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--wedding-white)',
            color: 'var(--olivewood)',
            border: '1px solid var(--sand)',
          },
        }}
      />
    </div>
  );
}