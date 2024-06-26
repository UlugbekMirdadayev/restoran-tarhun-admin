import React, { useRef, useState } from "react";
import { Button, Menu, Table, Text, Pagination, Flex } from "@mantine/core";
import { Eye, Trash } from "../../components/icon";
import { getRequest } from "../../services/api";
import { toast } from "react-toastify";
import { formatCurrencyUZS } from "../../utils/helpers";

export default function TableComponent({ data, handleDelete, user }) {
  const TableCheck = ({ data }) => {
    const [open, setOpen] = useState(false);
    const [room, setRoom] = useState({});
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isPrintLoading, setIsPrintLoading] = useState(false);
    const componentRef = useRef();

    const handlePrint = () => {
      setIsPrintLoading(true);
      getRequest(`room/print/${room?.id}`, user?.token)
        .then(({ data }) => {
          console.log(data, "data");
          setIsPrintLoading(false);
          toast.success("Print qilindi");
          setOpen(false);
        })
        .catch((err) => {
          setIsPrintLoading(false);
          console.log(err, "err");
          toast.error("Xatolik yuz berdi");
        });
    };

    const handleComplete = ()=> { 
      getRequest(`room/end/${room?.id}`, user?.token).then(({ data }) => {
        setIsPrintLoading(false);
        toast.success(data?.result);
        setOpen(false);
      })
      .catch((err) => {
        setIsPrintLoading(false);
        toast.error("Xatolik yuz berdi");
      });
    }

    const getById = () => {
      setLoading(true);
      getRequest(`room/see/${data?.id}`, user?.token)
        .then(({ data }) => {
          setLoading(false);
          setRoom(data?.result?.room);
          setProducts(data?.result?.products);
          setOpen(true);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err, "err");
          toast.error("Xatolik yuz berdi");
        });
    };

    return (
      <>
        <Button
          align={"center"}
          gap={10}
          loading={loading}
          disabled={loading || !data?.is_active}
          onClick={getById}
        >
          <Eye />
        </Button>
        <div
          className="modal-print"
          style={{ display: `${open ? "flex" : "none"}` }}
        >
          <div>
            <Button w={"100%"} mt={"lg"} onClick={() => setOpen(false)}>
              Orqaga
            </Button>
            <div className="cheque" ref={componentRef}>
              <div className="print-body">
                <div className="table">
                  <strong
                    style={{
                      textAlign: "center",
                      display: "block",
                      fontSize: "20px",
                      marginBottom: "10px",
                    }}
                  >
                    {room?.name} {room?.room_type_name}
                  </strong>
                  <strong>Buyurtma</strong>
                  <table>
                    <thead>
                      <tr>
                        <th className="left">Nomi</th>
                        <th>Soni</th>
                        <th className="right">Narxi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products?.length
                        ? products?.map((prod) => (
                            <tr key={prod?.id}>
                              <td className="left">{prod?.name}</td>
                              <td>{prod?.quantity}</td>
                              <td className="right">
                                {formatCurrencyUZS(prod?.sell_price)}
                              </td>
                            </tr>
                          ))
                        : null}
                    </tbody>

                    <tfoot>
                      <tr>
                        <th colSpan={3}>
                          <hr />
                        </th>
                      </tr>
                      <tr>
                        <td className="left">
                          Mijozlar soni: {room?.count_client}
                        </td>
                        <td className="right" colSpan={2}>
                          {room?.count_client * 3000} so'm
                        </td>
                      </tr>
                      <tr>
                        <td className="left" colSpan={2}>
                          Ofitsant ismi
                        </td>
                        <td className="right">
                          {data?.user_name}
                        </td>
                      </tr>
                      <tr>
                        <td className="left" colSpan={3}>
                          Bizni tanlaganingiz uchun raxmat!
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <Button
                  w={"100%"}
                  mt={"lg"}
                  onClick={handlePrint}
                  loading={isPrintLoading}
                >
                  Check chiqarish
                </Button>
                <Button
                  w={"100%"}
                  mt={"lg"}
                  onClick={handleComplete}
                  loading={isPrintLoading}
                >
                  Buyurtmani yopish
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;

  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data?.slice(startIndex, endIndex);

  const rows = currentData?.map((element) => (
    <Table.Tr
      key={element?.id}
      bg={element?.is_active ? "red" : undefined}
      c={element?.is_active ? "#fff" : undefined}
    >
      <Table.Td>
        {element?.name}
      </Table.Td>
      <Table.Td>{element?.is_active ? "Joy Band" : "Joy Band emas"}</Table.Td>
      <Table.Td>{element?.places}</Table.Td>
      <Table.Td>
        <TableCheck data={element} />
      </Table.Td>
      <Table.Td>{element?.user_name}</Table.Td>
      <Table.Td>
        <Menu
          shadow="md"
          width={200}
          transitionProps={{ transition: "pop", duration: 150 }}
          position="left-start"
          disabled={element?.is_active}
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
    <>
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
            <Table.Th>Xona/Stol raqami</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Nechi kishilik</Table.Th>
            <Table.Th>Ko'rish</Table.Th>
            <Table.Th>Ofitsant ismi</Table.Th>
            <Table.Th>O'chirish</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {currentData?.length ? (
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
      <Flex justify="center" mt="lg">
        <Pagination
          page={activePage}
          onChange={setActivePage}
          total={Math.ceil(data?.length / itemsPerPage)}
        />
      </Flex>
    </>
  );
}
