import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Button,
  Flex,
  Image,
  Menu,
  Table,
  Text,
  Pagination,
  TextInput,
  Select,
  Tabs,
  rem,
  ActionIcon,
} from "@mantine/core";
import { formatCurrencyUZS } from "../../utils/helpers";
import ModalScreen from "../../components/modal";
import { Eye, Trash, PenIcon } from "../../components/icon";
import { IMAGE_URL } from "../../utils/constants";
import { postRequest } from "../../services/api";
import { toast } from "react-toastify";
import { useProductHistories } from "../../redux/selectors";
import { setProductHistories } from "../../redux/productHistoriesSlice";
import moment from "moment";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { IconClock } from "@tabler/icons-react";
import { setLoader } from "../../redux/loaderSlice";

export default function TableComponent({
  user,
  dispatch,
  data,
  categories,
  handleDelete,
  setEditForm,
}) {
  const [image, setImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [tabActive, setTabActive] = useState("product-list"); // State for selected product in select tab
  const historiesData = useProductHistories();
  const [ref1, ref2] = [useRef(null), useRef(null)];

  // Pagination states
  const [activePage, setActivePage] = useState(1);
  const [historiesPage, setHistoriesPage] = useState(1);
  const [isTodayData, setIsTodayData] = useState(false);
  const [value, setValue] = useState([
    new Date(
      new Date(
        new Date(new Date().setDate(new Date().getDate() - 7)).setHours(0)
      ).setMinutes(0)
    ),
    new Date(new Date(new Date().setHours(23)).setMinutes(59)),
  ]);
  const itemsPerPage = 10;

  // Calculate the data for the current page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const historiesStartIndex = (historiesPage - 1) * itemsPerPage;
  const historiesEndIndex = historiesStartIndex + itemsPerPage;

  // Filter data based on search query and selected category
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory ? item.category?.name === selectedCategory : true)
  );

  const histories = {
    products: historiesData?.products?.filter(
      (item) =>
        item?.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedCategory ? item.category_name === selectedCategory : true)
    ),
  };

  const currentData = filteredData?.slice(startIndex, endIndex);
  const currentHistories = histories?.products?.slice(
    historiesStartIndex,
    historiesEndIndex
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setActivePage(1); // Reset pagination when searching
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setActivePage(1); // Reset pagination when changing category
  };

  const handleProductChange = useCallback(
    (update, config) => {
      if (!update && historiesData?.products?.length) return;
      dispatch(setLoader(true));
      postRequest("order/history", config, user?.token)
        .then(({ data }) => {
          dispatch(setLoader(false));
          dispatch(setProductHistories(data?.result));
        })
        .catch((err) => {
          dispatch(setLoader(false));
          toast.error(JSON.stringify(err));
          console.log(err, "--order/history--");
        });
    },
    [user?.token, dispatch, historiesData?.products?.length]
  );

  useEffect(() => {
    if (historiesData?.products?.length) return;
    handleProductChange(true, {
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
  }, [handleProductChange, historiesData?.products?.length]);

  const rows = currentData?.map((element) => (
    <Table.Tr key={element?.id}>
      <Table.Td>{element?.name}</Table.Td>
      <Table.Td>{formatCurrencyUZS(element?.body_price)}</Table.Td>
      <Table.Td>{formatCurrencyUZS(element?.sell_price)}</Table.Td>
      <Table.Td>{element?.category?.name}</Table.Td>
      <Table.Td>{element?.printer_ip}</Table.Td>
      <Table.Td>
        {element?.is_infinite ? "Бесконечный" : element?.quantity}
      </Table.Td>
      <Table.Td onClick={() => setImage(IMAGE_URL + element?.image_path)}>
        <ModalScreen
          title={"Изображение продукта"}
          btn_title={
            <Flex align={"center"} gap={10}>
              <Eye /> <Text>Просмотр</Text>
            </Flex>
          }
          body={({ close }) => (
            <Image
              src={image}
              w={300}
              h={300}
              style={{
                objectFit: "contain",
                margin: "auto",
              }}
            />
          )}
        />
      </Table.Td>
      <Table.Td>{element?.disabled ? "Отключено" : "Не отключен"}</Table.Td>
      <Table.Td display={"flex"}>
        <Menu
          shadow="md"
          width={200}
          transitionProps={{ transition: "pop", duration: 150 }}
          position="left-start"
        >
          <Menu.Target>
            <Button color="red" display={"flex"} align={"center"}>
              <Trash fill="#fff" /> <Text pl={10}>Удалить</Text>
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Вы согласны удалить</Menu.Label>
            <Menu.Divider />
            <Menu.Item onClick={() => handleDelete(element?.id)} color="red">
              Да, я согласен
            </Menu.Item>
            <Menu.Item>Нет, позже</Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Button
          onClick={() => setEditForm(element)}
          mx={"md"}
          display={"flex"}
          align={"center"}
        >
          <PenIcon fill="#fff" /> <Text pl={10}>Обновление продукта</Text>
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Tabs value={tabActive} onChange={setTabActive}>
        <Tabs.List mb={"md"}>
          <Tabs.Tab value="product-list">Список продуктов</Tabs.Tab>
          <Tabs.Tab value="select-product">
            История выбранного продукта
          </Tabs.Tab>
        </Tabs.List>
        <Flex justify="space-between">
          <TextInput
            placeholder="Поиск..."
            value={searchQuery}
            onChange={handleSearch}
            style={{ marginBottom: 16, flex: 1, marginRight: 16 }}
          />
          <Select
            placeholder="Выберите категорию"
            value={selectedCategory}
            onChange={handleCategoryChange}
            data={categories.map((category) => ({
              value: category.name,
              label: category.name,
            }))}
            style={{ marginBottom: 16, flex: 1 }}
          />
        </Flex>
        <Tabs.Panel value="product-list">
          {/* Search input field */}

          {/* Your table component */}
          <Table
            my={"lg"}
            pt={"lg"}
            w={"100%"}
            striped
            highlightOnHover
            withTableBorder
            withColumnBorders
          >
            {/* Your table header */}
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Имя</Table.Th>
                <Table.Th>Стоимость</Table.Th>
                <Table.Th>Цена продажи</Table.Th>
                <Table.Th>Категория</Table.Th>
                <Table.Th>IP-адрес принтера</Table.Th>
                <Table.Th>Количество</Table.Th>
                <Table.Th>Изображение продукта</Table.Th>
                <Table.Th>Отключено</Table.Th>
                <Table.Th>Удалить / Обновить</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {currentData?.length ? (
                rows
              ) : (
                <Table.Tr>
                  <Table.Th ta="center" colSpan={9}>
                    Нет данных
                  </Table.Th>
                </Table.Tr>
              )}
            </Table.Tbody>
            {currentData?.length ? (
              <Table.Tfoot>
                <Table.Tr
                  style={{
                    borderTop: "var(--_tr-border-bottom, none)",
                  }}
                >
                  <Table.Th colSpan={9} ta="center">
                    Итого: {filteredData?.length} продуктов.
                  </Table.Th>
                </Table.Tr>
              </Table.Tfoot>
            ) : null}
          </Table>
          <Flex justify="center" mt="lg">
            {/* Pagination component */}
            <Pagination
              page={activePage}
              onChange={setActivePage}
              total={Math.ceil(filteredData?.length / itemsPerPage)}
            />
          </Flex>
        </Tabs.Panel>

        <Tabs.Panel value="select-product">
          <Flex align={"flex-end"} gap={"sm"}>
            <DatePickerInput
              required
              label="Sanasi bo'yicha"
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
                };
                handleProductChange(true, config);
              }}
              maxDate={new Date()}
              minDate={new Date().setMonth(new Date().getMonth() - 3)}
            />
            <Flex align={"center"} justify={"space-between"} gap={"md"}>
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
                  };

                  handleProductChange(true, config);
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
                  };

                  handleProductChange(true, config);
                }}
              />
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
                };
                handleProductChange(true, config);
              }}
            >
              Bugunlik hisobot
            </Button>
          </Flex>
          <Table
            my={"lg"}
            pt={"lg"}
            w={"100%"}
            striped
            highlightOnHover
            withTableBorder
            withColumnBorders
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Имя</Table.Th>
                <Table.Th>Цена продажи</Table.Th>
                <Table.Th>Категория</Table.Th>
                <Table.Th>Количество</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {currentHistories?.length ? (
                currentHistories.map((history) => (
                  <Table.Tr key={history?.id}>
                    <Table.Td>{history?.name}</Table.Td>
                    <Table.Td>
                      {formatCurrencyUZS(history?.sell_price)}
                    </Table.Td>
                    <Table.Td>{history?.category_name}</Table.Td>
                    <Table.Td>
                      {history?.quantity} {history?.measurement_name}
                    </Table.Td>
                  </Table.Tr>
                ))
              ) : (
                <Table.Tr>
                  <Table.Th ta="center" colSpan={4}>
                    Нет данных
                  </Table.Th>
                </Table.Tr>
              )}
            </Table.Tbody>
            <Table.Tfoot>
              <Table.Tr
                style={{
                  borderTop: "var(--_tr-border-bottom, none)",
                }}
              >
                <Table.Th ta="center">
                  Все клиенты: {historiesData?.all_client}
                </Table.Th>
                <Table.Th ta="center">
                  Все общее: {formatCurrencyUZS(historiesData?.all_total)}
                </Table.Th>
                <Table.Th ta="center">
                  Прибыль от клиентов:
                  {formatCurrencyUZS(historiesData?.profit_from_clients)}
                </Table.Th>
              </Table.Tr>
              <Table.Tr>
                <Table.Th ta="center">
                  Горячие цех:{" "}
                  {formatCurrencyUZS(
                    historiesData?.report_by_locations["Горячие цех"]
                  )}
                </Table.Th>
                <Table.Th ta="center">
                  Холодные цех:{" "}
                  {formatCurrencyUZS(
                    historiesData?.report_by_locations["Холодные цех"]
                  )}
                </Table.Th>
                <Table.Th ta="center">
                  Касса:{" "}
                  {formatCurrencyUZS(
                    historiesData?.report_by_locations["Касса"]
                  )}
                </Table.Th>
              
              </Table.Tr>
              <Table.Tr>
              <Table.Th ta="center">
                  Узбекиский кухня:{" "}
                  {formatCurrencyUZS(
                    historiesData?.report_by_locations["Узбекиский кухня"]
                  )}
                </Table.Th>
                <Table.Th ta="center">
                  Бар:{" "}
                  {formatCurrencyUZS(
                    historiesData?.report_by_locations["Бар"]
                  )}
                </Table.Th>
                <Table.Th ta="center">
                  Мангал:{" "}
                  {formatCurrencyUZS(
                    historiesData?.report_by_locations["Мангал"]
                  )}
                </Table.Th>
              </Table.Tr>
            </Table.Tfoot>
          </Table>
          <Flex justify="center" mt="lg">
            {/* Pagination component for histories */}
            <Pagination
              page={historiesPage}
              onChange={setHistoriesPage}
              total={Math.ceil(histories?.products?.length / itemsPerPage)}
            />
          </Flex>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
