import { Box, Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { postRequest, putRequest } from "../../services/api";
import { toast } from "react-toastify";
import { useUser } from "../../redux/selectors";

const inputs = [
  {
    name: "name",
    label: "Kategoriya nomi",
    as: TextInput,
  },
  {
    name: "printer_ip",
    label: "Printer IP",
    as: TextInput,
  },
];

function FormCreate({ handleUpdate, close, setLoader, editForm }) {
  const user = useUser();
  const form = useForm({
    initialValues: {
      name: editForm?.name || "",
      printer_ip: editForm?.printer_ip || "",
    },
  });

  const onSubmit = (values) => {
    setLoader(true);
    if (editForm) {
      values.id = editForm?.id;
      return putRequest("category/update", values, user?.token)
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
    postRequest("category/create", values, user?.token)
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
