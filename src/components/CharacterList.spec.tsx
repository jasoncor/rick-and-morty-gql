import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { CharacterList } from "./CharacterList";

// Mock the Apollo Client hooks
vi.mock("@apollo/client/react", () => ({
  useQuery: vi.fn(),
}));

const mockNavigate = vi.fn();

// Mock react-router-dom's useNavigate
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockNavigate,
}));

const mockCharactersData = {
  characters: {
    info: {
      count: 100,
      pages: 5,
      next: 2,
      prev: null,
    },
    results: [
      {
        name: "Rick Sanchez",
        species: "Human",
        image: "https://example.com/rick.jpg",
      },
      {
        name: "Morty Smith",
        species: "Human",
        image: "https://example.com/morty.jpg",
      },
    ],
  },
};

const renderWithRouter = (initialPath = "/page/1") => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/page/:page" element={<CharacterList />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("CharacterList", () => {
  let mockUseQuery: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    mockUseQuery = vi.fn();
    const apolloClient = await import("@apollo/client/react");
    vi.spyOn(apolloClient, "useQuery").mockImplementation(mockUseQuery);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    mockUseQuery.mockReturnValue({
      loading: true,
      error: undefined,
      data: undefined,
      fetchMore: vi.fn(),
    });

    const screen = renderWithRouter();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays error message when query fails", () => {
    mockUseQuery.mockReturnValue({
      loading: false,
      error: new Error("Failed to fetch characters"),
      data: undefined,
      fetchMore: vi.fn(),
    });

    const screen = renderWithRouter();
    expect(screen.getByText("Error Loading Characters")).toBeInTheDocument();
  });

  it("displays no characters message when results are empty", () => {
    mockUseQuery.mockReturnValue({
      loading: false,
      error: undefined,
      data: {
        characters: {
          info: {
            count: 0,
            pages: 0,
            next: null,
            prev: null,
          },
          results: [],
        },
      },
      fetchMore: vi.fn(),
    });

    const screen = renderWithRouter();
    expect(screen.getByText("No Characters Found")).toBeInTheDocument();
  });

  it("renders character list successfully", () => {
    mockUseQuery.mockReturnValue({
      loading: false,
      error: undefined,
      data: mockCharactersData,
      fetchMore: vi.fn(),
    });

    const screen = renderWithRouter();

    expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
    expect(screen.getByText("Morty Smith")).toBeInTheDocument();
    expect(screen.getAllByText("Human")).toHaveLength(2);

    // Check if images are rendered
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("alt", "Rick Sanchez");
    expect(images[1]).toHaveAttribute("alt", "Morty Smith");
  });

  it("handles pagination correctly", async () => {
    const mockFetchMore = vi.fn();
    mockUseQuery.mockReturnValue({
      loading: false,
      error: undefined,
      data: mockCharactersData,
      fetchMore: mockFetchMore,
    });

    const screen = renderWithRouter();

    // Test pagination controls
    expect(screen.getByText("Page 1 of 5")).toBeInTheDocument();

    const nextButton = screen.getByTestId("next-button");
    expect(nextButton).toBeEnabled();

    const prevButton = screen.getByTestId("previous-button");
    expect(prevButton).toBeDisabled();

    // Simulate mouse over to prefetch next page
    fireEvent.mouseOver(nextButton);

    // Verify fetchMore was called with correct variables
    expect(mockFetchMore).toHaveBeenCalledWith({
      variables: { page: 2 },
    });

    // Navigate to next page
    fireEvent.click(nextButton);

    expect(mockNavigate).toHaveBeenCalledWith("/page/2");
  });
});
