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
} from "@mantine/core";
import { formatCurrencyUZS } from "../../utils/helpers";
import ModalScreen from "../../components/modal";
import { Eye, Trash, PenIcon } from "../../components/icon";
import { IMAGE_URL } from "../../utils/constants";

export default function TableComponent({ data, handleDelete, setEditForm }) {
  const [image, setImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  // Pagination states
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;

  // Calculate the data for the current page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Filter data based on search query
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentData = filteredData?.slice(startIndex, endIndex);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setActivePage(1); // Reset pagination when searching
  };

  const rows = currentData?.map((element) => (
    <Table.Tr key={element?.id}>
      <Table.Td>{element?.name}</Table.Td>
      <Table.Td>{formatCurrencyUZS(element?.body_price)}</Table.Td>
      <Table.Td>{formatCurrencyUZS(element?.sell_price)}</Table.Td>
      <Table.Td>{element?.category?.name}</Table.Td>
      <Table.Td>{element?.printer_ip}</Table.Td>
      <Table.Td>
        {element?.is_infinite ? "Cheksiz" : element?.quantity}
      </Table.Td>
      <Table.Td onClick={() => setImage(IMAGE_URL + element?.image_path)}>
        <ModalScreen
          title={"Product rasmi"}
          btn_title={
            <Flex align={"center"} gap={10}>
              <Eye /> <Text>Rasmni Ko'rish</Text>
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
      <Table.Td display={"flex"}>
        <Menu
          shadow="md"
          width={200}
          transitionProps={{ transition: "pop", duration: 150 }}
          position="left-start"
        >
          <Menu.Target>
            <Button color="red" display={"flex"} align={"center"}>
              <Trash fill="#fff" /> <Text pl={10}>O'chirish</Text>
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>O'chirishga rozimisiz</Menu.Label>
            <Menu.Divider />
            <Menu.Item onClick={() => handleDelete(element?.id)} color="red">
              Ha, roziman
            </Menu.Item>
            <Menu.Item>Yo'q, keyinroq</Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Button
          onClick={() => setEditForm(element)}
          mx={"md"}
          display={"flex"}
          align={"center"}
        >
          <PenIcon fill="#fff" /> <Text pl={10}>Maxsulotni yangilash</Text>
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      {/* Search input field */}
      <TextInput
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearch}
        style={{ marginBottom: 16 }}
      />
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
            <Table.Th>Nomi</Table.Th>
            <Table.Th>Tan narxi</Table.Th>
            <Table.Th>Sotilish narxi</Table.Th>
            <Table.Th>Kategoriya</Table.Th>
            <Table.Th>Printer IP</Table.Th>
            <Table.Th>Sanog'i</Table.Th>
            <Table.Th>Rasm</Table.Th>
            <Table.Th>O'chirish / Yangilash</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {currentData?.length ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Th ta="center" colSpan={7}>
                Ma'lumot yo'q
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
              <Table.Th colSpan={7} ta="center">
                Jami: {filteredData?.length} ta maxsulot mavjud.
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
    </>
  );
}
