import React from "react";
import { Button, Menu, Table, Text } from "@mantine/core";
import { Trash } from "../../components/icon";

export default function TableComponent({ data, handleDelete, setEditForm }) {
  const rows = data?.map((element) => (
    <Table.Tr key={element?.id}>
      <Table.Td>{element?.name}</Table.Td>
      <Table.Td>{element?.printer_ip}</Table.Td>
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
          <Table.Th>Printer IP</Table.Th>
          <Table.Th>Tahrirlash</Table.Th>
          <Table.Th>O'chirish</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data?.length ? (
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
  );
}
