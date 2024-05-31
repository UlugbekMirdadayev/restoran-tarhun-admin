import React, { useState } from "react";
import {
  Button,
  Menu,
  Table,
  Modal,
  Group,
  TextInput,
  NumberInput,
  Select,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { putRequest } from "../../services/api";
import { toast } from "react-toastify";
import { useUser } from "../../redux/selectors";
import moment from "moment";
import "moment/min/locales";
import { PenIcon } from "../../components/icon";

const inputs = [
  {
    name: "full_name",
    label: "Ismi",
    as: TextInput,
  },
  {
    name: "phone_number",
    label: "Telefon raqami",
    as: NumberInput,
    prefix: "+",
    rightSection: <></>,
    maxLength: 13,
  },
  {
    name: "is_active",
    label: "Aktivmi",
    as: Select,
    data: [
      {
        value: "1",
        label: "Aktiv",
      },
      {
        value: "0",
        label: "Aktiv emas",
      },
    ],
  },
  {
    name: "role",
    label: "Rol",
    as: Select,
    data: [
      {
        value: "0",
        label: "Ofitsiant",
      },
      {
        value: "1",
        label: "Admin",
      },
    ],
  },
];

export default function TableComponent({
  data,
  setLoader,
  setWaiters,
  handleDelete,
  handleUpdate,
}) {
  moment.locale("uz-latn");
  const user = useUser();
  const [opened, { open, close }] = useDisclosure(false);
  const [waiter, setWaiter] = useState({});
  const form = useForm({
    initialValues: {
      user_id: "",
      full_name: "",
      phone_number: "",
      is_active: "1",
      role: "1",
    },
  });

  const handleAktiveChange = (id) => {
    setLoader(true);
    putRequest(
      `user/update`,
      {
        user_id: id,
        is_active:
          data?.find((item) => item?.id === id)?.is_active === 0 ? 1 : 0,
      },
      user?.token
    )
      .then(({ data: response }) => {
        toast.info(response?.result);
        setWaiters(
          data?.map((item) => {
            if (item?.id === id) {
              return { ...item, is_active: item?.is_active === 0 ? 1 : 0 };
            }
            return item;
          })
        );
        setLoader(false);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.result);
        setLoader(false);
      });
  };

  const onSubmit = (values) => {
    const editedValues = Object.keys(values).filter((key) => {
      if (key === "user_id") {
        return String(waiter?.id) !== String(values?.user_id);
      }

      if (key === "role" || key === "is_active") {
        return String(values[key]) !== String(waiter[key]);
      }

      return String(values[key]) !== String(waiter[key]);
    });

    if (!editedValues.length) {
      toast.info("O'zgarishlar kiritilmadi");
      return;
    }

    const formData = () => {
      let obj = { user_id: values?.user_id };
      editedValues.map((key) => {
        return (obj[key] = String(values[key]));
      });
      return obj;
    };

    setLoader(true);
    putRequest(`user/update`, formData(), user?.token)
      .then(({ data: res }) => {
        setLoader(false);
        toast.info(res?.result || "Success");
        handleUpdate && handleUpdate(true);
        close();
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
        toast.error(err?.response?.data?.result || "Error");
      });
  };

  const rows = data?.map((element) => (
    <Table.Tr key={element?.id}>
      <Table.Td>
        <Button
          onClick={() => handleAktiveChange(element?.id)}
          bg={!element?.is_active ? "dimmed" : undefined}
        >
          {element?.is_active ? "Aktive" : "Aktiv emas"}
        </Button>
      </Table.Td>
      <Table.Td>{element?.full_name}</Table.Td>
      <Table.Td>+{element?.phone_number}</Table.Td>
      <Table.Td>
        <Button
          size="xs"
          color="blue"
          onClick={() => {
            setWaiter(element);
            form.setValues({
              user_id: element?.id,
              full_name: element?.full_name,
              phone_number: String(element?.phone_number),
              is_active: element?.is_active ? "1" : "0",
              role: String(element?.role === 1 ? 1 : 0) || "1",
            });
            open();
          }}
        >
          <PenIcon fill="#fff" />
        </Button>
      </Table.Td>
      <Table.Td>
        <Menu
          shadow="md"
          transitionProps={{ transition: "pop", duration: 150 }}
          position="left-start"
        >
          <Menu.Target>
            <Button color={"red"}>Ishdan olish</Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Ishdan olishga rozimisiz</Menu.Label>
            <Menu.Divider />
            <Menu.Item onClick={() => handleDelete(element?.id)} color="red">
              Ha , roziman
            </Menu.Item>
            <Menu.Item>Yo'q , shart emas</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Modal opened={opened} onClose={close} title="Yangilash">
        <form onSubmit={form.onSubmit(onSubmit)}>
          {inputs.map((input) => (
            <input.as
              key={input.name}
              mt={"md"}
              required
              withAsterisk
              label={input.label}
              placeholder={input.label}
              data={input.data?.map((element) => ({
                ...element,
              }))}
              prefix={input.prefix}
              rightSection={input.rightSection}
              maxLength={input.maxLength}
              disabled={input.disabled}
              {...form.getInputProps(input.name)}
            />
          ))}
          <Group justify="flex-end" mt="md">
            <Button type="submit">Yuborish</Button>
          </Group>
        </form>
      </Modal>
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
            <Table.Th>Status</Table.Th>
            <Table.Th>Ishchi ismi</Table.Th>
            <Table.Th>Ishchi Raqami</Table.Th>
            <Table.Th>Yangilash</Table.Th>
            <Table.Th>Ishdan olish</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data?.length ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Th ta="center" colSpan={4}>
                Ma'lumot yo'q
              </Table.Th>
            </Table.Tr>
          )}
        </Table.Tbody>
        {data?.length ? (
          <Table.Tfoot>
            <Table.Tr />
            <Table.Tr>
              <Table.Th>Umumiy ishchilar soni</Table.Th>
              <Table.Th colSpan={4}>{data?.length} kishi</Table.Th>
            </Table.Tr>
          </Table.Tfoot>
        ) : null}
      </Table>
    </>
  );
}
