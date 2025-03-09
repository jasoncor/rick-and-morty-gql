import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "./ui/table";
import { useState } from "react";
import { Pagination } from "./Pagination";
import { GenericError } from "./GenericError";
import { HiUserGroup } from "react-icons/hi";

interface GetCharactersVariables {
  page?: number;
}

interface Character {
  name: string;
  species: string;
  image: string;
}

interface CharactersInfo {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
}

interface CharactersData {
  characters: {
    info: CharactersInfo;
    results: Character[];
  };
}

const columnHelper = createColumnHelper<Character>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("species", {
    header: "Species",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("image", {
    header: "Image",
    cell: (info) => (
      <img
        src={info.getValue()}
        alt={`${info.row.original.name}`}
        className="w-20 h-20 object-cover rounded-md"
      />
    ),
  }),
];

export const CharacterList = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { loading, error, data, fetchMore } = useQuery<
    CharactersData,
    GetCharactersVariables
  >(GET_CHARACTERS, {
    variables: { page: currentPage },
  });

  const handleFetchNext = async (nextPage: number) => {
    try {
      await fetchMore({
        variables: { page: nextPage },
      });
    } catch (error) {
      console.error("Error prefetching next page:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const table = useReactTable({
    data: data?.characters.results || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading)
    return (
      <div className="space-y-4 w-full">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead
                    key={index}
                    className={`text-left p-4 ${
                      column.id === "name"
                        ? "min-w-[450px]"
                        : column.id === "species"
                        ? "min-w-[300px]"
                        : "min-w-[200px]"
                    }`}
                  >
                    {typeof column.header === "string"
                      ? column.header
                      : column.id}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 20 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  <TableCell className="text-left p-4 min-w-[450px]">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                  <TableCell className="text-left p-4 min-w-[350px]">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                  <TableCell className="text-left p-4 min-w-[200px]">
                    <div className="w-20 h-20 bg-gray-200 rounded-md animate-pulse" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-2">
          <button disabled className="disabled:opacity-50">
            Previous
          </button>
          <span>Loading...</span>
          <button disabled className="disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    );

  if (error) return <GenericError error={error} />;

  if (!data)
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg border border-gray-200 min-h-[600px]">
        <div className="text-gray-400 mb-6">
          <HiUserGroup className="h-24 w-24" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
          No Characters Found
        </h3>
        <p className="text-gray-600 text-center max-w-md text-lg">
          There are no characters available to display at the moment. Please try
          again later.
        </p>
      </div>
    );

  return (
    <div className="space-y-4 w-full">
      <div className="rounded-md border min-h-[600px]">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`text-left p-4 ${
                      header.column.id === "name"
                        ? "min-w-[450px]"
                        : header.column.id === "species"
                        ? "min-w-[350px]"
                        : "min-w-[200px]"
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`text-left p-4 ${
                      cell.column.id === "name"
                        ? "min-w-[450px]"
                        : cell.column.id === "species"
                        ? "min-w-[350px]"
                        : "min-w-[200px]"
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-15">
        <Pagination
          currentPage={currentPage}
          totalPages={data?.characters.info.pages || 0}
          fetchNext={handleFetchNext}
          onPageChange={handlePageChange}
          loading={loading}
        />
      </div>
    </div>
  );
};

const GET_CHARACTERS = gql`
  query GetCharacters($page: Int) {
    characters(page: $page) {
      info {
        count
        pages
        next
        prev
      }
      results {
        name
        species
        image
      }
    }
  }
`;
