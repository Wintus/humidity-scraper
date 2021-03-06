import got from "got";
import { JSDOM, VirtualConsole } from "jsdom";
import { zipObj, cond, T, test, always, over, lensProp, map } from "ramda";
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

export const fetchData = async () => {
  const response = await got(url);
  const virtualConsole = new VirtualConsole(); // noop; suppress warning
  const dom = await new JSDOM(response.body, { virtualConsole });

  const title = dom.window.document.querySelector(titleId)?.textContent;
  const table = dom.window.document.getElementById(domId);
  if (!table) {
    throw new Error(`Not Found: id=${domId}`);
  }

  return { title, table };
};

export const convertDom = (table: HTMLElement) => {
  const tr_list = table.getElementsByTagName("tr");
  const [fieldNames, fieldUnits, ...rest] = Array.from(tr_list).map(toRow);

  const units = zipObj(fieldNames, fieldUnits);
  const records = rest
    .map(map(convertValue))
    .map(zipObj(fieldNames))
    .map(convertDir);

  return { units, records };
};
