import { Box, Button, Group, NumberInput, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { postRequest } from "../../services/api";
import { toast } from "react-toastify";
import { useUser } from "../../redux/selectors";

const inputs = [
  {
    name: "name",
    label: "Xona/Stol raqami",
    as: TextInput,
  },
  {
    name: "places",
    label: "Nechi kishilik",
    as: NumberInput,
  },
  {
    name: "room_type_id",
    label: "Joy turi",
    as: Select,
    data: [
      {
        value: "1",
        label: "Xona",
      },
      {
        value: "2",
        label: "Stol",
      },
    ],
    disabled: false,
  },
];

function FormCreate({ handleUpdate, close, setLoader }) {
  const user = useUser();
  const form = useForm({
    initialValues: {
      name: "",
      places: "",
      room_type_id: "1",
    },
  });

  const onSubmit = (values) => {
    setLoader(true);
    postRequest("room/create", values, user?.token)
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
            data={input.data?.map((element) => ({
              ...element,
              disabled: form.values.room_type_id === element.value,
            }))}
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
