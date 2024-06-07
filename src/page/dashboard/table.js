import React, { useRef, useState } from "react";
import { Button, Table, Pagination, Flex, Menu } from "@mantine/core";
import moment from "moment";
import { formatCurrencyUZS } from "../../utils/helpers";
import { Eye, Reload } from "../../components/icon";
import { getRequest } from "../../services/api";
import { toast } from "react-toastify";

export default function TableComponent({ data, user, onUpdate }) {
  const TableCheck = ({ data }) => {
    const [open, setOpen] = useState(false);
    const [order, setOrder] = useState({});
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isPrintLoading, setIsPrintLoading] = useState(false);
    const componentRef = useRef();
    const handlePrint = () => {
      setIsPrintLoading(true);
      getRequest(`order/print/${order?.id}`, user?.token)
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

    const getById = () => {
      setLoading(true);
      getRequest(`order/detail/${data?.id}`, user?.token)
        .then(({ data }) => {
          setLoading(false);
          setOrder({
            ...data?.result?.order,
            count_client: data?.result?.count_client,
          });
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
          disabled={loading}
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
                <p className="title-text">Chek id raqamingiz</p>
                <h1>{order?.id}</h1>
                <p>
                  Ochilgan vaqti{" "}
                  {moment(order?.created_at).format("HH:mm  DD.MM.YYYY")}
                </p>
                <div className="table">
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
                        <td className="left" colSpan={2}>
                          Mijozlar soni: {order?.count_client}
                        </td>
                        <td className="right">
                          {formatCurrencyUZS(order?.count_client * 3000)}
                        </td>
                      </tr>
                      <tr>
                        <th colSpan={3}>
                          <hr />
                        </th>
                      </tr>
                      <tr>
                        <td className="left" colSpan={2}>
                          Ofitsant ismi
                        </td>
                        <td className="right">{data?.user_name}</td>
                      </tr>
                      <tr>
                        <th colSpan={3}>
                          <hr />
                        </th>
                      </tr>
                      <tr>
                        <td className="left" colSpan={2}>
                          Umumiy summa
                        </td>
                        <td className="right">
                          {formatCurrencyUZS(order?.total)}
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
  const currentData = data?.orders?.slice(startIndex, endIndex);

  const handleBackup = (order_id) => {
    getRequest(`order/backup/${order_id}`, user?.token)
      .then(({ data }) => {
        console.log(data);
        onUpdate();
      })
      .catch((err) => {
        toast.error(JSON.stringify(err));
      });
  };

  const rows = currentData?.map((element) => (
    <Table.Tr key={element?.id}>
      <Table.Td>{element?.room_name}</Table.Td>
      <Table.Td>{element?.user_name}</Table.Td>
      <Table.Td>{formatCurrencyUZS(element?.total)}</Table.Td>
      <Table.Td>
        {moment(element?.created_at).format("DD-MM-YYYY HH:mm")}
      </Table.Td>
      <Table.Td display={"flex"}>
        <Menu
          shadow="md"
          width={200}
          transitionProps={{ transition: "pop", duration: 150 }}
          position="left-start"
        >
          <Menu.Target>
            <Button display={"flex"} align={"center"}>
              <Reload fill="#fff" />
            </Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Rozimisiz</Menu.Label>
            <Menu.Divider />
            <Menu.Item onClick={() => handleBackup(element?.id)}>
              Ha, roziman
            </Menu.Item>
            <Menu.Item>Yo'q, keyinroq</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
      <Table.Td>
        <TableCheck data={element} />
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
            <Table.Th>Ofitsiant ismi</Table.Th>
            <Table.Th>Umumiy summa</Table.Th>
            <Table.Th>Sanasi</Table.Th>
            <Table.Th>Backup</Table.Th>
            <Table.Th>Ko'rish</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {currentData?.length ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Th ta={"center"} colSpan={5}>
                Malumotlar mavjud emas
              </Table.Th>
            </Table.Tr>
          )}
        </Table.Tbody>
        {data?.orders?.length ? (
          <Table.Tfoot>
            <Table.Tr />
            <Table.Tr>
              <Table.Th colSpan={5}></Table.Th>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>
                Umumiy summa: {formatCurrencyUZS(data?.total_turnover)}
              </Table.Th>
              <Table.Th>
                Umumiy foyda: {formatCurrencyUZS(data?.total_profit)}
              </Table.Th>
              <Table.Th>Jami zarar: {data?.total_damage}</Table.Th>
              <Table.Th>Jami buyurtmalar: {data?.total_cheque}</Table.Th>
            </Table.Tr>
          </Table.Tfoot>
        ) : null}
      </Table>
      <Flex justify="center" mt="lg">
        <Pagination
          page={activePage}
          onChange={setActivePage}
          total={Math.ceil(data?.orders?.length / itemsPerPage)}
        />
      </Flex>
    </>
  );
}
