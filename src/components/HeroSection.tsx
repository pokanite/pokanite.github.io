import { Invite } from "../App";

export interface HeroSectionParams {
  invite: Invite;
}

export function HeroSection({ invite }: HeroSectionParams) {
  return (
    <section
      id="home"
      className="
        min-h-screen w-full
        bg-center bg-no-repeat bg-cover
        bg-[url('../assets/mobile.png')]
        md:bg-[url('../assets/desktop.png')]
      "
    >
    </section>
  );
}
