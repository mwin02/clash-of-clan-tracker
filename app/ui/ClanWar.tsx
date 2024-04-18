import Image from "next/image";
import { convertTime } from "../util/timeConvert";

async function getData(clanTag: string) {
  try {
    const res = await fetch(
      `https://api.clashofclans.com/v1/clans/${clanTag}/currentwar`,
      {
        method: "GET",
        // cache: "no-store",
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
        next: { revalidate: 60 },
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

export default async function ClanWar({
  clanTag,
}: Readonly<{
  clanTag: string;
}>) {
  const warData = await getData(clanTag);

  const startTime = new Date(convertTime(warData.startTime));
  const endTime = new Date(convertTime(warData.endTime));

  return (
    <>
      <h2>Current War State</h2>
      <p>
        War Status: {warData.state} War Size: {warData.teamSize}
      </p>
      <p>Start Time: {startTime.toString()}</p>
      <p>End Time: {endTime.toString()}</p>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Town Hall Level</th>
            <th>Attacks</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {warData.clan.members.map((member: any) => {
            let attackInfo;
            let attackNumber = 0;
            if (member.attacks) {
              attackNumber = member.attacks.length;
              attackInfo = member.attacks.map((attack: any, index: number) => {
                return (
                  <td key={`${attack.attackerTag}${index}`}>
                    Attack #{index + 1} : {attack.stars}/3{" "}
                    {attack.destructionPercentage}%
                  </td>
                );
              });
            }

            return (
              <tr key={member.tag}>
                <td>{member.name}</td>
                <td>TH {member.townhallLevel}</td>
                <td>{`${attackNumber}/2`}</td>
                {attackInfo}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
