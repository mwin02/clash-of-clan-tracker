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

  let memberList = warData.clan.members;
  memberList.sort((a: any, b: any) => a.mapPosition - b.mapPosition);

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
            <th></th>
            <th>Name</th>
            <th>Town Hall</th>
            <th>Attacks</th>
            <th>Stars Obtained</th>
            <th>Attack 1</th>
            <th>Attack 2</th>
          </tr>
        </thead>
        <tbody>
          {memberList.map((member: any, index: number) => {
            let attackInfo;
            let attackNumber = 0;
            let starCount = 0;
            if (member.attacks) {
              attackNumber = member.attacks.length;
              attackInfo = member.attacks.map((attack: any, index: number) => {
                starCount += attack.stars;
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
                <td>{index + 1}</td>
                <td>{member.name}</td>
                <td>TH {member.townhallLevel}</td>
                <td>{`${attackNumber}/2`}</td>
                <td>{`${starCount}/6`}</td>
                {attackInfo}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
