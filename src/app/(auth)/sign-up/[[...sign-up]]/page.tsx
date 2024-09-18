"use client";
import Image from "next/image";
import Background from "@/assets/images/bg-signin_animation.gif";
import { Alert, Button, Slide, SlideProps, Snackbar } from "@mui/material";
import Link from "next/link";
import "./../../login/Login.scss";
import FormSignUp from "@/components/auth/FormSignup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { IAlert } from "@/types/alert";

import { onSubmitService } from "@/api/auth/registerService";
import { IUser } from "@/types/user";

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

const SignIn = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IUser>();
  const router = useRouter();
  const [alert, setAlert] = useState<IAlert>({
    open: false,
    message: "",
    severity: "success",
  });
  const { message, open, severity } = alert;

  const onSubmit = async (data: IUser) => {
    const response = await onSubmitService(data);
    if (response.ok) {
      setAlert((state) => ({ ...state,message: "Đăng ký thành công", open: true,severity:"success" }));
      // Registration successful, handle the response accordingly
      router.push("/login");
    } else {
      throw new Error("Registration failed");
    }
  };
  const handleClose = () => setAlert((state) => ({ ...state, open: false }));

  return (
    <div className="auth">
      <div className="auth__left ">
        <h2 className="">Đăng ký</h2>
        <div className="auth__form ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormSignUp errors={errors} register={register} />

            <Button
              variant="contained"
              sx={{ color: "white", mt: 2, mb: 1 }}
              size="large"
              fullWidth
              type="submit"
            >
              Đăng ký
            </Button>
          </form>

          <div className="flex">
            <p className="text-gray-500">Có tài khoản rồi?</p>
            <Link href="/login">
              <p className="text-secondary mx-1">Đăng nhập</p>
            </Link>
            <p className="text-gray-500">nhé</p>
          </div>
        </div>
      </div>
      <div className="auth__right">
        <Image src={Background} unoptimized alt="background" fill className="img" />
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={open}
        onClose={handleClose}
        autoHideDuration={7000}
        key={"vertical + horizontal"}
        TransitionComponent={SlideTransition}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SignIn;
