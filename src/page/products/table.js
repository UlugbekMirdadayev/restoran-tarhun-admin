import React, { useState } from "react";
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
} from "@mantine/core";
import { formatCurrencyUZS } from "../../utils/helpers";
import ModalScreen from "../../components/modal";
import { Eye, Trash, PenIcon } from "../../components/icon";
import { IMAGE_URL } from "../../utils/constants";
import { IconChartHistogram } from "@tabler/icons-react";

export default function TableComponent({
  data,
  categories,
  handleDelete,
  setEditForm,
}) {
  const [image, setImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const [selectedProduct, setSelectedProduct] = useState(null); // State for selected product in select tab
  const [tabActive, setTabActive] = useState("product-list"); // State for selected product in select tab

  // Pagination states
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;

  // Calculate the data for the current page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Filter data based on search query and selected category
  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory ? item.category?.name === selectedCategory : true)
  );

  const currentData = filteredData?.slice(startIndex, endIndex);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setActivePage(1); // Reset pagination when searching
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setActivePage(1); // Reset pagination when changing category
  };

  const handleProductChange = (value) => {
    const product = data.find((item) => item.id === +value);
    setSelectedProduct(product);
  };

  const rows = currentData?.map((element) => (
    <Table.Tr key={element?.id}>
      <Table.Td
        onClick={() => {
          setTabActive("select-product");
          setSelectedProduct(element);
        }}
      >
        <Button>
          <IconChartHistogram />
        </Button>
      </Table.Td>
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

        <Tabs.Panel value="product-list">
          {/* Search input field */}
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
                <Table.Th>История</Table.Th>
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
          <Select
            placeholder="Выберите продукт"
            value={selectedProduct?.id || ""}
            onChange={handleProductChange}
            data={data.map((product) => ({
              value: String(product.id),
              label: product.name,
            }))}
            style={{ marginBottom: 16 }}
          />
          {selectedProduct && (
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
                  <Table.Th>Стоимость</Table.Th>
                  <Table.Th>Цена продажи</Table.Th>
                  <Table.Th>Категория</Table.Th>
                  <Table.Th>IP-адрес принтера</Table.Th>
                  <Table.Th>Количество</Table.Th>
                  <Table.Th>Изображение продукта</Table.Th>
                  <Table.Th>Отключено</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Td>{selectedProduct.name}</Table.Td>
                  <Table.Td>
                    {formatCurrencyUZS(selectedProduct.body_price)}
                  </Table.Td>
                  <Table.Td>
                    {formatCurrencyUZS(selectedProduct.sell_price)}
                  </Table.Td>
                  <Table.Td>{selectedProduct.category?.name}</Table.Td>
                  <Table.Td>{selectedProduct.printer_ip}</Table.Td>
                  <Table.Td>
                    {selectedProduct.is_infinite
                      ? "Бесконечный"
                      : selectedProduct.quantity}
                  </Table.Td>
                  <Table.Td
                    onClick={() =>
                      setImage(IMAGE_URL + selectedProduct.image_path)
                    }
                  >
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
                  <Table.Td>
                    {selectedProduct.disabled ? "Отключено" : "Не отключен"}
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          )}
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
