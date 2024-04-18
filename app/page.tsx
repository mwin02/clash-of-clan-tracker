import Image from "next/image";
import ClanSummary from "./ui/ClanSummary";
import ClanWar from "./ui/ClanWar";
import ClanRaid from "./ui/ClanRaid";
export const revalidate = 300;

export default function Home() {
  return (
    <main>
      <h1>Clash of Clan </h1>
      <ClanSummary clanTag="%232GG9LCGOR" />
      <ClanWar clanTag="%232GG9LCGOR" />
      <ClanRaid clanTag="%232GG9LCGOR" />
    </main>
  );
}
