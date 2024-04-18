import Image from "next/image";
import { convertTime } from "../util/timeConvert";

async function getData(clanTag: string) {
  try {
    const res = await fetch(
      `https://api.clashofclans.com/v1/clans/${clanTag}/capitalraidseasons?limit=1`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      }
    );
    if (!res.ok) {
      console.log(res);
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (e) {
    console.log(e);
  }
}

export default async function ClanRaid({
  clanTag,
}: Readonly<{
  clanTag: string;
}>) {
  const raids = await getData(clanTag);
  const raidData = raids.items[0];
  const startTime = new Date(convertTime(raidData.startTime));
  const endTime = new Date(convertTime(raidData.endTime));
  return (
    <section>
      <h2>Current Raid State</h2>
      <p>Raid Status: {raidData.state}</p>
      <p>Start Time: {startTime.toString()}</p>
      <p>End Time: {endTime.toString()}</p>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Attacks</th>
            <th>CapitalResourcesLooted</th>
          </tr>
        </thead>
        <tbody>
          {raidData.members.map((member: any) => {
            return (
              <tr key={member.tag}>
                <td>{member.name}</td>
                <td>{member.attacks}/6</td>
                <td>{member.capitalResourcesLooted}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
