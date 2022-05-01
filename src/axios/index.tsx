import axios from "axios";

export const customAxios = axios.create({
  baseURL: "https://www.ris.gov.tw/rs-opendata/api/v1/datastore/ODRP019/110",

  headers: {
    "Content-Type": "application/json",
  },
});
