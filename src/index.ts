import { convertDom, fetchData } from "./scrape";

const main = async () => {
  const { title, table } = await fetchData();
  const data = convertDom(table);
  return { title, data };
};

main().then(({ title, data }) => {
  console.info(title);
  console.info(data);
});
