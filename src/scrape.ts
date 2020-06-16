import { JSDOM } from "jsdom";
import { zipObj, cond, T, test, always, over, lensProp } from "ramda";
import { dirAngle } from "./direction";

const url = "https://www.jma.go.jp/jp/amedas_h/today-44132.html";
const titleId = "#tbl_title > tbody > tr:nth-child(2) > td";
const domId = "tbl_list";
const dirField = "風向";

const toRow = (elem: HTMLElement): string[] =>
  Array.from(elem.getElementsByTagName("td")).map(
    (node) => node.textContent ?? ""
  );

const convertValue: (_: string) => string | number | null = cond([
  [test(/^\s+$/), always(null)],
  [test(/^\d+/), Number.parseFloat],
  [T, (str: string) => str],
]);

// { 風向: Dir } => { 風向: number }
const convertDir = over(lensProp(dirField), dirAngle);

const fetchData = async () => {
  const dom = await JSDOM.fromURL(url);

  const title = dom.window.document.querySelector(titleId);
  const table = dom.window.document.getElementById(domId);
  if (!table) {
    throw new Error(`Not Found: id=${domId}`);
  }

  return { title, table };
};

const convertDom = (table: HTMLElement) => {
  const tr_list = table.getElementsByTagName("tr");
  const [fieldNames, fieldUnits, ...rest] = Array.from(tr_list).map(toRow);

  const units = zipObj(fieldNames, fieldUnits);
  const records = rest
    .map((row) => row.map(convertValue))
    .map(zipObj(fieldNames))
    .map(convertDir);

  return { units, records };
};

(async () => {
  const { title, table } = await fetchData();
  console.log(title?.textContent);

  const result = convertDom(table);
  console.log(result);
})();
