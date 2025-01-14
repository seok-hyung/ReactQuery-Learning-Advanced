import { Appointment } from "@shared/types";

import { useLoginData } from "@/auth/AuthContext";
import { axiosInstance } from "@/axiosInstance";
import { useCustomToast } from "@/components/app/hooks/useCustomToast";
import { queryKeys } from "@/react-query/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// for when we need functions for useMutation
async function setAppointmentUser(
  appointment: Appointment,
  userId: number | undefined
): Promise<void> {
  if (!userId) return;
  const patchOp = appointment.userId ? "replace" : "add";
  const patchData = [{ op: patchOp, path: "/userId", value: userId }];
  await axiosInstance.patch(`/appointment/${appointment.id}`, {
    data: patchData,
  });
}

export function useReserveAppointment() {
  const queryClinet = useQueryClient();
  const { userId } = useLoginData();

  const toast = useCustomToast();

  // TODO: replace with mutate function
  const { mutate } = useMutation({
    mutationFn: (appointment: Appointment) =>
      setAppointmentUser(appointment, userId),
    onSuccess: () => {
      queryClinet.invalidateQueries({ queryKey: [queryKeys.appointments] }); // queryKeys.appointments 문자열로 시작하는 모든 쿼리가 이 mutation이 성공시 무효화 된다는 것을 의미한다.
      toast({ title: "You reserved and appointment!", status: "success" });
    },
  });
  return mutate;
}
