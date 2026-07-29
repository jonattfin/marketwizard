"use client"

import Loading from "@/shared/loading";
import {useInfiniteQuery, useMutation} from "@tanstack/react-query";
import {
  Breadcrumb,
  Button,
} from "@chakra-ui/react";

import {useState} from "react";
import {queryClient} from "@/shared/queryClient";
import {toaster} from "@/components/ui/toaster"
import {AccordionWatchlist} from "@/app/watchlist/components/accordion-watchlist";
import {LuLoaderCircle} from "react-icons/lu";
import {WatchListPageType} from "@/shared/types";

const useWatchlists = () => {
  const {isPending, error, data, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage} = useInfiniteQuery<WatchListPageType, Error>({
    queryKey: ["watchlists"],
    queryFn: async ({pageParam = "0"}) => {
      const response = await fetch(`/api/watchlists?cursor=${pageParam}`);
      return await response.json();
    },
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor || undefined;
    },
    initialPageParam: "0"
  });

  return {
    isPending,
    isFetching,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  }
}

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState("");
  const [setOpen] = useState(false);

  const {isPending, error, data, fetchNextPage, hasNextPage, isFetchingNextPage} = useWatchlists();

  const useCreateWatchlist = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/watchlists", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name: watchlist} as { name: string })
      });
      if (!response.ok)
        throw new Error(response.statusText);

      return await response.json();
    },
    onError: () => {
      toaster.create({
        title: `Watchlist can't be created! Please try again later!`,
        type: "error",
      })
    }
  })

  const useUpdateWatchlist = useMutation({
    mutationFn: async (watchlist: { id: string, name: string }) => {
      const response = await fetch("/api/watchlists", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(watchlist)
      });
      return await response.json();
    },
    onError: () => {
      toaster.create({
        title: `Watchlist can't be updated! Please try again later!`,
        type: "error",
      })
    }
  })

  const useDeleteWatchlist = useMutation({
    mutationFn: async (watchlist: { id: string }) => {
      const response = await fetch("/api/watchlists", {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(watchlist)
      });
      return await response.json();
    },
    onError: () => {
      toaster.create({
        title: `Watchlist can't be deleted! Please try again later!`,
        type: "error",
      })
    }
  })

  const handleUpdate = async (id: string, watchlistName: string) => {
    await useUpdateWatchlist.mutateAsync({
      id,
      name: watchlistName
    });
    await queryClient.invalidateQueries({queryKey: ["watchlists"]});

    toaster.create({
      title: `Watchlist updated successfully!`,
      type: "success",
    })
  }

  const handleDelete = async (id: string) => {
    await useDeleteWatchlist.mutateAsync({
      id
    });
    await queryClient.invalidateQueries({queryKey: ["watchlists"]});

    toaster.create({
      title: `Watchlist deleted successfully!`,
      type: "success",
    })
  }

  if (isPending) return <Loading/>;
  if (error) return `Error ${JSON.stringify(error)}`;

  return (
    <>
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator/>
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink data-testid={"watchlist-link"}>Watchlist</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
      <div>&nbsp;</div>
      <AccordionWatchlist {...{
        watchlists: data?.pages.flatMap(page => page.items) ?? [],
        handleUpdate,
        handleDelete,
      }}/>
      <div>&nbsp;</div>
      <Button variant="outline" onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
        {isFetchingNextPage ? "Loading more..." : hasNextPage ? <>
          <LuLoaderCircle/>
          Load more
        </> : "No more items"}
      </Button>
      <div>&nbsp;</div>
      {/*<Flex gap="4" justify="flex-start">*/}
      {/*  <Popover.Root open={open} onOpenChange={(e) => setOpen(e.open)}>*/}
      {/*    <Popover.Trigger asChild>*/}
      {/*      <Button variant="outline">*/}
      {/*        <LuCirclePlus/>*/}
      {/*        Create watchlist*/}
      {/*      </Button>*/}
      {/*    </Popover.Trigger>*/}
      {/*    <Portal>*/}
      {/*      <Popover.Positioner>*/}
      {/*        <Popover.Content>*/}
      {/*          <Popover.Arrow/>*/}
      {/*          <Popover.Body>*/}
      {/*            <Input placeholder="Watchlist name" size="sm" value={watchlist}*/}
      {/*                   onChange={e => setWatchlist(e.target.value)}/>*/}
      {/*            <Button mt="4" size="sm" variant="outline" onClick={handleCreate}>Create</Button>*/}
      {/*          </Popover.Body>*/}
      {/*        </Popover.Content>*/}
      {/*      </Popover.Positioner>*/}
      {/*    </Portal>*/}
      {/*  </Popover.Root>*/}
      {/*</Flex>*/}
    </>
  )
}

export default Watchlist;
