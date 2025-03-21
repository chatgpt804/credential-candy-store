import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import AccountForm from "@/components/admin/AccountForm";
import CookieForm from "@/components/admin/CookieForm";
import GameForm from "@/components/admin/GameForm";
import RequestsPanel from "@/components/admin/RequestsPanel";
import { 
  getAllAccounts, 
  getAllCookies, 
  deleteAccount, 
  deleteCookie,
  deleteGame,
  ADMIN_KEY,
  verifyAdminKey,
  Game
} from "@/lib/store";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Lock, 
  Plus, 
  RefreshCw, 
  Trash2, 
  Edit, 
  AlertTriangle,
  Check,
  MessageSquare,
  Gamepad
} from "lucide-react";
import { toast } from "sonner";

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [accountFormOpen, setAccountFormOpen] = useState(false);
  const [cookieFormOpen, setCookieFormOpen] = useState(false);
  const [gameFormOpen, setGameFormOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const storedKey = localStorage.getItem("admin_key");
    if (storedKey && verifyAdminKey(storedKey)) {
      setIsAuthenticated(true);
      setAdminKey(storedKey);
    }
  }, []);

  const handleLogin = () => {
    if (verifyAdminKey(adminKey)) {
      setIsAuthenticated(true);
      localStorage.setItem("admin_key", adminKey);
      toast.success("Admin access granted");
    } else {
      toast.error("Invalid admin key");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminKey("");
    localStorage.removeItem("admin_key");
    toast.success("Logged out successfully");
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const { data: accounts, isLoading: isLoadingAccounts } = useQuery({
    queryKey: ["admin-accounts", refreshKey],
    queryFn: getAllAccounts,
    enabled: isAuthenticated,
  });

  const { data: cookies, isLoading: isLoadingCookies } = useQuery({
    queryKey: ["admin-cookies", refreshKey],
    queryFn: getAllCookies,
    enabled: isAuthenticated,
  });

  const handleDeleteAccount = async (id: string) => {
    if (confirm("Are you sure you want to delete this account?")) {
      await deleteAccount(id);
      handleRefresh();
    }
  };

  const handleDeleteCookie = async (id: string) => {
    if (confirm("Are you sure you want to delete this cookie?")) {
      await deleteCookie(id);
      handleRefresh();
    }
  };

  const handleEditAccount = (account: any) => {
    setSelectedAccount(account);
    setAccountFormOpen(true);
  };

  const handleFormSuccess = () => {
    setAccountFormOpen(false);
    setCookieFormOpen(false);
    setGameFormOpen(false);
    setSelectedAccount(null);
    setSelectedGame(null);
    handleRefresh();
  };

  const toggleExpandAccount = (accountId: string) => {
    const newExpandedAccounts = new Set(expandedAccounts);
    if (newExpandedAccounts.has(accountId)) {
      newExpandedAccounts.delete(accountId);
    } else {
      newExpandedAccounts.add(accountId);
    }
    setExpandedAccounts(newExpandedAccounts);
  };

  const handleAddGame = (account: any) => {
    setSelectedAccount(account);
    setSelectedGame(null);
    setGameFormOpen(true);
  };

  const handleEditGame = (account: any, game: Game) => {
    setSelectedAccount(account);
    setSelectedGame(game);
    setGameFormOpen(true);
  };

  const handleDeleteGame = async (gameId: string) => {
    if (confirm("Are you sure you want to delete this game?")) {
      await deleteGame(gameId);
      handleRefresh();
    }
  };

  if (!isAuthenticated) {
    return (
      <MainLayout>
        <div className="page-container">
          <div className="max-w-md mx-auto">
            <Card className="animate-fade-in">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-center">Admin Access</CardTitle>
                <CardDescription className="text-center">
                  Enter your admin key to access the dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    type="password"
                    placeholder="Enter admin key"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                  />
                  <Button 
                    className="w-full" 
                    onClick={handleLogin}
                    disabled={!adminKey}
                  >
                    Login
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="text-center text-sm text-muted-foreground">
                Access restricted to administrators only
              </CardFooter>
            </Card>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage accounts, cookies, service requests, and monitor platform activity
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="accounts" className="space-y-4">
          <TabsList className="grid w-full md:w-auto grid-cols-3">
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="cookies">Cookies</TabsTrigger>
            <TabsTrigger value="requests">Service Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="accounts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Manage Accounts</h2>
              <Dialog open={accountFormOpen} onOpenChange={setAccountFormOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => {
                    setSelectedAccount(null);
                    setAccountFormOpen(true);
                  }}>
                    <Plus className="h-4 w-4 mr-2" /> Add Account
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedAccount ? "Edit Account" : "Add New Account"}
                    </DialogTitle>
                    <DialogDescription>
                      {selectedAccount
                        ? "Update the details for this account"
                        : "Fill in the details for the new account"}
                    </DialogDescription>
                  </DialogHeader>
                  <AccountForm 
                    account={selectedAccount} 
                    onSubmitSuccess={handleFormSuccess}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <Dialog open={gameFormOpen} onOpenChange={setGameFormOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {selectedGame ? "Edit Game" : "Add New Game"}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedGame
                      ? "Update the details for this game"
                      : "Add a game to this account"}
                  </DialogDescription>
                </DialogHeader>
                {selectedAccount && (
                  <GameForm 
                    accountId={selectedAccount.id}
                    game={selectedGame || undefined}
                    onSubmitSuccess={handleFormSuccess}
                  />
                )}
              </DialogContent>
            </Dialog>

            {isLoadingAccounts ? (
              <div className="text-center py-10">
                <p>Loading accounts...</p>
              </div>
            ) : accounts && accounts.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Added On</TableHead>
                      <TableHead>Expires On</TableHead>
                      <TableHead>Uses</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y">
                    {accounts.map((account) => (
                      <>
                        <TableRow key={account.id} className="hover:bg-secondary/50">
                          <TableCell className="capitalize">
                            <div className="flex items-center">
                              {account.service}
                              {account.service === 'steam' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleExpandAccount(account.id)}
                                  className="ml-2"
                                >
                                  <Gamepad className="h-4 w-4 mr-1" />
                                  {expandedAccounts.has(account.id) ? "Hide Games" : "Show Games"}
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{account.email}</TableCell>
                          <TableCell>
                            <span
                              className={
                                account.status === "active"
                                  ? "status-badge available"
                                  : account.status === "expiring"
                                  ? "status-badge limited"
                                  : "status-badge unavailable"
                              }
                            >
                              {account.status === "active" && "Active"}
                              {account.status === "expiring" && "Expiring Soon"}
                              {account.status === "expired" && "Expired"}
                            </span>
                          </TableCell>
                          <TableCell>{new Date(account.addedOn).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {account.expiresOn
                              ? new Date(account.expiresOn).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          <TableCell>{account.usageCount}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditAccount(account)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {account.service === 'steam' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleAddGame(account)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => handleDeleteAccount(account.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                        {account.service === 'steam' && expandedAccounts.has(account.id) && (
                          <TableRow key={`${account.id}-games`}>
                            <TableCell colSpan={7} className="bg-muted/20 p-0">
                              {account.games && account.games.length > 0 ? (
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="pl-8">Game Name</TableHead>
                                      <TableHead>Description</TableHead>
                                      <TableHead>Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {account.games.map((game: Game) => (
                                      <TableRow key={game.id}>
                                        <TableCell className="pl-8">
                                          <div className="flex items-center">
                                            <Gamepad className="h-4 w-4 mr-2 text-primary" />
                                            {game.name}
                                          </div>
                                        </TableCell>
                                        <TableCell>{game.description || "No description"}</TableCell>
                                        <TableCell>
                                          <div className="flex space-x-2">
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => handleEditGame(account, game)}
                                            >
                                              <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="text-destructive"
                                              onClick={() => handleDeleteGame(game.id)}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              ) : (
                                <div className="text-center py-4">
                                  <p className="text-muted-foreground">No games added to this account.</p>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="mt-2"
                                    onClick={() => handleAddGame(account)}
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Game
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 bg-muted rounded-md">
                <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p>No accounts found. Add some accounts to get started.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cookies" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-medium">Manage Cookies</h2>
              <Dialog open={cookieFormOpen} onOpenChange={setCookieFormOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setCookieFormOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Add Cookie
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Cookie</DialogTitle>
                    <DialogDescription>
                      Fill in the details for the new Netflix cookie
                    </DialogDescription>
                  </DialogHeader>
                  <CookieForm onSubmitSuccess={handleFormSuccess} />
                </DialogContent>
              </Dialog>
            </div>

            {isLoadingCookies ? (
              <div className="text-center py-10">
                <p>Loading cookies...</p>
              </div>
            ) : cookies && cookies.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="text-left p-3 rounded-tl-md">Name</th>
                      <th className="text-left p-3">Domain</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Added On</th>
                      <th className="text-left p-3">Expires On</th>
                      <th className="text-left p-3 rounded-tr-md">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {cookies.map((cookie) => (
                      <tr key={cookie.id} className="hover:bg-secondary/50">
                        <td className="p-3">{cookie.name}</td>
                        <td className="p-3">{cookie.domain}</td>
                        <td className="p-3">
                          <span
                            className={
                              cookie.status === "active"
                                ? "status-badge available"
                                : cookie.status === "expiring"
                                ? "status-badge limited"
                                : "status-badge unavailable"
                            }
                          >
                            {cookie.status === "active" && "Active"}
                            {cookie.status === "expiring" && "Expiring Soon"}
                            {cookie.status === "expired" && "Expired"}
                          </span>
                        </td>
                        <td className="p-3">{new Date(cookie.addedOn).toLocaleDateString()}</td>
                        <td className="p-3">
                          {cookie.expiresOn
                            ? new Date(cookie.expiresOn).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="p-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDeleteCookie(cookie.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 bg-muted rounded-md">
                <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p>No cookies found. Add some cookies to get started.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <RequestsPanel />
          </TabsContent>
        </Tabs>

        <div className="mt-12 bg-secondary/50 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <h3 className="text-lg font-medium">Admin Features</h3>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <li className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
              <span>Add, update, and remove accounts</span>
            </li>
            <li className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
              <span>Manage Netflix cookies</span>
            </li>
            <li className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
              <span>Track account usage statistics</span>
            </li>
            <li className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
              <span>Handle service requests</span>
            </li>
            <li className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
              <span>Manage Steam games</span>
            </li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminPage;
