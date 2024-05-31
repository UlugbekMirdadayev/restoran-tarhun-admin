import React from "react";
import {
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Text,
  NumberInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { post } from "../../services/api";
import classes from "./style.module.css";
import { useDispatch } from "react-redux";
import { setLoader } from "../../redux/loaderSlice";
import { setUser } from "../../redux/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const form = useForm({
    initialValues: {
      phone_number: "",
      password: "",
    },
  });

  const onSubmit = (values) => {
    values.phone_number = values.phone_number + "";
    dispatch(setLoader(true));
    post("auth/login", values)
      .then(({ data }) => {
        if (data?.result?.role === 1) {
          dispatch(setUser(data?.result));
          navigate("/", { replace: true });
        } else {
          toast.error("Siz admin sifatida kirish uchun ruxsat etilmadingiz");
        }
      })
      .catch((err) => {
        toast.error(JSON.stringify(err?.response?.data?.message || err?.response?.data || "Error"));
      })
      .finally(() => {
        dispatch(setLoader(false));
      });
  };

  return (
    <Container my={"auto"} mx={"auto"}>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Title ta="center" className={classes.title}>
          Hush kelibsiz !
        </Title>

        <Paper withBorder shadow="md" w={400} p={30} mt={30} radius="md">
          <NumberInput
            label={
              <Text
                style={{
                  display: "inline-block",
                }}
                pb={"lg"}
              >
                Telefon raqamingiz
              </Text>
            }
            placeholder="998***"
            required
            prefix="+"
            maxLength={13}
            rightSection={<></>}
            {...form.getInputProps("phone_number")}
          />
          <PasswordInput
            label={
              <Text
                style={{
                  display: "inline-block",
                }}
                pb={"lg"}
              >
                Parolingiz
              </Text>
            }
            placeholder="Parolingiz"
            required
            mt="md"
            {...form.getInputProps("password")}
          />
          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </Paper>
      </form>
    </Container>
  );
};

export default Login;
