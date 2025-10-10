import { Invite } from "../App";

export interface Params {
    invite: Invite;
}

export default function LocationSection({ invite }: Params) {
    return (
        <section
            id="location"
            className="bg-bark text-olivewood py-16 px-4 flex flex-col items-center"
        >
            <div className="max-w-4xl text-center">
                <h2 className="text-3xl md:text-4xl text-olivewood mb-4 flex justify-center items-center gap-2">

                    Местоположение
                </h2>
                <p className="text-lg text-sand mb-8">
                    Церемонията и празненството ще се проведат в{" "}
                    <span className="font-medium text-sand">
                        {invite.location.text}
                    </span>
                    .
                </p>

                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-sand">
                    <iframe
                        title="Местоположение на сватбата"
                        width="100%"
                        height="100%"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps/embed/v1/place?key=${invite.mapsApiKey}&q=place_id:${invite.location.mapsPlaceId}`}>
                    </iframe>
                </div>
            </div>
        </section>
    );
};