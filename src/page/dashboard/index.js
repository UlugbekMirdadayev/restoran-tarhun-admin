import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActionIcon,
  Button,
  Flex,
  Select,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import moment from "moment";
import { useDispatch } from "react-redux";
import TableComponent from "./table";
import { useReport, useUser, useWaiter } from "../../redux/selectors";
import { setLoader } from "../../redux/loaderSlice";
import { getRequest, postRequest } from "../../services/api";
import { setReport } from "../../redux/reportSlice";
import { Reload } from "../../components/icon";
import { IconClock } from "@tabler/icons-react";
import { setWaiters } from "../../redux/waiterSlice";
import { toast } from "react-toastify";

const Dashboard = () => {
  const user = useUser();
  const waiters = useWaiter();
  const dispatch = useDispatch();
  const [isTodayData, setIsTodayData] = useState(false);
  const [value, setValue] = useState([
    new Date(
      new Date(
        new Date(new Date().setDate(new Date().getDate() - 7)).setHours(0)
      ).setMinutes(0)
    ),
    new Date(new Date(new Date().setHours(23)).setMinutes(59)),
  ]);
  const [isWaiter, setIsWaiter] = useState({
    id: "all",
    full_name: "",
  });
  const report = useReport();
  const [ref1, ref2] = [useRef(null), useRef(null)];

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

  const handleGetWaiters = useCallback(
    (update) => {
      if (!update && waiters?.length) return;
      dispatch(setLoader(true));
      getRequest("user/get", user?.token)
        .then(({ data }) => {
          dispatch(setLoader(false));
          dispatch(
            setWaiters(data?.result?.filter((item) => item?.role !== 1))
          );
        })
        .catch((err) => {
          dispatch(setLoader(false));
          toast.error(err?.response?.data?.result || "Error");
        });
    },
    [dispatch, waiters?.length, user?.token]
  );

  useEffect(() => {
    handleGetWaiters();
  }, [handleGetWaiters]);

  useEffect(() => {
    if (report?.length) return null;
    getReport(true, {
      from_date: moment(
        new Date(
          new Date(
            new Date(new Date().setDate(new Date().getDate() - 7)).setHours(0)
          ).setMinutes(0)
        )
      ).format("YYYY-MM-DD HH:mm:ss"),
      to_date: moment(
        new Date(new Date(new Date().setHours(23)).setMinutes(59))
      ).format("YYYY-MM-DD HH:mm:ss"),
    });
  }, [getReport, report?.length]);

  return (
    <div className="container-page">
      <div>
        <Flex justify={"space-between"} align={"center"}>
          <Title>Отчеты </Title>
          <Button onClick={() => getReport(true)}>
            <Flex align={"center"} gap={10}>
              <Reload fill="#fff" />
              <span>Обновление Данных</span>
            </Flex>
          </Button>
        </Flex>
        <Flex align={"flex-end"} gap={"lg"} my={"lg"}>
          <Select
            label="Фильтр по официантам"
            data={[
              {
                value: "all",
                label: "Все",
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
                from_date: moment(value[0]).format("YYYY-MM-DD HH:mm:ss"),
                to_date: moment(value[1]).format("YYYY-MM-DD HH:mm:ss"),
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
          <Flex direction={"column"}>
            <DatePickerInput
              required
              label="По дате"
              type="range"
              value={value}
              onChange={(date) => {
                date = date?.filter(Boolean)?.length
                  ? date
                  : value?.filter(Boolean)?.length === 2
                  ? value
                  : [
                      new Date(new Date(value[0].setHours(0)).setMinutes(0)),
                      new Date(new Date(value[0].setHours(23)).setMinutes(59)),
                    ];

                setValue(date);
                setIsTodayData(false);
                if (!date[0] || !date[1]) {
                  return null;
                }

                const config = {
                  from_date: moment(date[0]).format("YYYY-MM-DD HH:mm:ss"),
                  to_date: moment(date[1]).format("YYYY-MM-DD HH:mm:ss"),
                  user_id: isWaiter?.id,
                };
                if (!isWaiter?.id || isWaiter?.id === "all") {
                  delete config.user_id;
                }
                getReport(true, config);
              }}
              maxDate={new Date()}
              minDate={new Date().setMonth(new Date().getMonth() - 3)}
            />
            <Flex align={"center"} justify={"space-between"} mt={"sm"}>
              <TimeInput
                ref={ref1}
                value={moment(value[0]).format("HH:mm")}
                onChange={(e) => {
                  const date = new Date(value[0]);
                  date.setHours(e.target.value?.split(":")[0]);
                  date.setMinutes(e.target.value?.split(":")[1]);
                  setValue([new Date(date), value[1]]);
                }}
                onBlur={(e) => {
                  const date = new Date(value[0]);
                  date.setHours(e.target.value?.split(":")[0]);
                  date.setMinutes(e.target.value?.split(":")[1]);

                  const config = {
                    from_date: moment(new Date(date)).format(
                      "YYYY-MM-DD HH:mm:ss"
                    ),
                    to_date: moment(value[1]).format("YYYY-MM-DD HH:mm:ss"),
                    user_id: isWaiter?.id,
                  };
                  if (!isWaiter?.id || isWaiter?.id === "all") {
                    delete config.user_id;
                  }
                  getReport(true, config);
                }}
                rightSection={
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={() => {
                      ref1.current?.showPicker();
                      ref1.current?.focus();
                    }}
                  >
                    <IconClock
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  </ActionIcon>
                }
              />
              <TimeInput
                ref={ref2}
                value={moment(value[1]).format("HH:mm")}
                rightSection={
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    onClick={() => {
                      ref2.current?.showPicker();
                      ref2.current?.focus();
                    }}
                  >
                    <IconClock
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  </ActionIcon>
                }
                onChange={(e) => {
                  const date = new Date(value[1]);
                  date.setHours(e.target.value?.split(":")[0]);
                  date.setMinutes(e.target.value?.split(":")[1]);
                  setValue([value[0], new Date(date)]);
                }}
                onBlur={(e) => {
                  const date = new Date(value[1]);
                  date.setHours(e.target.value?.split(":")[0]);
                  date.setMinutes(e.target.value?.split(":")[1]);

                  const config = {
                    from_date: moment(new Date(value[0])).format(
                      "YYYY-MM-DD HH:mm:ss"
                    ),
                    to_date: moment(new Date(date)).format(
                      "YYYY-MM-DD HH:mm:ss"
                    ),
                    user_id: isWaiter?.id,
                  };
                  if (!isWaiter?.id || isWaiter?.id === "all") {
                    delete config.user_id;
                  }
                  getReport(true, config);
                }}
              />
            </Flex>
          </Flex>
          <Button
            onClick={() => {
              if (isTodayData) return null;
              const dates = [new Date(), new Date()];
              setIsTodayData(true);
              dates[0].setHours("00");
              dates[0].setMinutes("00");
              dates[1].setHours("23");
              dates[1].setMinutes("59");
              setValue(dates);
              const config = {
                from_date: moment(dates[0]).format("YYYY-MM-DD HH:mm:ss"),
                to_date: moment(dates[1]).format("YYYY-MM-DD HH:mm:ss"),
                user_id: isWaiter?.id,
              };
              if (!isWaiter?.id || isWaiter?.id === "all") {
                delete config.user_id;
              }
              getReport(true, config);
            }}
          >
            Сегодняшний отчет
          </Button>
        </Flex>
      </div>
      <Text fw={600} fz={"lg"}>
        {isWaiter?.full_name
          ? isWaiter?.full_name + " официанту"
          : "По всем официантам"}
      </Text>
      <Text fw={600} fz={"lg"}>
        {isTodayData
          ? "Сегодняшний 24-часовой отчет"
          : value?.filter(Boolean)?.length === 2
          ? value?.map(
              (d, i) => (i ? " до " : "от ") + moment(d).format("DD-MM-YYYY")
            )
          : null}
      </Text>

      <TableComponent
        data={report}
        user={user}
        setLoader={(boolean) => dispatch(setLoader(boolean))}
        onUpdate={() => getReport(true)}
      />
    </div>
  );
};

export default Dashboard;
