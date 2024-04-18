import Image from "next/image";

async function getData(clanTag: string) {
  try {
    const res = await fetch(
      `https://api.clashofclans.com/v1/clans/${clanTag}`,
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

export default async function ClanSummary({
  clanTag,
}: Readonly<{
  clanTag: string;
}>) {
  const clanData = await getData(clanTag);
  let clanMemberList = clanData.memberList;
  clanMemberList.sort((a: any, b: any) => b.trophies - a.trophies);
  return (
    <section>
      <h2>
        <Image
          src={clanData.badgeUrls.medium}
          width={50}
          height={50}
          alt="Clan Logo"
        />
        {clanData.name}
      </h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Trophies</th>
            <th>Donations Sent</th>
            <th>Donations Received</th>
          </tr>
        </thead>
        <tbody>
          {clanData.memberList.map((member: any) => {
            return (
              <tr key={member.tag}>
                <td>{member.name}</td>
                <td>{member.role}</td>
                <td>{member.trophies}</td>
                <td>{member.donations}</td>
                <td>{member.donationsReceived}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
