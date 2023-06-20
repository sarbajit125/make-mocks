import ResponsiveAppBar, { NavItemsList } from "../components/navbar";
import DomainGrid from "../components/DomainGrid";
import prisma from "../lib/prisma";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { DomainDTO } from "../DTO/components";
export default function Home({list}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const navItems: NavItemsList[] = [
    { name: "About", navlink: "/about", isExternal: false },
  ];
  return (
    <div>
      <ResponsiveAppBar items={navItems} />
      <DomainGrid list={list} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<{
  list: DomainDTO[]
}> = async () => {
  const response = await prisma.domains.findMany();
  const list: DomainDTO[] = response.map((item) => ({
    desc: item.desc ?? "",
    name: item.name,
    id: item.id,
  }));
  return { props: { list } };
}