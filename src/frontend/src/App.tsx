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
  Cloud,
  FileDown,
  Filter,
  FolderPlus,
  Loader2,
  Plus,
  Search,
  Upload,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Toaster, toast } from "sonner";
import type { FileMetadata, TagId } from "./backend";
import { Breadcrumb } from "./components/Breadcrumb";
import { CreateFolderDialog } from "./components/CreateFolderDialog";
import { FileList } from "./components/FileList";
import { FilePreviewCard } from "./components/FilePreviewCard";
import { Header } from "./components/Header";
import { ProfileSetupDialog } from "./components/ProfileSetupDialog";
import { useActor } from "./hooks/useActor";
import { useDebounce } from "./hooks/useDebounce";
import { useFileUpload } from "./hooks/useFileUpload";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  useGetAllFiles,
  useGetAllFolders,
  useGetAllTags,
  useGetFolderContents,
  useGetFolderPath,
  useProfile,
  useSearchFilesWithTags,
} from "./hooks/useQueries";
import { exportMetadataAsCSV } from "./utils/exports";

export default function App() {
  const { identity, isInitializing, login, isLoggingIn } =
    useInternetIdentity();
  const { isFetching, actor } = useActor();

  const isAuthenticated = !!identity;

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage login={login} isLoggingIn={isLoggingIn} />;
  }

  if (!actor || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return <AuthenticatedApp />;
}

function LandingPage({
  login,
  isLoggingIn,
}: {
  login: () => void;
  isLoggingIn: boolean;
}) {
  return (
    <main className="min-h-screen bg-white flex flex-col overflow-hidden relative">
      {/* Background gradient blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="blob-1 absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl" />
        <div className="blob-2 absolute -top-16 right-0 w-[420px] h-[420px] rounded-full blur-3xl" />
        <div className="blob-3 absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 container mx-auto px-6 lg:px-8 py-6 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-2.5"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-sm">
            <Cloud className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight font-display text-foreground">
            ICcloud
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={login}
            disabled={isLoggingIn}
            data-ocid="nav.primary_button"
            className="rounded-full border-border/60 text-foreground hover:bg-secondary font-medium px-5"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Sign in"
            )}
          </Button>
        </motion.div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-5"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary bg-primary/8 border border-primary/15 px-4 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            On the Internet Computer
          </span>
        </motion.div>

        <motion.h1
          className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight max-w-3xl"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Your files. <span className="text-gradient-cloud">Everywhere.</span>
        </motion.h1>

        <motion.p
          className="mt-6 text-lg text-muted-foreground max-w-md font-sans leading-relaxed"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          Secure, decentralised cloud storage — built entirely on the Internet
          Computer.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10"
        >
          <Button
            size="lg"
            onClick={login}
            disabled={isLoggingIn}
            data-ocid="hero.primary_button"
            className="relative rounded-full px-8 py-6 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(52% 0.24 260), oklch(60% 0.25 300))",
            }}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Connecting…
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4 mr-2" />
                Sign in with Internet Identity
              </>
            )}
          </Button>
        </motion.div>

        <motion.p
          className="mt-4 text-xs text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
        >
          No account needed — your identity lives on-chain.
        </motion.p>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </main>
  );
}

function AuthenticatedApp() {
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
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1 sm:max-w-md">
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

            <div className="mb-4">
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
