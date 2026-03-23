import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  FileDown,
  Filter,
  FolderPlus,
  Plus,
  Search,
  Upload,
  X,
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import type { FileMetadata, TagId } from "../backend";
import { useDebounce } from "../hooks/useDebounce";
import { useFileUpload } from "../hooks/useFileUpload";
import {
  useGetAllFiles,
  useGetAllFolders,
  useGetAllTags,
  useGetFolderContents,
  useGetFolderPath,
  useProfile,
  useSearchFilesWithTags,
} from "../hooks/useQueries";
import { exportMetadataAsCSV } from "../utils/exports";
import { Breadcrumb } from "./Breadcrumb";
import { CreateFolderDialog } from "./CreateFolderDialog";
import { FileList } from "./FileList";
import { Header } from "./Header";
import { ProfileSetupDialog } from "./ProfileSetupDialog";

export default function AuthenticatedApp() {
  const {
    data: profile,
    isLoading: isLoadingProfile,
    isError: isProfileError,
    error: profileError,
  } = useProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<TagId[]>([]);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<bigint | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileMetadata | null>(null);

  const { triggerUpload, FileInput } = useFileUpload(currentFolderId);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const {
    data: folderContents,
    isLoading: isLoadingContents,
    isError: isContentsError,
    error: contentsError,
  } = useGetFolderContents(currentFolderId);
  const { data: folderPath = [] } = useGetFolderPath(currentFolderId);
  const {
    data: allTags = [],
    isError: isTagsError,
    error: tagsError,
  } = useGetAllTags();
  const {
    data: allFiles = [],
    isError: isFilesError,
    error: filesError,
  } = useGetAllFiles();
  const {
    data: allFolders = [],
    isError: isFoldersError,
    error: foldersError,
  } = useGetAllFolders();

  if (isProfileError) console.error("Profile error:", profileError);
  if (isContentsError) console.error("Contents error:", contentsError);
  if (isTagsError) console.error("Tags error:", tagsError);
  if (isFilesError) console.error("Files error:", filesError);
  if (isFoldersError) console.error("Folders error:", foldersError);

  const isFiltering =
    debouncedSearchQuery.trim() !== "" || selectedTagIds.length > 0;
  const {
    data: filteredResults,
    isLoading: isSearching,
    isError: isSearchError,
  } = useSearchFilesWithTags(debouncedSearchQuery, selectedTagIds);

  const hasProfile = profile?.name;

  const displayedFiles = isFiltering
    ? (filteredResults ?? [])
    : (folderContents?.files ?? []);
  const displayedFolders = isFiltering ? [] : (folderContents?.folders ?? []);

  const toggleTagFilter = (tagId: TagId) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTagIds([]);
  };

  const handleOpenFolder = (folderId: bigint) => {
    setCurrentFolderId(folderId);
    setSelectedFile(null);
  };

  const handleNavigate = (folderId: bigint | null) => {
    setCurrentFolderId(folderId);
    setSelectedFile(null);
  };

  const handleExportCSV = () => {
    try {
      exportMetadataAsCSV({
        files: allFiles,
        folders: allFolders,
        tags: allTags,
      });
      toast.success("Metadata exported as CSV");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to export CSV",
      );
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const hasDataError =
    isProfileError ||
    isContentsError ||
    isTagsError ||
    isFilesError ||
    isFoldersError;

  if (hasDataError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-destructive text-center">
          <p>Failed to load data. Please refresh.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProfileSetupDialog open={!hasProfile} />
      {hasProfile && (
        <div className="min-h-screen bg-background flex flex-col">
          <Header userName={profile.name} />
          <main className="flex-1 p-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="relative w-full sm:flex-1 sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-ocid="toolbar.search_input"
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2"
                    data-ocid="toolbar.filter.toggle"
                  >
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Tags</span>
                    {selectedTagIds.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                        {selectedTagIds.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuLabel>Filter by Tag</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {allTags.length === 0 ? (
                    <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                      No tags yet
                    </div>
                  ) : (
                    allTags.map((tag) => (
                      <DropdownMenuCheckboxItem
                        key={tag.id}
                        checked={selectedTagIds.includes(tag.id)}
                        onCheckedChange={() => toggleTagFilter(tag.id)}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: tag.color }}
                          />
                          {tag.name}
                        </div>
                      </DropdownMenuCheckboxItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                onClick={handleExportCSV}
                className="gap-2"
                data-ocid="toolbar.secondary_button"
              >
                <FileDown className="h-4 w-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="gap-2" data-ocid="toolbar.primary_button">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">New</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowCreateFolder(true)}>
                    <FolderPlus className="h-4 w-4" />
                    New Folder
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={triggerUpload}>
                    <Upload className="h-4 w-4" />
                    Upload File
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Active filters indicator */}
            {isFiltering && (
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="text-sm text-muted-foreground">
                  Filtering:
                </span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: &quot;{searchQuery}&quot;
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="ml-1 hover:bg-muted rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedTagIds.map((tagId) => {
                  const tag = allTags.find((t) => t.id === tagId);
                  if (!tag) return null;
                  return (
                    <Badge
                      key={tagId}
                      style={{ backgroundColor: tag.color, color: "#fff" }}
                      className="gap-1"
                    >
                      {tag.name}
                      <button
                        type="button"
                        onClick={() => toggleTagFilter(tagId)}
                        className="ml-1 hover:bg-black/20 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-6 px-2 text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}

            <div className="mb-4 overflow-x-auto">
              <Breadcrumb path={folderPath} onNavigate={handleNavigate} />
            </div>

            <FileInput />

            <div className="bg-card border border-border rounded-lg overflow-hidden">
              {isSearchError ? (
                <div
                  className="text-destructive p-4 text-center"
                  data-ocid="files.error_state"
                >
                  Failed to search files. Please try again.
                </div>
              ) : (
                <FileList
                  folders={displayedFolders}
                  files={displayedFiles}
                  isLoading={isLoadingContents || isSearching}
                  selectedFile={selectedFile}
                  onSelectFile={setSelectedFile}
                  onOpenFolder={handleOpenFolder}
                />
              )}
            </div>
          </main>
        </div>
      )}

      <CreateFolderDialog
        open={showCreateFolder}
        onOpenChange={setShowCreateFolder}
        parentFolderId={currentFolderId}
      />
      <Toaster position="bottom-right" />
    </>
  );
}
