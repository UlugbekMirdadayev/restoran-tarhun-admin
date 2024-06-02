import React, { useState } from "react";
import { Button, Menu, Table, Text, TextInput, Pagination } from "@mantine/core";
import { Trash } from "../../components/icon";

export default function TableComponent({ data, handleDelete, setEditForm }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Har bir sahifadagi elementlar soni

  const filteredData = data.filter((element) =>
    element?.name?.toLowerCase().includes(search?.toLowerCase())
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData?.slice(startIndex, endIndex);

  const rows = paginatedData.map((element) => (
    <Table.Tr key={element?.id}>
      <Table.Td>{element?.name}</Table.Td>
      <Table.Td>{element?.product?.name}</Table.Td>
      <Table.Td>
        <Button onClick={() => setEditForm(element)}>
          <Text fw={600}>Tahrirlash</Text>
        </Button>
      </Table.Td>
      <Table.Td>
        <Menu
          shadow="md"
          width={200}
          transitionProps={{ transition: "pop", duration: 150 }}
          position="left-start"
        >
          <Menu.Target>
            <Button
              color={element?.is_active ? "#fff" : "red"}
              c={element?.is_active ? "red" : undefined}
            >
              <Trash fill={element?.is_active ? "red" : "#fff"} />{" "}
              <Text fw={600} pl={10}>
                O'chirish
              </Text>
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>O'chirishga rozimisiz</Menu.Label>
            <Menu.Divider />
            <Menu.Item onClick={() => handleDelete(element?.id)} color="red">
              Ha , roziman
            </Menu.Item>
            <Menu.Item>Yo'q , keyinroq</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div>
      <TextInput
        placeholder="Qidirish..."
        value={search}
        onChange={(event) => setSearch(event.currentTarget.value)}
        mb="lg"
      />
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
            <Table.Th>Nomi</Table.Th>
            <Table.Th>Product</Table.Th>
            <Table.Th>Tahrirlash</Table.Th>
            <Table.Th>O'chirish</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {paginatedData?.length ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Th ta="center" colSpan={5}>
                Ma'lumot yo'q
              </Table.Th>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
      <Pagination
        total={Math.ceil(filteredData?.length / itemsPerPage)}
        page={currentPage}
        onChange={setCurrentPage}
        my="lg"
      />
    </div>
  );
}
