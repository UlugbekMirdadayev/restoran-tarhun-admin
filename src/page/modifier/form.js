import { Box, Button, Group, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { postRequest, putRequest } from "../../services/api";
import { toast } from "react-toastify";
import { useUser, useProducts } from "../../redux/selectors";

const inputs = [
  {
    name: "name",
    label: "Modifikator nomi",
    as: TextInput,
  },
  {
    name: "product_id",
    label: "Product",
    as: Select,
  },
];

function FormCreate({ handleUpdate, close, setLoader, editForm }) {
  const products = useProducts();
  const user = useUser();
  const form = useForm({
    initialValues: {
      name: editForm?.name || "",
      product_id: String(editForm?.product?.id || ""),
    },
  });

  const onSubmit = (values) => {
    setLoader(true);
    if (editForm) {
      values.modifier_id = editForm?.id;
      return putRequest("product/modifier/update", values, user?.token)
        .then(({ data }) => {
          setLoader(false);
          toast.info(data?.result || "Success");
          handleUpdate(true);
          close();
        })
        .catch((err) => {
          console.log(err);
          setLoader(false);
          toast.error(err?.response?.data?.resultresult || "Error");
        });
    }
    postRequest("product/modifier/create", values, user?.token)
      .then(({ data }) => {
        setLoader(false);
        toast.info(data?.result || "Success");
        handleUpdate(true);
        close();
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
        toast.error(err?.response?.data?.result || "Error");
      });
  };

  return (
    <Box mx="auto">
      <form onSubmit={form.onSubmit(onSubmit)}>
        {inputs.map((input) => (
          <input.as
            key={input.name}
            mt={"md"}
            required
            withAsterisk
            label={input.label}
            placeholder={input.label}
            disabled={input.disabled}
            {...{
              focus:
                input.name === "name"
                  ? {}
                  : { allowDeselect: false, searchable: true },
            }.focus}
            data={products?.map((prod) => ({
              label: prod?.name,
              value: String(prod?.id),
            }))}
            {...form.getInputProps(input.name)}
          />
        ))}
        <Group justify="flex-end" mt="md">
          <Button type="submit">Yuborish</Button>
        </Group>
      </form>
    </Box>
  );
}

export default FormCreate;
