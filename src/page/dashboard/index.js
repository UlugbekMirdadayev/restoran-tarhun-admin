import React, { useCallback, useEffect, useState } from "react";
import { Button, Flex, Select, Text, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import moment from "moment";
import { useDispatch } from "react-redux";
import TableComponent from "./table";
import { useReport, useUser, useWaiter } from "../../redux/selectors";
import { setLoader } from "../../redux/loaderSlice";
import { postRequest } from "../../services/api";
import { setReport } from "../../redux/reportSlice";
import { Reload } from "../../components/icon";

const Dashboard = () => {
  const user = useUser();
  const waiters = useWaiter();
  const dispatch = useDispatch();
  const [isTodayData, setIsTodayData] = useState(false);
  const [value, setValue] = useState([
    new Date(new Date().setDate(new Date().getDate() - 7)),
    new Date(),
  ]);
  const [isWaiter, setIsWaiter] = useState({
    id: "all",
    full_name: "",
  });
  const report = useReport();

  const getReport = useCallback(
    (update, config = {}) => {
      if (!update) return;
      dispatch(setLoader(true));
      postRequest("order/get", config, user?.token)
        .then(({ data }) => {
          dispatch(setLoader(false));
          dispatch(setReport(data?.result));
        })
        .catch((err) => {
          dispatch(setLoader(false));
          console.log(err);
        });
    },
    [user?.token, dispatch]
  );

  useEffect(() => {
    if (report?.length) return null;
    getReport(true, {
      from_date: moment(
        new Date(new Date().setDate(new Date().getDate() - 7))
      ).format("YYYY-MM-DD"),
      to_date: moment(new Date()).format("YYYY-MM-DD"),
    });
  }, [getReport, report?.length]);

  return (
    <div className="container-page">
      <div>
        <Flex justify={"space-between"} align={"center"}>
          <Title>Hisobotlar </Title>
          <Button onClick={() => getReport(true)}>
            <Flex align={"center"} gap={10}>
              <Reload fill="#fff" />
              <span>Ma'lumotlarni Yangilash</span>
            </Flex>
          </Button>
        </Flex>
        <Flex align={"flex-end"} gap={"lg"} my={"lg"}>
          <Select
            label="Ishchilar bo'yicha"
            data={[
              {
                value: "all",
                label: "Barchasi",
                disabled: isWaiter?.id === "all",
              },
              ...waiters?.map((item) => ({
                value: String(item.id),
                label: item?.full_name,
                disabled: isWaiter?.id === String(item?.id),
              })),
            ]}
            defaultValue={"all"}
            required
            onChange={(_value) => {
              setIsWaiter({
                id: _value,
                full_name: waiters?.find((item) => String(item?.id) === _value)
                  ?.full_name,
              });

              const config = {
                from_date: moment(value[0]).format("YYYY-MM-DD"),
                to_date: moment(value[1]).format("YYYY-MM-DD"),
                user_id: _value,
              };

              if (_value === "all") {
                delete config.user_id;
              }

              if (!value[0] || !value[1]) {
                delete config.from_date;
                delete config.to_date;
              }

              getReport(true, config);
            }}
          />
          <DatePickerInput
            required
            label="Sanasi bo'yicha"
            type="range"
            value={value}
            onChange={(date) => {
              setValue(date);
              setIsTodayData(false);
              if (!date[0] || !date[1]) {
                return null;
              }
              const config = {
                from_date: moment(date[0]).format("YYYY-MM-DD"),
                to_date: moment(date[1]).format("YYYY-MM-DD"),
                user_id: isWaiter?.id,
              };
              if (!isWaiter?.id || isWaiter?.id === "all") {
                delete config.user_id;
              }
              getReport(true, config);
            }}
            maxDate={new Date()}
            minDate={new Date().setMonth(new Date().getMonth() - 1)}
          />
          <Button
            onClick={() => {
              if (isTodayData) return null;
              setValue([new Date(), new Date()]);
              setIsTodayData(true);
              const config = {
                from_date: moment().format("YYYY-MM-DD"),
                to_date: moment().format("YYYY-MM-DD"),
                user_id: isWaiter?.id,
              };
              if (!isWaiter?.id || isWaiter?.id === "all") {
                delete config.user_id;
              }
              getReport(true, config);
            }}
          >
            Bugunlik hisobot
          </Button>
        </Flex>
      </div>
      <Text fw={600} fz={"lg"}>
        {isWaiter?.full_name
          ? isWaiter?.full_name + " ishchisiga"
          : "Barcha ishchilar bo'yicha"}
      </Text>
      <Text fw={600} fz={"lg"}>
        {isTodayData
          ? "Bugungi 24 soatlik hisobot"
          : value.filter(Boolean).length === 2
          ? value.map(
              (d, i) =>
                moment(d).format("DD-MM-YYYY") + (i ? " gacha" : " dan ")
            )
          : null}
      </Text>

      <TableComponent
        data={report}
        user={user}
        setLoader={(boolean) => dispatch(setLoader(boolean))}
      />
    </div>
  );
};

export default Dashboard;
