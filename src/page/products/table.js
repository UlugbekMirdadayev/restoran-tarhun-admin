import React, { useState } from "react";
import { Button, Flex, Image, Menu, Table, Text } from "@mantine/core";
import { formatCurrencyUZS } from "../../utils/helpers";
import ModalScreen from "../../components/modal";
import { Eye, Trash, Reload } from "../../components/icon";
import { IMAGE_URL } from "../../utils/constants";

export default function TableComponent({ data, handleDelete, setEditForm }) {
  const [image, setImage] = useState(null);
  const rows = data?.map((element) => (
    <Table.Tr key={element?.id}>
      <Table.Td>{element?.name}</Table.Td>
      <Table.Td>{formatCurrencyUZS(element?.body_price)}</Table.Td>
      <Table.Td>{formatCurrencyUZS(element?.sell_price)}</Table.Td>
      <Table.Td>{element?.category?.name}</Table.Td>
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
              Ha , roziman
            </Menu.Item>
            <Menu.Item>Yo'q , keyinroq</Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Button
          onClick={() => setEditForm(element)}
          mx={"md"}
          display={"flex"}
          align={"center"}
        >
          <Reload fill="#fff" /> <Text pl={10}>Maxsulotni yangilash</Text>
        </Button>
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
          <Table.Th>Maxsulot nomi</Table.Th>
          <Table.Th>Maxsulot tan narxi</Table.Th>
          <Table.Th>Maxsulot sotilish narxi</Table.Th>
          <Table.Th>Maxsulot turi</Table.Th>
          <Table.Th>Maxsulot soni</Table.Th>
          <Table.Th>Rasmi</Table.Th>
          <Table.Th>O'chirish</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data?.length ? (
          rows
        ) : (
          <Table.Tr>
            <Table.Th ta="center" colSpan={7}>
              Ma'lumot yo'q
            </Table.Th>
          </Table.Tr>
        )}
      </Table.Tbody>
      {data?.length ? (
        <Table.Tfoot>
          <Table.Tr
            style={{
              borderTop: "var(--_tr-border-bottom, none)",
            }}
          >
            <Table.Th colSpan={7} ta="center">
              Jami: {data?.length}
              ta maxsulot mavjud.
            </Table.Th>
          </Table.Tr>
        </Table.Tfoot>
      ) : null}
    </Table>
  );
}
