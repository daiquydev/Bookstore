import axios from "axios";
import { useAuthStore } from "../hooks/user";
import { IUser } from "../types/user";
import { IFormCheckout } from "../types/form";
import dayjs from "dayjs";
import { headerAxios, port } from "../utils/env";
import { handleError } from "./handleError";

export const getUserInfo = async (
  userId: number,
) => {
  try {
    const response = await axios.request({
      url: `${port}/api/user/${userId}`,
      headers:headerAxios
    });
    return response
  } catch (error) {
    return handleError(error)
  }
};

export const getProfile = async (
  token: string | null,
  setToken: (arg: string, profile: IUser) => void
) => {
  try {
    const response = await axios.request({
      url: `${port}/api/user/myInfo`,
      headers: {
        ...headerAxios,
        Authorization: `Bearer ${token}`,
      },
    });
    if (response?.data && token) {
      setToken(token, response?.data);
      return response;
    } else {
      return "Lấy thông tin thất bại"

    }
  } catch (error) {
    return handleError(error)
  }
};
export const onSubmitProfile = async (data: IFormCheckout, profile: IUser | null, token: string | null) => {
  const { email, phoneNumber, firstName, lastName, birthDate, address } =
    data;
  let dataRes = JSON.stringify({
    id: profile?.id,
    username: profile?.username,
    email,
    phoneNumber,
    firstName,
    lastName,
    birthDate: dayjs(birthDate).format("YYYY-MM-DD"),
    address,
    password: null,
  });
  let config = {
    method: "put",
    maxBodyLength: Infinity,
    url: `${port}/api/user/${profile?.id}`,
    headers: {
      ...headerAxios,
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: dataRes,
  };

  return await axios
    .request(config)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      return handleError(error)
    });
};