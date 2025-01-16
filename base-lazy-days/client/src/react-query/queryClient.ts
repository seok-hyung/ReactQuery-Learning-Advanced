import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientConfig,
} from "@tanstack/react-query";
import { toast } from "@/components/app/toast";

function createTitle(errorMsg: string, actionType: "query" | "mutation") {
  const action = actionType === "query" ? "fetch" : "update";
  return `could not ${action} data: ${
    errorMsg ?? "error connecting to server"
  }`;
}

function errorHandler(title: string) {
  // one message per page load, not one message per query
  // the user doesn't care that there were three failed queries on the staff page
  //    (staff, treatments, user)
  const id = "react-query-toast"; // 중복된 토스트가 표시되지 않는지 확인할 수 있도록 토스트에 Id를 지정한다.

  if (!toast.isActive(id)) {
    toast({ id, title, status: "error", variant: "subtle", isClosable: true });
  }
}

// 이것이 'QueryClientConfig' 타입이라고 명시할 겁니다
// 이 옵션을 변경하고 싶을 때
// 어떤 것이 허용되고 허용되지 않는지 알 수 있도록 도와줄 것입니다
export const queryClientOptions: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 600000, // 10분
      gcTime: 900000, // 15분 (staleTime이 gcTime보다 큰건 말이 안됨)
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      const title = createTitle(error.message, "query");
      errorHandler(title);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      errorHandler(error.message);
    },
  }),
};

export const queryClient = new QueryClient(queryClientOptions);
