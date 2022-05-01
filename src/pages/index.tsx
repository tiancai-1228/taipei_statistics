import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { customAxios } from "../axios/index";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryGroup } from "victory";
import styles from "../../styles/Home.module.css";
import taipeilogo from "../image/taipeilogo.png";

import Image from "next/image";

const Home = () => {
  const [data, setData] = useState<any>();
  const [city, setCity] = useState<any>();
  const [selsectValue, setSelsectValue] = useState<any>();
  const [household_ordinary, setHousehold_ordinary] = useState<any>({
    boy: 0,
    girl: 0,
  });
  const [household_single, sethousehold_single] = useState<any>({
    boy: 0,
    girl: 0,
  });

  async function fetchcity() {
    try {
      const taipeiData = await customAxios.get("", {
        params: { COUNTY: "臺北市" },
      });
      setCity(filterCiyt(taipeiData.data.responseData));
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchData(city: string) {
    try {
      const taipeiData = await customAxios.get("", {
        params: { COUNTY: "臺北市", TOWN: city },
      });
      setData(taipeiData.data.responseData);
    } catch (error) {
      console.log(error);
    }
  }

  const filterCiyt = (data: []) => {
    const city = new Set();
    data.forEach((el: { site_id: String }) => {
      city.has(el.site_id.slice(3)) ? false : city.add(el.site_id.slice(3));
    });
    return Array.from(city);
  };

  const setOption = () => {
    const option = city.map((el: any) => (
      <option value={el} key={el}>
        {el}
      </option>
    ));
    return option;
  };

  const boy = [
    { x: "共同生活", y: household_ordinary.boy, label: household_ordinary.boy },
    { x: "獨力生活", y: household_single.boy, label: household_single.boy },
  ];
  const girl = [
    {
      x: "共同生活",
      y: household_ordinary.girl,
      label: household_ordinary.girl,
    },
    { x: "獨力生活", y: household_single.girl, label: household_single.girl },
  ];

  useEffect(() => {
    fetchcity();
    fetchData("松山區");
  }, []);

  useEffect(() => {
    if (data) {
      const household_ordinary_m = data
        .map((el: { household_ordinary_m: String }) => el.household_ordinary_m)
        .reduce(
          (total: string, current: string) =>
            parseInt(total) + parseInt(current)
        );
      const household_ordinary_f = data
        .map((el: { household_ordinary_f: string }) => el.household_ordinary_f)
        .reduce(
          (total: string, current: string) =>
            parseInt(total) + parseInt(current)
        );
      const household_single_m = data
        .map((el: { household_single_m: string }) => el.household_single_m)
        .reduce(
          (total: string, current: string) =>
            parseInt(total) + parseInt(current)
        );
      const household_single_f = data
        .map((el: { household_single_f: string }) => el.household_single_f)
        .reduce(
          (total: string, current: string) =>
            parseInt(total) + parseInt(current)
        );

      setHousehold_ordinary({
        boy: household_ordinary_m,
        girl: household_ordinary_f,
      });

      sethousehold_single({
        boy: household_single_m,
        girl: household_single_f,
      });
    }
  }, [data]);

  return (
    <div className={styles.App}>
      <div className={styles.logo}>
        <div className={styles.img}>
          <Image src={taipeilogo} />
        </div>

        <h1 className={styles.h1}> 110戶數、人口數按戶別及性別</h1>
      </div>
      <div className={styles.select_m}>
        <label className={styles.label}>地區:</label>
        <select
          value={selsectValue}
          onChange={(val) => {
            setSelsectValue(val.target.value);
            fetchData(val.target.value);
          }}
        >
          {city && setOption()}
        </select>
      </div>
      <div className={styles.content}>
        <div className={styles.select_d}>
          <label>地區:</label>
          <select
            value={selsectValue}
            onChange={(val) => {
              setSelsectValue(val.target.value);
              fetchData(val.target.value);
            }}
          >
            {city && setOption()}
          </select>
        </div>

        <div className={styles.barChart}>
          <VictoryChart
            domainPadding={{ x: 80 }}
            padding={{ left: 80, top: 80, bottom: 30 }}
          >
            <VictoryAxis />
            <VictoryAxis dependentAxis />
            <VictoryGroup offset={50} colorScale={"qualitative"}>
              <VictoryBar
                data={boy}
                style={{
                  data: {
                    fill: "blue",
                  },
                }}
              />
              <VictoryBar
                data={girl}
                style={{
                  data: {
                    fill: "pink",
                  },
                }}
              />
            </VictoryGroup>
          </VictoryChart>
          <div className={styles.sex}>
            <div className={styles.sex}>
              <div className={styles.boyBox} />男
            </div>
            <div className={styles.sex}>
              <div className={styles.girlBox} />女
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
