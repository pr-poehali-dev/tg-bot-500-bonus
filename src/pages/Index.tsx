import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [balance, setBalance] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const { toast } = useToast();

  const handleOrderCard = () => {
    window.open("https://alfa.me/ASQWHN", "_blank");
    toast({
      title: "🎉 Отлично!",
      description: "Переходим к оформлению карты. После оформления вернитесь сюда!",
    });
  };

  const handleWithdraw = async () => {
    if (!phoneNumber || !bankName || !withdrawAmount) {
      toast({
        title: "⚠️ Заполните все поля",
        description: "Укажите номер телефона, банк и сумму вывода",
        variant: "destructive",
      });
      return;
    }

    if (Number(withdrawAmount) > balance) {
      toast({
        title: "❌ Недостаточно средств",
        description: `На вашем балансе ${balance} ₽`,
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("https://functions.poehali.dev/f2a98b1e-d23c-4da0-bb0f-6eb7a76748b8", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber,
          bankName,
          amount: Number(withdrawAmount),
          userBalance: balance,
          timestamp: new Date().toLocaleString("ru-RU"),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: "✅ Заявка отправлена!",
          description: "Ваша заявка на вывод средств принята в обработку",
        });

        setPhoneNumber("");
        setBankName("");
        setWithdrawAmount("");
      } else {
        throw new Error(data.error || "Ошибка отправки заявки");
      }
    } catch (error) {
      toast({
        title: "❌ Ошибка",
        description: error instanceof Error ? error.message : "Не удалось отправить заявку",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-950/20 to-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center animate-pulse-glow">
              <Icon name="CreditCard" size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Альфа-Карта
          </h1>
          <p className="text-xl text-muted-foreground">
            Получи до <span className="text-primary font-bold">1000 ₽</span> за оформление!
          </p>
        </div>

        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 gap-2">
            <TabsTrigger value="home" className="gap-2">
              <Icon name="Home" size={16} />
              <span className="hidden sm:inline">Главная</span>
            </TabsTrigger>
            <TabsTrigger value="card" className="gap-2">
              <Icon name="CreditCard" size={16} />
              <span className="hidden sm:inline">Карта</span>
            </TabsTrigger>
            <TabsTrigger value="balance" className="gap-2">
              <Icon name="Wallet" size={16} />
              <span className="hidden sm:inline">Баланс</span>
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="gap-2">
              <Icon name="ArrowDownToLine" size={16} />
              <span className="hidden sm:inline">Вывод</span>
            </TabsTrigger>
            <TabsTrigger value="instructions" className="gap-2">
              <Icon name="BookOpen" size={16} />
              <span className="hidden sm:inline">Инструкция</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="gap-2">
              <Icon name="MessageCircle" size={16} />
              <span className="hidden sm:inline">Поддержка</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="animate-fade-in">
            <Card className="border-primary/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-3xl flex items-center gap-3">
                  <Icon name="Sparkles" size={32} className="text-primary" />
                  Приветствуем!
                </CardTitle>
                <CardDescription className="text-base">
                  Участвуйте в нашей реферальной программе
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-2xl border border-primary/20">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Icon name="Gift" size={24} className="text-accent" />
                    Ваша награда
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-card/50 backdrop-blur p-4 rounded-xl border border-primary/20">
                      <div className="text-4xl font-bold text-primary mb-1">500 ₽</div>
                      <div className="text-sm text-muted-foreground">От нас</div>
                    </div>
                    <div className="bg-card/50 backdrop-blur p-4 rounded-xl border border-secondary/20">
                      <div className="text-4xl font-bold text-secondary mb-1">500 ₽</div>
                      <div className="text-sm text-muted-foreground">От Альфа-Банка</div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="text-center">
                    <div className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                      1000 ₽
                    </div>
                    <div className="text-muted-foreground">Общая сумма</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Icon name="CheckCircle2" size={20} className="text-accent" />
                    Что нужно сделать?
                  </h4>
                  <div className="space-y-3">
                    {[
                      "Оформить Альфа-Карту по ссылке",
                      "Активировать карту в приложении",
                      "Совершить покупку от 200 ₽",
                      "Отправить чек для получения бонуса"
                    ].map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                        <Badge variant="outline" className="mt-0.5 bg-primary text-primary-foreground">
                          {idx + 1}
                        </Badge>
                        <span className="flex-1">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleOrderCard}
                  size="lg" 
                  className="w-full text-lg h-14 bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-all animate-pulse-glow"
                >
                  <Icon name="Sparkles" size={20} className="mr-2" />
                  Оформить карту сейчас
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="card" className="animate-fade-in">
            <Card className="border-secondary/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-3xl flex items-center gap-3">
                  <Icon name="CreditCard" size={32} className="text-secondary" />
                  Оформление Альфа-Карты
                </CardTitle>
                <CardDescription>
                  Переходите по ссылке и получайте бонусы
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-br from-secondary/10 to-accent/10 p-6 rounded-2xl border border-secondary/20">
                  <h3 className="text-xl font-semibold mb-4">Преимущества Альфа-Карты</h3>
                  <div className="grid gap-3">
                    {[
                      { icon: "Percent", text: "Бесплатное обслуживание" },
                      { icon: "TrendingUp", text: "Кэшбэк каждый месяц" },
                      { icon: "Star", text: "Специальные предложения от партнёров" },
                      { icon: "Shield", text: "Надёжная защита средств" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-card/50 rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                          <Icon name={item.icon as any} size={20} className="text-secondary" />
                        </div>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-3">
                    Реферальная ссылка для оформления:
                  </p>
                  <code className="text-primary font-mono text-sm bg-card px-4 py-2 rounded-lg border border-primary/20 inline-block">
                    https://alfa.me/ASQWHN
                  </code>
                </div>

                <Button 
                  onClick={handleOrderCard}
                  size="lg" 
                  className="w-full text-lg h-14 bg-gradient-to-r from-secondary to-accent hover:opacity-90 transition-all"
                >
                  <Icon name="ExternalLink" size={20} className="mr-2" />
                  Перейти к оформлению
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="balance" className="animate-fade-in">
            <Card className="border-primary/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-3xl flex items-center gap-3">
                  <Icon name="Wallet" size={32} className="text-primary" />
                  Ваш баланс
                </CardTitle>
                <CardDescription>
                  Отслеживайте накопленные бонусы
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20">
                  <div className="text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                    {balance} ₽
                  </div>
                  <p className="text-muted-foreground text-lg">Доступно для вывода</p>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Icon name="History" size={20} className="text-accent" />
                    История начислений
                  </h4>
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="FileText" size={48} className="mx-auto mb-3 opacity-30" />
                    <p>Пока нет начислений</p>
                    <p className="text-sm mt-2">Оформите карту и получите первый бонус!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdraw" className="animate-fade-in">
            <Card className="border-accent/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-3xl flex items-center gap-3">
                  <Icon name="ArrowDownToLine" size={32} className="text-accent" />
                  Вывод средств
                </CardTitle>
                <CardDescription>
                  Выводите бонусы через СБП
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
                  <p className="text-sm flex items-center gap-2">
                    <Icon name="Info" size={16} className="text-primary" />
                    <span>Текущий баланс: <strong>{balance} ₽</strong></span>
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Icon name="Phone" size={16} />
                      Номер телефона
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+7 (999) 123-45-67"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank" className="flex items-center gap-2">
                      <Icon name="Building2" size={16} />
                      Название банка
                    </Label>
                    <Input
                      id="bank"
                      type="text"
                      placeholder="Например: Сбербанк"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount" className="flex items-center gap-2">
                      <Icon name="Banknote" size={16} />
                      Сумма вывода
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleWithdraw}
                  size="lg" 
                  className="w-full text-lg h-14 bg-gradient-to-r from-accent to-secondary hover:opacity-90 transition-all"
                >
                  <Icon name="Send" size={20} className="mr-2" />
                  Отправить заявку
                </Button>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                    <Icon name="Clock" size={16} className="mt-0.5" />
                    <span>Заявки обрабатываются в течение 24 часов</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="instructions" className="animate-fade-in">
            <Card className="border-primary/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-3xl flex items-center gap-3">
                  <Icon name="BookOpen" size={32} className="text-primary" />
                  Пошаговая инструкция
                </CardTitle>
                <CardDescription>
                  Как получить бонус 1000 ₽
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    {
                      step: "1",
                      title: "Оформите Альфа-Карту",
                      description: "Перейдите по реферальной ссылке и заполните заявку на карту",
                      icon: "CreditCard",
                      color: "primary"
                    },
                    {
                      step: "2",
                      title: "Активируйте карту",
                      description: "Получите карту и активируйте её в мобильном приложении Альфа-Банка",
                      icon: "Smartphone",
                      color: "secondary"
                    },
                    {
                      step: "3",
                      title: "Совершите покупку",
                      description: "Оплатите картой любую покупку от 200 ₽ в любом магазине",
                      icon: "ShoppingCart",
                      color: "accent"
                    },
                    {
                      step: "4",
                      title: "Отправьте чек",
                      description: "Отправьте чек о покупке в телеграм @Alfa_Bank778 для получения бонуса 500 ₽",
                      icon: "Receipt",
                      color: "primary"
                    }
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex gap-4 p-5 bg-gradient-to-br from-card to-muted/20 rounded-xl border border-primary/10 hover:border-primary/30 transition-all hover:scale-[1.02]"
                    >
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-${item.color} to-${item.color}/50 flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <Icon name={item.icon as any} size={28} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="text-sm font-bold">Шаг {item.step}</Badge>
                          <h4 className="font-bold text-lg">{item.title}</h4>
                        </div>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-2xl border border-primary/20">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Icon name="Trophy" size={24} className="text-accent" />
                    Итоговая награда
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-card/50 p-4 rounded-xl">
                      <div className="text-3xl font-bold text-primary mb-1">500 ₽</div>
                      <div className="text-sm text-muted-foreground">От реферальной программы</div>
                    </div>
                    <div className="bg-card/50 p-4 rounded-xl">
                      <div className="text-3xl font-bold text-secondary mb-1">500 ₽</div>
                      <div className="text-sm text-muted-foreground">От Альфа-Банка</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="animate-fade-in">
            <Card className="border-secondary/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-3xl flex items-center gap-3">
                  <Icon name="MessageCircle" size={32} className="text-secondary" />
                  Поддержка
                </CardTitle>
                <CardDescription>
                  Свяжитесь с нами для помощи
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-2xl border border-secondary/20">
                  <Icon name="Send" size={64} className="mx-auto mb-4 text-secondary" />
                  <h3 className="text-2xl font-bold mb-3">Телеграм поддержка</h3>
                  <p className="text-muted-foreground mb-6">
                    Отправьте чек о покупке для получения бонуса
                  </p>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-secondary to-accent hover:opacity-90"
                    onClick={() => window.open("https://t.me/Alfa_Bank778", "_blank")}
                  >
                    <Icon name="Send" size={20} className="mr-2" />
                    Открыть @Alfa_Bank778
                  </Button>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Icon name="HelpCircle" size={20} className="text-accent" />
                    Часто задаваемые вопросы
                  </h4>
                  <div className="space-y-3">
                    {[
                      {
                        q: "Когда я получу бонус?",
                        a: "После отправки чека бонус зачисляется в течение 24 часов"
                      },
                      {
                        q: "Можно ли вывести деньги сразу?",
                        a: "Да, средства доступны для вывода сразу после зачисления"
                      },
                      {
                        q: "Какие банки поддерживаются для вывода?",
                        a: "Любые российские банки через систему СБП"
                      }
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 bg-muted/30 rounded-lg">
                        <p className="font-semibold mb-2 flex items-start gap-2">
                          <Icon name="HelpCircle" size={16} className="mt-1 text-primary" />
                          {item.q}
                        </p>
                        <p className="text-sm text-muted-foreground ml-6">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>🚀 Реферальная программа Альфа-Карта</p>
          <p className="mt-1">Все права защищены © 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Index;