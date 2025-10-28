import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

interface Withdrawal {
  id: number;
  phoneNumber: string;
  bankName: string;
  amount: number;
  status: string;
  createdAt: string;
  processedAt: string | null;
}

const Admin = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();

  const fetchWithdrawals = async (status = "all") => {
    setLoading(true);
    try {
      const url = status === "all" 
        ? "https://functions.poehali.dev/223a3cdd-6be5-4973-9f86-ce1edcd01c5d"
        : `https://functions.poehali.dev/223a3cdd-6be5-4973-9f86-ce1edcd01c5d?status=${status}`;
      
      const response = await fetch(url);
      const data = await response.json();
      setWithdrawals(data.withdrawals || []);
    } catch (error) {
      toast({
        title: "❌ Ошибка загрузки",
        description: "Не удалось загрузить заявки",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals(filter);
  }, [filter]);

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch("https://functions.poehali.dev/223a3cdd-6be5-4973-9f86-ce1edcd01c5d", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: "✅ Статус обновлён",
          description: `Заявка #${id} переведена в статус "${newStatus}"`,
        });
        fetchWithdrawals(filter);
      }
    } catch (error) {
      toast({
        title: "❌ Ошибка",
        description: "Не удалось обновить статус",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Ожидает</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Выполнено</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Отклонено</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const stats = {
    total: withdrawals.length,
    pending: withdrawals.filter((w) => w.status === "pending").length,
    completed: withdrawals.filter((w) => w.status === "completed").length,
    totalAmount: withdrawals.reduce((sum, w) => sum + w.amount, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-950/20 to-background">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Админ-панель
              </h1>
              <p className="text-xl text-muted-foreground">Управление заявками на вывод</p>
            </div>
            <Button onClick={() => fetchWithdrawals(filter)} variant="outline" size="lg">
              <Icon name="RefreshCw" size={20} className="mr-2" />
              Обновить
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-transparent">
              <CardHeader className="pb-3">
                <CardDescription>Всего заявок</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">{stats.total}</div>
              </CardContent>
            </Card>

            <Card className="border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-transparent">
              <CardHeader className="pb-3">
                <CardDescription>В ожидании</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-yellow-500">{stats.pending}</div>
              </CardContent>
            </Card>

            <Card className="border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent">
              <CardHeader className="pb-3">
                <CardDescription>Выполнено</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-500">{stats.completed}</div>
              </CardContent>
            </Card>

            <Card className="border-secondary/20 bg-gradient-to-br from-secondary/10 to-transparent">
              <CardHeader className="pb-3">
                <CardDescription>Общая сумма</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-secondary">{stats.totalAmount} ₽</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="border-primary/20 shadow-xl">
          <CardHeader>
            <Tabs value={filter} onValueChange={setFilter} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">
                  Все ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Ожидают ({stats.pending})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Выполнено ({stats.completed})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Отклонено
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <Icon name="Loader2" size={48} className="mx-auto mb-4 text-primary animate-spin" />
                <p className="text-muted-foreground">Загрузка заявок...</p>
              </div>
            ) : withdrawals.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="FileText" size={48} className="mx-auto mb-4 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground">Заявок не найдено</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Телефон</TableHead>
                      <TableHead>Банк</TableHead>
                      <TableHead className="text-right">Сумма</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Создана</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawals.map((withdrawal) => (
                      <TableRow key={withdrawal.id} className="hover:bg-muted/30">
                        <TableCell className="font-mono text-primary">#{withdrawal.id}</TableCell>
                        <TableCell className="font-mono">{withdrawal.phoneNumber}</TableCell>
                        <TableCell>{withdrawal.bankName}</TableCell>
                        <TableCell className="text-right font-bold">{withdrawal.amount} ₽</TableCell>
                        <TableCell>{getStatusBadge(withdrawal.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(withdrawal.createdAt).toLocaleString("ru-RU")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            {withdrawal.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-green-500/20 hover:bg-green-500/10"
                                  onClick={() => updateStatus(withdrawal.id, "completed")}
                                >
                                  <Icon name="Check" size={16} className="mr-1" />
                                  Выполнено
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-red-500/20 hover:bg-red-500/10"
                                  onClick={() => updateStatus(withdrawal.id, "rejected")}
                                >
                                  <Icon name="X" size={16} className="mr-1" />
                                  Отклонить
                                </Button>
                              </>
                            )}
                            {withdrawal.status !== "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateStatus(withdrawal.id, "pending")}
                              >
                                <Icon name="RotateCcw" size={16} className="mr-1" />
                                Вернуть
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>🔐 Панель администратора</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
