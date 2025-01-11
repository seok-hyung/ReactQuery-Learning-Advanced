import { AxiosResponse } from "axios";

import type { User } from "@shared/types";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance, getJWTHeader } from "@/axiosInstance";
import { queryKeys } from "@/react-query/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { generateUserKey } from "@/react-query/key-factories";

// query function
async function getUser(userId: number, userToken: string) {
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${userId}`,
    {
      headers: getJWTHeader(userToken),
    }
  );

  return data.user;
}

export function useUser() {
  const { userId, userToken } = useLoginData();
  const queryClient = useQueryClient();

  // call useQuery to update user data from server

  const { data: user } = useQuery({
    enabled: !!userId, // 이중 논리 연산자
    queryKey: generateUserKey(userId, userToken),
    queryFn: () => getUser(userId, userToken),
    staleTime: Infinity, // 데이터가 절대 stale 상태가 되지 않게 설정
    // 즉 데이터는 가비지 컬렉션 시간이 만료되지 않는 한, 리페칭을 하지 않는다
    // 이 데이터는 사용자 스스로 업데이트할 경우에만 변경되고 리페칭이 일어난다.
    // 사용자가 새로운 이름이나 새로운 주소를 입력하는 경우이다!!

    // 이 데이터는 우리가 모르는 사이에 변경되지 않을 것이다
    // 사용자가 두 컴퓨터에 로그인하여 한 컴퓨터에서 정보를 변경하고, 다른 컴퓨터에서는 정보를 변경하지않는 매우 드문 경우를 제외하고!!
  });

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // TODO: update the user in the query cache
  }

  // meant to be called from useAuth
  function clearUser() {
    // TODO: reset user to null in query cache
  }

  return { user, updateUser, clearUser };
}
